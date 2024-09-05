"use client"
import { uploadImage } from "@hooks/image"

import { es } from "./es"
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import { Skeleton, useMantineColorScheme } from "@mantine/core";
import { useController } from "react-hook-form";
import { MAXIMUM_MESSAGE_LENGTH, MINIMUM_MESSAGE_LENGTH } from "@lib/constants";

export interface TextEditorProps {
  name: string;
  required?: boolean;
  editable?: boolean;
  control: any
}

const TextEditor = ({ editable, name, control }: TextEditorProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: "La descripcion es necesaria",
      minLength: { value: MINIMUM_MESSAGE_LENGTH * 2, message: `Muy poco contenido, metele más` },
      maxLength: { value: MAXIMUM_MESSAGE_LENGTH ** 20, message: `Nojoda te pasastes.` }
    },
  });

  const { colorScheme } = useMantineColorScheme()

  const theEditor = useCreateBlockNote({
    defaultStyles: true,
    dictionary: es,
    enableBlockNoteExtensions: true,
    uploadFile: uploadImage,
  });

  const onDocumentChange = async () => {
    // Converts the editor's contents from Block objects to HTML and store to state.
    const html = await theEditor.blocksToHTMLLossy(theEditor.document);
    field.onChange(html);
  };


  return (
    <div className="min-h-32">

      <BlockNoteView
        editor={theEditor}
        editable={editable || true}
        onChange={onDocumentChange}
        theme={colorScheme}
      />
      {(error) && <span className="text-red-500">{error.message}</span>}
    </div>
  );
}

export const EditorLoader = () => {
  return (
    <div className="flex flex-col w-full min-h-32 gap-y-2">
      <Skeleton height="18" width="96%" radius="sm" />
      <Skeleton height="18" width="92%"radius="sm" />
      <Skeleton height="18" width="98%"radius="sm" />
      <Skeleton height="18" width="42%"radius="sm" />
    </div>
  )
}

export default TextEditor;