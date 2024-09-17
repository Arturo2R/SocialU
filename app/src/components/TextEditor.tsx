"use client"
import { uploadFileToConvex } from "@hooks/image"

import EditorJS from "@editorjs/editorjs";
// import CheckList from "@editorjs/checklist";
import Paragraph from "@editorjs/paragraph";
// import CodeBox from "@bomdi/codebox";
import Delimiter from "@editorjs/delimiter";
import Attachments from "@editorjs/attaches";
// import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
// import InlineCode from "@editorjs/inline-code";
import Link from "@editorjs/link";
import List from "@editorjs/list";
// import Quote from "@editorjs/quote";
// import SimpleImage from "@editorjs/simple-image";
import Header from "@editorjs/header"
import { memo, useEffect, useRef } from "react";
import { Skeleton, TypographyStylesProvider } from "@mantine/core";
import { useController } from "react-hook-form";
// import { boolean } from "convex-helpers/validators";

// import API from "../api/image" // Your server url

export interface TextEditorProps {
  data: any;
  editorblock: string;
  name: string;
  control: any;
  editable: boolean;
  setDataState: (data: any) => void;
}



const TextEditor = ({ data, editorblock, name, control, editable, setDataState }: TextEditorProps) => {
  const {
    field,
    formState,
    fieldState: { error },
  } = useController({
    name,
    control,
    // rules: {
    // required: "La descripcion es necesaria",
    // minLength: { value: MINIMUM_MESSAGE_LENGTH * 2, message: `Muy poco contenido, metele más` },
    // maxLength: { value: MAXIMUM_MESSAGE_LENGTH ** 20, message: `Nojoda te pasastes.` }
    // },
  });


  const EDITOR_JS_TOOLS: { [toolName: string]: any } = {
    header: Header,
    list: {
      class: List,
      inlineToolbar: true,
    },
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
    },
    image: {
      class: ImageTool,
      config: {

        uploader: {
          uploadByFile(file: File) {
            console.log("Uploading file:", file);
            return fetch("https://mild-gecko-296.convex.site/sendFile", {
              method: "POST",
              body: file,
              headers: {
                "Content-Type": file.type,
              }
            })
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`HTTP errotr! status: ${res.status}`);
                }
                return res.json();
              })
              .then((data) => {
                console.log("Server restponse:", data);
                if (!data.fileurl) {
                  throw new Error("Invalid response formatt");
                }
                return {
                  success: 1,
                  file: {
                    url: data.fileurl,
                    name: file.name,
                    size: file.size,
                  }
                };
              })
              .catch((error) => {
                console.log("Error uploading fileee:", error);
                return {
                  success: 0,
                  file: {
                    url: 'https://via.placeholder.com/158'
                  }
                };
              });
          },
        }
      },
    },
    Attaches: {
      class: Attachments,
      config: {
        uploader: {
          uploadByFile(file: File) {
            console.log("Uploading file:", file);
            return fetch("https://mild-gecko-296.convex.site/sendFile", {
              method: "POST",
              body: file,
              headers: {
                "Content-Type": file.type,
              }
            })
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`HTTP errotr! status: ${res.status}`);
                }
                return res.json();
              })
              .then((data) => {
                console.log("Server restponse:", data);
                if (!data.fileurl) {
                  throw new Error("Invalid response formatt");
                }
                return {
                  success: 1,
                  file: {
                    url: data.fileurl,
                    name: file.name,
                    size: file.size,
                  }
                };
              })
              .catch((error) => {
                console.error("Error uploading fileee:", error);
                return {
                  success: 0,
                  file: {
                    url: 'https://via.placeholder.com/150'
                  }
                };
              });
          },
        },
        fieldName: "file",
      },
    },
    // checkList: CheckList,
    link: Link,
    delimiter: Delimiter,
  };

  const ref = useRef<EditorJS | undefined>();
  //Initialize editorjs
  useEffect(() => {
    //Initialize editorjs if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorblock,
        readOnly: !editable,
        tools: EDITOR_JS_TOOLS,
        minHeight: 128,
        placeholder: 'Comparte lo que te tiene emocionao’...',
        async onChange(api, event) {
          // api.sanitizer.clean();
          api.saver.save().then((outputData) => {
            field.onChange(outputData);
          })

          // field.onChange(datachange);
        },
      });
      ref.current = editor;
    }

    //Add a return function to handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  return (
    <TypographyStylesProvider>
      <div className="w-full min-h-32" id={editorblock} />
      {(error) && <span className="text-red-500">{error.message}</span>}
    </TypographyStylesProvider>)
};


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

export default memo(TextEditor);