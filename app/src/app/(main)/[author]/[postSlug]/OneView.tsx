import { useMutation } from "convex/react"
import { api } from "@backend/api"
import { useEffect } from "react"


export const useAddView = (id: string) => {
    const view = useMutation(api.post.addView)
    useEffect(() => {
        view({slug: id})
    }, [])
}