// export default {
//     providers: [
//         {
//             domain: process.env.CONVEX_SITE_URL,
//             applicationID: "convex"   
//         }
//     ]
// }
export default {
    providers: [
        {
            domain: process.env.CLERK_BACKEND_URL,
            applicationID: "convex"
        }
    ]
}