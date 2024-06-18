"use client"
// import { RichTextEditor, Link } from '@mantine/tiptap';
// import { useEditor, BubbleMenu, FloatingMenu, Node } from '@tiptap/react';
// import Highlight from '@tiptap/extension-highlight';
// import StarterKit from '@tiptap/starter-kit';
// import Placeholder from '@tiptap/extension-placeholder';
import { uploadImage, checkImageAdultnessWithMicrosoft } from "../hooks/image"

import { es } from "./es"
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import { useColorScheme } from "@mantine/hooks";
import { Skeleton, TypographyStylesProvider, useMantineColorScheme } from "@mantine/core";
import { useController } from "react-hook-form";
import { MAXIMUM_MESSAGE_LENGTH, MINIMUM_MESSAGE_LENGTH } from "../constants";
import { FileDatabase } from "tabler-icons-react";
// import '@mantine/tiptap/styles.css';


// import { useController } from 'react-hook-form';
// import { MAXIMUM_MESSAGE_LENGTH, MINIMUM_MESSAGE_LENGTH } from '../constants';
// import { useEffect } from 'react';



// const content =
//   '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

interface TextEditorProps {
  name: string;
  required?: boolean;
  editable?: boolean;
  control: any
}

const TextEditor = ({ editable, name, required, control }: TextEditorProps) => {
  const {
    field,
    formState: { errors },
    fieldState: { invalid, error },
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