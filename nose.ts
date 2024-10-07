const mockFile = new File(["dummy content"], "example.png", { type: "image/png" });
function uploadByFile(file: File) {
  console.log(file)
  return fetch( process.env.NEXT_PUBLIC_CONVEX_SITE_URL + "/sendFile", {
    method: "POST",
    body: file,
    headers: {
      Accept: '*/*',
      "Content-Type": file!.type,
    }
  }).then((res: { json: () => any; }) => res.json())
    .then((data: { fileurl: string; storageId: string }) => {
      // console.log(data)
      return {
        success: 1,
        file: {
          url: data.fileurl
        }
      }
    }).catch((error) => {
      console.error("Error uploading fileee:", error);
    });
}
const algo = await uploadByFile(mockFile)
console.log("algoes:", algo)