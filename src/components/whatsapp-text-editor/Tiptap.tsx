import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit'
import { Toolbar } from "./Toolbar";
import sanitize from "sanitize-html";

type Props = {
  description: string;
  onChange: (richText: string) => void;
}

export function Tiptap(props: Props) {
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    immediatelyRender: false,
    content: props.description,
    editorProps: {
      attributes: {
        class: "flex min-h-[240px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      }
    },
    onUpdate({ editor }) {
      props.onChange(sanitize(editor.getHTML()));
      console.log(editor.getHTML());
    }
  })
  return (
    <div className="flex flex-col justify-stretch min-h-[270px]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}