'use server'

import { createClient } from '@vercel/kv';
import { permanentRedirect } from 'next/navigation'

export default async function Page({ params }:{params:{id:string}}) {
    const { id } = params;
    console.log("parmaa", id)
    
    try {
        console.log("seconddddd", process.env.NEXT_PUBLIC_SECONDKV_REST_API_URL)
        console.log("seconddddd", process.env.NEXT_PUBLIC_SECONDKV_REST_API_TOKEN)
        const kv = createClient({
            url: process.env.NEXT_PUBLIC_SECONDKV_REST_API_URL || "",
            token: process.env.NEXT_PUBLIC_SECONDKV_REST_API_TOKEN || "",
        });
        // Perform a search in the Edge runtime API based on the id parameter
        const redirectUrl:string | null = await kv.get(id);

        if (redirectUrl) {
            // Redirect to the result page
            permanentRedirect(redirectUrl);
        } else {
            // Redirect to the main page
           permanentRedirect('/');
        }
    } catch (error) {
        console.error('Error fetching redirect URL:', error);
        permanentRedirect('/');
    }
}
