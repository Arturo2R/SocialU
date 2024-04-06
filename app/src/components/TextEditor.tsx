import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import '@mantine/tiptap/styles.css';
import { useController } from 'react-hook-form';
import { MAXIMUM_MESSAGE_LENGTH, MINIMUM_MESSAGE_LENGTH } from '../constants';
import { useEffect } from 'react';
// const content =
//   '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

interface TextEditorProps {
  editor: any;
  setEditor: any;
  name: string;
  required?: boolean;
  editable?: boolean;
  control: any
}

export const TextEditor = ({editor, setEditor, editable, name, required, control}:TextEditorProps) => {
  const {
    field: { onChange, value, ref },
    formState: { errors },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules: { required: "La descripcion es necesaria",
    minLength: { value: MINIMUM_MESSAGE_LENGTH*2, message: `Muy poco contenido, metele más` },
    maxLength: { value: MAXIMUM_MESSAGE_LENGTH*2, message: `Nojoda te pasastes.` } },
  });
  
  const theEditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Mensaje' }),
      Link,
      Highlight,
    //   Underline,
    //   Superscript,
    //   SubScript,
    //   TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ],
      editorProps: {
        attributes: {
          class: 'min-h-32',
        },
      },
      editable: editable || true,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onChange(html);
      },
    // content,
  })
  
  useEffect(() => {
    setEditor(theEditor);
  }, [])
  

  return (
    <>
    <RichTextEditor classNames={{
      "root": "!border-none",
      
    }}  editor={theEditor}>
      {/* <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
        <RichTextEditor.H1 />
        <RichTextEditor.H2 />
        <RichTextEditor.H3 />
        <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>
        
        <RichTextEditor.ControlsGroup>
        <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>
          
          <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
          
        </RichTextEditor.Toolbar> */}
      

      <RichTextEditor.Content />
    </RichTextEditor>
    <div className="!border-none min-h-32" id="Dummy"></div>
    {(error) && <span className="text-red-500">{error.message}</span>}
    </>
  );
}