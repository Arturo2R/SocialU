"use client"
import { uploadImage } from "@hooks/image"

import { Skeleton, useMantineColorScheme } from "@mantine/core";
import { es } from "./es"
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { set, useController } from "react-hook-form";
import { MAXIMUM_MESSAGE_LENGTH, MINIMUM_MESSAGE_LENGTH } from "@lib/constants";

export interface TextEditorProps {
  name: string;
  required?: boolean;
  editable?: boolean;
  control: any;
  editorState: { html: string; markdown: string, blocks: any[] } | undefined;
  setEditorState: React.Dispatch<React.SetStateAction<{ html: string; markdown: string, blocks: any[] }>>;
}

const editorConfig = {
  defaultStyles: true,
  dictionary: es,
  enableBlockNoteExtensions: true,
};

const TextEditor = ({ editable, name, control, setEditorState }: TextEditorProps) => {
  const {
    field,
    formState,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: "La descripcion es necesaria",
      // minLength: { value: MINIMUM_MESSAGE_LENGTH * 2, message: `Muy poco contenido, metele más` },
      // maxLength: { value: MAXIMUM_MESSAGE_LENGTH ** 20, message: `Nojoda te pasastes.` }
    },
  });

  const { colorScheme } = useMantineColorScheme()

  const theEditor = useCreateBlockNote({
    ...editorConfig,
    uploadFile: uploadImage,
  });

  const onDocumentChange = async () => {
    // Converts the editor's contents from Block objects to HTML and store to state.
    const html = await theEditor.blocksToHTMLLossy(theEditor.document);
    field.onChange(html);
  };

  const onFormSubmit = async () => {
    // Converts the editor's contents from Block objects to HTML and store to state.
    const blocks = theEditor.document;
    console.log(blocks);
    const html = await theEditor.blocksToHTMLLossy(theEditor.document);
    const markdown = await theEditor.blocksToMarkdownLossy(theEditor.document);
    setEditorState({ html, markdown, blocks });
    field.onChange(blocks);
  }



  return (
    <div className="min-h-32">
      <BlockNoteView
        editor={theEditor}
        editable={editable || true}
        onChange={onFormSubmit}
        theme={colorScheme === "dark" ? "dark" : "light"}
      />
      {(error) && <span className="text-red-500">{error.message}</span>}
    </div>
  );
}

export const ViewPost = ({content}:{content:any[]}) => {
  const editor = useCreateBlockNote({
    ...editorConfig,
    initialContent: content
  });
  const { colorScheme } = useMantineColorScheme()
  return (
    <BlockNoteView
      editor={editor}
      editable={false}
      theme={colorScheme === "dark" ? "dark" : "light"}
    />
  )
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