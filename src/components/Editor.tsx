'use client';

import { useEditor, EditorContent, Editor as TipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import React from 'react';

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: TipTapEditor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50 rounded-t-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bold') ? 'bg-gray-200' : ''
        }`}
        title="Bold"
      >
        <span className="material-icons-outlined text-sm">format_bold</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('italic') ? 'bg-gray-200' : ''
        }`}
        title="Italic"
      >
        <span className="material-icons-outlined text-sm">format_italic</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('strike') ? 'bg-gray-200' : ''
        }`}
        title="Strike"
      >
        <span className="material-icons-outlined text-sm">format_strikethrough</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('code') ? 'bg-gray-200' : ''
        }`}
        title="Code"
      >
        <span className="material-icons-outlined text-sm">code</span>
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
        }`}
        title="Heading 1"
      >
        <span className="material-icons-outlined text-sm">looks_one</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
        }`}
        title="Heading 2"
      >
        <span className="material-icons-outlined text-sm">looks_two</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
        }`}
        title="Heading 3"
      >
        <span className="material-icons-outlined text-sm">looks_3</span>
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bulletList') ? 'bg-gray-200' : ''
        }`}
        title="Bullet List"
      >
        <span className="material-icons-outlined text-sm">format_list_bulleted</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('orderedList') ? 'bg-gray-200' : ''
        }`}
        title="Ordered List"
      >
        <span className="material-icons-outlined text-sm">format_list_numbered</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('blockquote') ? 'bg-gray-200' : ''
        }`}
        title="Quote"
      >
        <span className="material-icons-outlined text-sm">format_quote</span>
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <button
        onClick={() => {
          const url = window.prompt('Enter the URL of the image:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="p-2 rounded hover:bg-gray-200 transition-colors"
        title="Insert Image"
      >
        <span className="material-icons-outlined text-sm">image</span>
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Enter the URL:');
          if (url) {
            editor
              .chain()
              .focus()
              .setLink({ href: url })
              .run();
          }
        }}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('link') ? 'bg-gray-200' : ''
        }`}
        title="Insert Link"
      >
        <span className="material-icons-outlined text-sm">link</span>
      </button>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        className="p-2 rounded hover:bg-gray-200 transition-colors"
        title="Remove Link"
      >
        <span className="material-icons-outlined text-sm">link_off</span>
      </button>
    </div>
  );
};

export default function Editor({ value, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bold: {},
        italic: {},
        strike: {},
        code: {},
        bulletList: {},
        orderedList: {},
        blockquote: {},
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#751731] hover:text-[#F4D165] transition-colors',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
  });

  // Update editor content when value prop changes
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-6 min-h-[500px] border-t border-gray-200 focus-within:ring-2 focus-within:ring-[#751731] focus-within:ring-opacity-50 bg-white"
      />
      <style jsx global>{`
        .ProseMirror {
          min-height: 500px;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin: 0.5rem;
          background-color: white;
          font-size: 1rem;
          line-height: 1.75;
        }
        .ProseMirror:focus {
          outline: none;
          border-color: #751731;
        }
        .ProseMirror > * + * {
          margin-top: 0.75em;
        }
        .ProseMirror p {
          margin: 1em 0;
        }
        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3 {
          line-height: 1.1;
          font-weight: 600;
          margin: 1.5em 0 0.5em;
        }
        .ProseMirror h1 { font-size: 2em; }
        .ProseMirror h2 { font-size: 1.5em; }
        .ProseMirror h3 { font-size: 1.25em; }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #751731;
          padding-left: 1em;
          margin: 1em 0;
          color: #666;
        }
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
} 