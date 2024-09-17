import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { attachments } from "@lib/firebase";

import posthog from "posthog-js";
import { useMutation } from "convex/react";
import { api } from "@backend/api";


export const uploadFile = async (file: File): Promise<string> => {
    const imageRef = ref(attachments, file.name);
    try {
        const uploadResult = await uploadBytes(imageRef, file, {
            contentType: file.type,
        })
        const url = await getDownloadURL(uploadResult.ref)

        console.log(url)
        return url
    } catch (error) {
        console.error(error.message)
        posthog.capture('upload_image_error', {
            message: error.message,
            fileName: file.name,
        });
        return "error"
    }
}

export const uploadFileToConvex = async (file: File): Promise<string> => {
    const generateUploadUrl = useMutation(api.post.generateUploadUrl)
    const getUrl = useMutation(api.post.getFileUrl)
    try {
        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();
        // Step 2: POST the file to the URL

        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file
        }).then((res) => res.json());

        const { storageId } = result;

        // Step 3: Save the newly allocated storage id to the database
        const url = await getUrl({ imageId: storageId });

        return url || "nada"
    } catch (error: any) {
        console.error(error.message)
        posthog.capture('upload_image_error', {
            message: error.message,
            fileName: file.name,
        });
        return "error"
    }
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
