import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useRef, useState } from "react";
import { postsBanners } from "../firebase";
import '@mantine/dropzone/styles.css';

import { Group, Text, rem, Image } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, } from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';

export default function ImageDropzone({
  image,
  setImage,
  imageUrl,
  setImageUrl,
  setImageLoading,
  setImageData,
}: {
  image: File | null | string;
  setImage: (image: File | null) => void;
  imageUrl: string | null;
  setImageLoading: (state: "loading" | "loaded" | null) => void;
  setImageUrl: (imageUrl: string | null) => void;
  setImageData: ({ width, height }: { width: number, height: number }) => void;
}) {
  const [i64, set64] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // const addImage = (file: File[]) => useStore.setState({ image: file[0].name });

  const addImage = (file: File[]) => {
    console.log(file);


    setImage(file[0]);
    const reader = new FileReader();
    reader.onloadend = function () {
      if (typeof reader.result === "string") set64(reader.result);
    };
    reader.readAsDataURL(file[0]);

    const imageRef = ref(postsBanners, file[0].name);

    uploadBytes(imageRef, file[0], {
      contentType: "image/webp",
    }).then((image) => {
      // put the image url in the state
      getDownloadURL(image.ref).then((url) => setImageUrl(url));
    });
  };



  return (
    <>
      {i64 && image ? (
        <Image radius="md" src={i64} ref={imageRef} onLoad={() => {
          if (imageRef.current) {
            const { naturalWidth, naturalHeight } = imageRef.current;
            console.log("Natural Width:", naturalWidth);
            console.log("Natural Height:", naturalHeight);
            setImageData({ width: naturalWidth, height: naturalHeight });
          }
        }} />
      ) : (
        <Dropzone
          onDrop={(files: File[]) => {
            // uploadBytes(storageRef, file);
            setImageLoading("loading");
            addImage(files);
            // console.log("accepted files", files);
          }}
          onReject={(files: unknown) => console.log("rejected files", files)}
          maxSize={10 * 1024 ** 2}
          multiple={false}
          accept={IMAGE_MIME_TYPE}

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
                Imagén
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                5 mb Max
              </Text>
            </div>
          </Group>
        </Dropzone>)}
    </>
  );
}