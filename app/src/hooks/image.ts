import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { attachments } from "@lib/firebase";

import posthog from "posthog-js";
import { useAction, useMutation } from "convex/react";
import { api } from "@backend/api";

import * as UpChunk from '@mux/upchunk';
import { useState } from "react";


export const uploadFile = async (file: File): Promise<string> => {
    const imageRef = ref(attachments, file.name);
    try {
        const uploadResult = await uploadBytes(imageRef, file, {
            contentType: file.type,
        })
        const url = await getDownloadURL(uploadResult.ref)

        console.log(url)
        return url
    } catch (error: any) {
        console.error(error.message)
        posthog.capture('upload_image_error', {
            message: error.message,
            fileName: file.name,
        });
        return "error"
    }
}

export const uploadFileToConvex = async (file: File): Promise<string> => {
    console.log("AJAA y la imagen ", file)
    try {
        console.log(file)

        const postUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL + "/sendFile";
        console.log("postUrl", postUrl)

        const response = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file
        })
        const result = await response.json()
        console.log("result", result)
        return result.fileurl
    } catch (error: any) {
        console.error(error)
        posthog.capture('upload_image_error', {
            message: error.message || "no hay mensaje",
            fileName: file?.name || "nada",
        });
        return "https://mild-gecko-296.convex.cloud/api/storage/1b96a220-8c22-4187-8505-65038900c812"
    }
}

export type Load = "loading" | "loaded" | "error" | null

export const useUploadVideoToMux = (): { upload: (file: File) => Promise<void>, videoUrl: string, progress?: number, status: Load, aspectRatio?: string } => {
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [uploadStatus, setUploadStatus] = useState<Load>(null)
    const [url, setUrl] = useState<string>("")
    const generateUploadVideoUrl = useAction(api.media.generateUploadVideoUrl);
    const getVideoUrl = useAction(api.media.getUploadedVideoUrl);
    const [aspectRatio, setAspectRatio] = useState<string|undefined>()

    const uploadYa = async (file: File) => {
        setUploadStatus("loading")
        const { mux_asset_id, url: uploadUrl, videoId } = await generateUploadVideoUrl({})
        console.log("mux_asset_id", mux_asset_id, "url", url, "videoId", videoId)
        const upload = UpChunk.createUpload({
            endpoint: uploadUrl,
            file,
            chunkSize: 1024 * 5,

        })

        upload.on('error', (error) => {
            setUploadStatus("error")
            console.error('Upload failed:', error)
            posthog.capture('upload_video_error', {
                message: error.detail || "no hay mensaje",
                fileName: file.name,
            });
        })

        upload.on('progress', (progress) => {
            setUploadProgress(progress.detail)
            console.log('Upload progress:', progress.detail)
            setUploadStatus("loading")
        })

        upload.on('success', async () => {
            let { id, aspectRatio } = await getVideoUrl({ uploadId: mux_asset_id })
            setUrl(id!)
            setAspectRatio(aspectRatio)
            setUploadStatus("loaded")
            console.log('Upload complete')
        })

    }
    return { upload: uploadYa, videoUrl: url, progress: uploadProgress, status: uploadStatus, aspectRatio }
}

export const getBase64Image = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = function () {
        if (typeof reader.result === "string") {
            return reader.result;
        } else (
            reader.readAsDataURL(file)
        )
    };

}

export const useCheckImageAdultnessWithMicrosoft = async (url: string, cacheImage?: boolean): Promise<boolean> => {
    let data = {
        "DataRepresentation": "URL",
        "Value": url
    };
    let isValid: boolean = false
    try {
        let response = await fetch(process.env.NEXT_PUBLIC_AZURE_NAP_URL + `/contentmoderator/moderate/v1.0/ProcessImage/Evaluate${cacheImage ? "?CacheImage=true" : ""}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_AZURE_NAP_KEY || "",
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();
        isValid = result.IsImageAdultClassified
    } catch (error) {
        console.error("Un error mirando la imagen", error)
    }
    return isValid
}
