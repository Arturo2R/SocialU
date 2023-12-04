import { put } from "@vercel/blob";
// import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next';

export const runtime = "edge";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(401).json(
      "Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.")
  }
  const file = req.body || "";
  const filename = req.headers["x-vercel-filename"] || "file.txt";
  const contentType = req.headers["content-type"] || "text/plain";
  const fileType = `.${contentType.split("/")[1]}`;
33
  // construct final filename based on content-type if not provided
  const finalName:string = filename.includes(fileType) ? filename : `${filename}${fileType}`;
  console.log(finalName)
  
  const blob = await put(finalName, file, {
    contentType,
    access: "public",
  });

  res.status(200)
}