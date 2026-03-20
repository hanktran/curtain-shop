'use client'
import { useState } from 'react'

import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent,useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  name: string
  initialContent?: string
  onChange?: (html: string) => void
}

export function TiptapEditor({ name, initialContent = '', onChange }: Props) {
  const [html, setHtml] = useState(initialContent)

  const editor = useEditor({
    immediatelyRender: false, // required in Tiptap v3 for Next.js SSR
    extensions: [
      StarterKit.configure({
        undoRedo: {}, // enabled by default in v3 (replaces 'history' key)
      }),
      TextStyle, // required peer for Color
      Color,
      Underline,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const h = editor.getHTML()
      setHtml(h)
      onChange?.(h)
    },
  })

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b bg-muted/40 flex-wrap">
        {[
          { label: 'B',  action: () => editor?.chain().focus().toggleBold().run(),      active: editor?.isActive('bold') },
          { label: 'I',  action: () => editor?.chain().focus().toggleItalic().run(),    active: editor?.isActive('italic') },
          { label: 'U',  action: () => editor?.chain().focus().toggleUnderline().run(), active: editor?.isActive('underline') },
          { label: 'S',  action: () => editor?.chain().focus().toggleStrike().run(),    active: editor?.isActive('strike') },
        ].map(({ label, action, active }) => (
          <button
            key={label}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); action() }}
            className={`px-2 py-1 text-xs rounded border ${active ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="min-h-[80px] p-3 text-sm focus-within:outline-none [&_.tiptap]:min-h-[56px] [&_.tiptap]:outline-none"
      />

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={html} />
    </div>
  )
}
