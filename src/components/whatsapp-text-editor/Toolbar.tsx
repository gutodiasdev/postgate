"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic
} from "lucide-react";
import { Toggle } from "../ui/toggle";

type Props = {
  editor: Editor | null
}

export function Toolbar(props: Props) {
  if (!props.editor) {
    return null;
  }
  return (
    <div className="flex items-center gap-x-1 bg-transparent rounded-md my-4">
      <Toggle
        size="sm"
        pressed={props.editor.isActive("bold")}
        onPressedChange={() => {
          props.editor?.chain().focus().toggleBold().run();
        }}
      >
        <Bold size={16}/>
      </Toggle>
      <Toggle
        size="sm"
        pressed={props.editor.isActive("italic")}
        onPressedChange={() => {
          props.editor?.chain().focus().toggleItalic().run();
        }}
      >
        <Italic size={16}/>
      </Toggle>
      <Toggle
        size="sm"
        pressed={props.editor.isActive("strike")}
        onPressedChange={() => {
          props.editor?.chain().focus().toggleStrike().run();
        }}
      >
        <Strikethrough size={16}/>
      </Toggle>
    </div>
  )
}