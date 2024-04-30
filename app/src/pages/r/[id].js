import { createClient } from '@vercel/kv';
const kv = createClient({
    url: process.env.NEXT_PUBLIC_NEWKV_REST_API_URL || "",
    token: process.env.NEXT_PUBLIC_NEWKV_REST_API_TOKEN || "",
  });
export async function getServerSideProps(context) {
    const { id } = context.query;
    // Perform a search in the Edge runtime API based on the id parameter
    const redirectUrl = await kv.get(id);

    console.log('redirect: ',redirectUrl)

    if (redirectUrl) {
        // Redirect to the result page
        return {
            redirect: {
                destination: redirectUrl,
                permanent: true, // Set to true if the redirect is permanent
            },
        };
    } 
    else {
        // Redirect to the main page
        return {
            redirect: {
                destination: '/',
                permanent: true,
            },
        };
    }
}

export default function MyPage() {

    // Render your page content here

    return (
        <div>
            ajapi
        </div>
    );
}
