"use client"
import { uploadFileToConvex } from "@hooks/image"

import { Skeleton } from "@mantine/core";
import { es } from "./es"

// Add the missing 'emoji' property to the 'slash_menu' dictionary
// es.slash_menu.emoji = {
//   title: "Emoji",
//   subtext: "Insert an emoji",
//   aliases: ["emoji"],
//   group: "Insert",
// };
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { set, useController } from "react-hook-form";
import { MAXIMUM_MESSAGE_LENGTH, MINIMUM_MESSAGE_LENGTH } from "@lib/constants";
import { api } from "@backend/api";
import { useAction } from "convex/react";
import { modals } from "@mantine/modals";
import { useState } from "react";
import posthog from "posthog-js";

import { useColorScheme } from '@mantine/hooks';
export interface TextEditorProps {
  name: string;
  required?: boolean;
  editable?: boolean;
  control: any;
  setImageLoading: React.Dispatch<React.SetStateAction<"loading" | "loaded" | null>>;
  setEditorState: React.Dispatch<React.SetStateAction<{ html: string; markdown: string, blocks: any[] } | undefined>>;
}

const editorConfig = {
  defaultStyles: true,
  dictionary: es,
  enableBlockNoteExtensions: true,
};

const TextEditor = ({ editable, name, control, setEditorState, setImageLoading }: TextEditorProps) => {
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

  const checkImage = useAction(api.post.checkImage)

  const colorScheme = useColorScheme();

  const openYouCantModal = () => modals.open({
    title: "¡Que Pensabas!",
    children: (
      <h1 className="text-2xl">No Puedes Subir Porno En Esta <b className="text-orange-600">Red Social</b></h1>
    )
  })
  const [contentFile, setFile] = useState<File>()

  const theEditor = useCreateBlockNote({
    ...editorConfig,
    uploadFile: async (file) => {
      setImageLoading('loading')
      setFile(file);
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("File reading failed"));
          }
        };
        reader.onerror = () => reject(new Error("File reading failed"));
        reader.readAsDataURL(file);
      });
    },
    resolveFileUrl: async (url) => {
      console.log("resolving url")
      console.log(contentFile)
      const fileUploadedUrl = await uploadFileToConvex(contentFile!)
      console.log(fileUploadedUrl)
      if (contentFile?.type.startsWith("image/")) {
        const isPornImage = await checkImage({ inputType: "url", url: fileUploadedUrl });
        if (isPornImage) {
          openYouCantModal()
          posthog.capture("obscene_image", {
            // email: user?.email,
            image_url: fileUploadedUrl,
          })
          setImageLoading('loaded')
          return ''
        } else {
          setImageLoading('loaded')
          return fileUploadedUrl
        }
      } else {
        setImageLoading('loaded')
        return fileUploadedUrl
      }
    }
  });

  const onDocumentChange = async () => {
    // Converts the editor's contents from Block objects to HTML and store to state.
    const html = await theEditor.blocksToHTMLLossy(theEditor.document);
    field.onChange(html);
  };

  const onFormSubmit = async () => {
    // Converts the editor's contents from Block objects to HTML and store to state.
    const blocks = theEditor.document;
    // console.log(blocks);
    const html = await theEditor.blocksToHTMLLossy(theEditor.document);
    const markdown = await theEditor.blocksToMarkdownLossy(theEditor.document);
    setEditorState({ html, markdown, blocks });
    field.onChange(blocks);
  }

  const onEditorChange = async () => {
    field.onChange(theEditor);
  }



  return (
    <div className="min-h-32" data-posthog-capture="no">
      <BlockNoteView
        editor={theEditor}
        editable={editable || true}
        onChange={onEditorChange}
        theme={colorScheme}
      />
      {(error) && <span className="text-red-500">{error.message}</span>}
    </div>
  );
}

export const ViewPost = ({ content }: { content: any[] }) => {
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
      <Skeleton height="18" width="92%" radius="sm" />
      <Skeleton height="18" width="98%" radius="sm" />
      <Skeleton height="18" width="42%" radius="sm" />
    </div>
  )
}

export default TextEditor;