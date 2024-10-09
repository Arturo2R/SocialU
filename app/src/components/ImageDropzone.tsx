import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { postsBanners } from "@lib/firebase";
import '@mantine/dropzone/styles.css';

import { Group, Text, rem, Image, Progress } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, } from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { api } from "@backend/api";
import { useAction, useMutation, useQuery } from "convex/react";
import posthog from "posthog-js";
import { modals } from "@mantine/modals";
import { useUploadVideoToMux } from "@hooks/image";
import { VideoPlayer } from "./VideoPlayer";
// import { checkImageAdultnessWithMicrosoft, useCheckImageAdultnessWithMicrosoft } from "@hooks/image";


export default function ImageDropzone(
  {
    image,
    setImage,
    imageUrl,
    setImageUrl,
    setImageLoading,
    setImageData,
    status,
    upload,
    videoUrl,
    progress
  }: {
    image: File | null | string;
    setImage: (image: File | null) => void;
    imageUrl: string | null;
    setImageLoading: (state: "loading" | "loaded" | null | "error") => void;
    setImageUrl: (imageUrl: string | null) => void;
    setImageData: ({ width, height }: { width: number, height: number }) => void;
    status: "loading" | "loaded" | "error" | null;
    upload: (file: File) => Promise<void>;
    videoUrl: string;
    progress?: number;
  }) {
  const [i64, set64] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const generateUploadUrl = useMutation(api.post.generateUploadUrl)
  const getUrl = useMutation(api.post.getFileUrl)
  const checkImage = useAction(api.post.checkImage)
  // const addImage = (file: File[]) => useStore.setState({ image: file[0].name });

  const openYouCantModal = () => modals.open({
    title: "¡Que Pensabas!",
    children: (
      <h1 className="text-2xl">No Puedes Subir Porno En Esta <b className="text-orange-600">Red Social</b></h1>
    )
  })



  const addImage = async (file: File) => {
    setImageLoading("loading")

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = function () {
      if (typeof reader.result === "string") set64(reader.result);
    };
    reader.readAsDataURL(file);

    // Step 1: Get a short-lived upload URL

    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    }).then((res) => res.json());

    const { storageId } = result;

    // Step 3: Save the newly allocated storage id to the database
    const url = await getUrl({ imageId: storageId });



    if (url) {
      setImageUrl(url)

      const isPorn = await checkImage({ url, inputType: "url" });
      console.log("que tan valido es", isPorn)
      if (isPorn) {
        openYouCantModal()
        setImage(null); set64(null); setImageUrl(null);
        setImageLoading("loaded")
        posthog.capture("obscene_image", {
          // email: user?.email,
          image_url: imageUrl,
        })
      }
      setImageLoading("loaded")
    }
  };

  // useEffect(() => {
  //   async function fetchAndCheckImage() {
  //     if (imageUrl) {
  //       const isValid = await checkImageAdultnessWithMicrosoft(imageUrl); // Adjusted to direct API call or function usage
  //       if (!isValid) {
  //         setImage(null);
  //         set64(null);
  //         setImageUrl(null);
  //       }
  //     }
  //   }

  //   fetchAndCheckImage();
  // }, [imageUrl]);



  return (
    <>
      {((i64 && image) || status == "loaded") ?
        ((i64 && image) ? (
          <Image radius="md" src={i64} ref={imageRef} onLoad={() => {
            if (imageRef.current) {
              const { naturalWidth, naturalHeight } = imageRef.current;
              console.log("Natural Width:", naturalWidth);
              console.log("Natural Height:", naturalHeight);
              setImageData({ width: naturalWidth, height: naturalHeight });
            }
          }} />
        ) : status === "loaded" && (
          <VideoPlayer playbackId={videoUrl} />
        )
        ) : (
          <Dropzone
            onDrop={async (files: File[]) => {
              // uploadBytes(storageRef, file);
              if (files[0] && files[0].type.startsWith('image/')) {
                addImage(files[0]);
              } else if (files[0] && files[0].type.startsWith('video/')) {

                await upload(files[0]);

              }
              // console.log("accepted files", files);
            }}
            onReject={(files: unknown) => console.log("rejected files", files)}
            maxSize={50 * 1024 ** 2}
            multiple={false}
            accept={{
              'image/*': [], // All images
              'video/*': [], // All videos
            }}
            loading={(status && status === "loading")}

          >
            <Group justify="center" gap="xl" mih={70} style={{ pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <IconUpload
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                  stroke="1.5"
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                  stroke="1.5"
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                  stroke="1.5"
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  {status === "loading" ? "Cargando" : "Imagen o Video"}
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  50 mb Max
                </Text>
              </div>
            </Group>
            {(progress && (status === "loading") && (progress > 0)) && (
              <>
                <Progress color="orange" size="xl" value={progress} />
                <Text size="xs" c="dimmed" className="text-center">No salgas de la aplicación</Text>
              </>
            )}
          </Dropzone>)}
    </>
  );
}