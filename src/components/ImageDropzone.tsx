import { Group, Text, useMantineTheme, MantineTheme } from "@mantine/core";
import { Upload, Photo, X, Icon as TablerIcon } from "tabler-icons-react";
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useStore } from "../store";

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

export default function ImageDropzone() {
  const addImage = (file: File[]) => useStore.setState({ image: file[0].name });

  const theme = useMantineTheme();
  return (
    <Dropzone
      onDrop={(files: File[]) => {
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
  );
}
