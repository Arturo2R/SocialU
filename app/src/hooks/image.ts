import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { attachments } from "../firebase";

import posthog from "posthog-js";

export const uploadImage = async (file: File) => {
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

export const checkImageAdultnessWithMicrosoft = async (url: string, cacheImage?: boolean): Promise<boolean> => {
    let data = {
        "DataRepresentation": "URL",
        "Value": url
    };
    let isPorn: boolean = false
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
        isPorn = result.IsImageAdultClassified
    } catch (error) {
        console.error("Un error mirando la imagen", error)
    }
    return isPorn
}
