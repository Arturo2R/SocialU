import { checkImage } from "../pages/crear";

process.env.NEXT_PUBLIC_AZURE_NAP_URL = "https://social-image-blocker.cognitiveservices.azure.com/"
process.env.NEXT_PUBLIC_AZURE_NAP_KEY = "00719a74bc0f46f28fe23528291b7601"

describe("Image Blocker", () => {
    test("Check a titpic", async () => {
        expect(await checkImage("https://firebasestorage.googleapis.com/v0/b/socialu-c62e6.appspot.com/o/postsBanners%2Ftetas.png?alt=media&token=bfa2e03c-40e0-4217-a99a-1e62cc338acd", true))
            .toBe(true)
    });

    test("Check a couple fkin on the table", async () => {
        expect(await checkImage("https://firebasestorage.googleapis.com/v0/b/socialu-c62e6.appspot.com/o/postsBanners%2F5972.gif?alt=media&token=0f61fc7a-b725-440e-89e8-e7bc988ac300", true))
            .toBe(true)
    });

    test("Check a nude woman sunbathing", async () => {
        expect(await checkImage("https://firebasestorage.googleapis.com/v0/b/socialu-c62e6.appspot.com/o/postsBanners%2Fdarina-l-under-the-spanish-sun-hegreart_12.jpg?alt=media&token=df533ff9-d502-49a2-82d3-db57c4e99099", true))
            .toBe(true)
    });

    test("Check of a girl showing her ass", async () => {
        expect(await checkImage("https://firebasestorage.googleapis.com/v0/b/socialu-c62e6.appspot.com/o/postsBanners%2F28487583.webp?alt=media&token=bd0acffd-2910-46cd-b0be-11487f75c935", true))
            .toBe(false)
    });

    test("Check a beutiful woman lieying nude on a bed", async () => {
        expect(await checkImage("https://firebasestorage.googleapis.com/v0/b/socialu-c62e6.appspot.com/o/postsBanners%2Fdeor4do-6a45e27c-da39-456c-ab24-68a5b84d2ca2.jpg?alt=media&token=31d24d64-3796-44b8-9fa6-e551578df17e", true))
            .toBe(true)
    });
});
