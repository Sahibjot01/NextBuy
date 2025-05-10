"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "../ui/toggle";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  UnderlineIcon,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";

const Tiptap = ({ value }: { value: string }) => {
  const { setValue } = useFormContext();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-5",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-5",
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Add a longer description for your products",
        emptyNodeClass:
          "first:before:text-gray-600 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
      }),
      Underline,
    ],

    content: value,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setValue("description", content, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {editor && (
        <div className="border border-input rounded-md">
          <Toggle
            size={"sm"}
            pressed={editor.isActive("bold")}
            onPressedChange={() => {
              editor.chain().focus().toggleBold().run();
            }}
          >
            <Bold className="w-4 h-4" />
          </Toggle>
          <Toggle
            size={"sm"}
            pressed={editor.isActive("italic")}
            onPressedChange={() => {
              editor.chain().focus().toggleItalic().run();
            }}
          >
            <Italic className="w-4 h-4" />
          </Toggle>
          <Toggle
            size={"sm"}
            pressed={editor.isActive("underline")}
            onPressedChange={() => {
              editor.chain().focus().toggleUnderline().run();
            }}
          >
            <UnderlineIcon className="w-4 h-4" />
          </Toggle>
          <Toggle
            size={"sm"}
            pressed={editor.isActive("strike")}
            onPressedChange={() => {
              editor.chain().focus().toggleStrike().run();
            }}
          >
            <Strikethrough className="w-4 h-4" />
          </Toggle>
          <Toggle
            size={"sm"}
            pressed={editor.isActive("orderedList")}
            onPressedChange={() => {
              editor.chain().focus().toggleOrderedList().run();
            }}
          >
            <ListOrdered className="w-4 h-4" />
          </Toggle>
          <Toggle
            size={"sm"}
            pressed={editor.isActive("bulletList")}
            onPressedChange={() => {
              editor.chain().focus().toggleBulletList().run();
            }}
          >
            <List className="w-4 h-4" />
          </Toggle>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
