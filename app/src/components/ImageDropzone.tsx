import {
  Group,
  Image,
  MantineTheme,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";
import { Icon as TablerIcon, Photo, Upload, X } from "tabler-icons-react";
import { postsBanners } from "../firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

const dropzoneChildren = (status: DropzoneStatus, theme: MantineTheme) => (
  <Group position="center" spacing="xs" style={{ pointerEvents: "none" }}>
    <ImageUploadIcon status={status} className="text-orange-200" size={80} />

    <div className="text-gray-400">
      <Text size="xl" inline>
        Imagén Principal (Opcional)
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Envia solo una imagen de máximo 5 Mb
      </Text>
    </div>
  </Group>
);

export default function ImageDropzone({
  image,
  setImage,
  imageUrl,
  setImageUrl,
}: {
  image: File | null | string;
  setImage: (image: File | null) => void;
  imageUrl: string | null;
  setImageUrl: (imageUrl: string | null) => void;
}) {
  // image state
  const [i64, set64] = useState<string | null>(null);

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

  const theme = useMantineTheme();
  return (
    <>
      {i64 && image ? (
        <Image radius="md" src={i64} />
      ) : (
        <Dropzone
          onDrop={(files: File[]) => {
            // uploadBytes(storageRef, file);
            addImage(files);
            console.log("accepted files", files);
          }}
          onReject={(files: unknown) => console.log("rejected files", files)}
          maxSize={3 * 1024 ** 2}
          multiple={false}
          accept={IMAGE_MIME_TYPE}
        >
          {(status: DropzoneStatus) => dropzoneChildren(status, theme)}
        </Dropzone>
      )}
    </>
  );
}
