'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Box, HStack, IconButton, Input } from '@chakra-ui/react';
import { FiBold, FiItalic, FiList, FiLink, FiImage } from 'react-icons/fi';
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuListOrdered,
} from 'react-icons/lu';
import { useState, useCallback, useEffect } from 'react';
import './tiptap-styles.css';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

export default function TiptapEditor({
  content,
  onChange,
  disabled = false,
}: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tiptap-link',
        },
      }),
    ],
    content,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleAddLink = useCallback(() => {
    if (linkUrl && editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  }, [editor, linkUrl]);

  const handleAddImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  }, [editor, imageUrl]);

  if (!editor) {
    return null;
  }

  return (
    <Box
      borderWidth="2px"
      borderColor="border"
      borderRadius="lg"
      overflow="hidden"
      bg="bg.canvas"
    >
      <HStack
        p={2}
        borderBottomWidth="1px"
        borderColor="border"
        bg="bg.subtle"
        flexWrap="wrap"
        gap={1}
      >
        <IconButton
          aria-label="Bold"
          size="sm"
          variant={editor.isActive('bold') ? 'solid' : 'ghost'}
          color={editor.isActive('bold') ? 'colorPalette.fg' : 'fg'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
        >
          <FiBold />
        </IconButton>
        <IconButton
          aria-label="Italic"
          size="sm"
          variant={editor.isActive('italic') ? 'solid' : 'ghost'}
          color={editor.isActive('italic') ? 'colorPalette.fg' : 'fg'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
        >
          <FiItalic />
        </IconButton>
        <IconButton
          aria-label="Heading 1"
          size="sm"
          variant={editor.isActive('heading', { level: 1 }) ? 'solid' : 'ghost'}
          color={
            editor.isActive('heading', { level: 1 }) ? 'colorPalette.fg' : 'fg'
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          disabled={disabled}
        >
          <LuHeading1 />
        </IconButton>
        <IconButton
          aria-label="Heading 2"
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'solid' : 'ghost'}
          color={
            editor.isActive('heading', { level: 2 }) ? 'colorPalette.fg' : 'fg'
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={disabled}
        >
          <LuHeading2 />
        </IconButton>
        <IconButton
          aria-label="Heading 3"
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'solid' : 'ghost'}
          color={
            editor.isActive('heading', { level: 3 }) ? 'colorPalette.fg' : 'fg'
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={disabled}
        >
          <LuHeading3 />
        </IconButton>
        <IconButton
          aria-label="Bullet List"
          size="sm"
          variant={editor.isActive('bulletList') ? 'solid' : 'ghost'}
          color={editor.isActive('bulletList') ? 'colorPalette.fg' : 'fg'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
        >
          <FiList />
        </IconButton>
        <IconButton
          aria-label="Ordered List"
          size="sm"
          variant={editor.isActive('orderedList') ? 'solid' : 'ghost'}
          color={editor.isActive('orderedList') ? 'colorPalette.fg' : 'fg'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
        >
          <LuListOrdered />
        </IconButton>
        <IconButton
          aria-label="Add Link"
          size="sm"
          variant={showLinkInput ? 'solid' : 'ghost'}
          color={showLinkInput ? 'colorPalette.fg' : 'fg'}
          onClick={() => {
            setShowLinkInput(!showLinkInput);
            setShowImageInput(false);
          }}
          disabled={disabled}
        >
          <FiLink />
        </IconButton>
        <IconButton
          aria-label="Add Image"
          size="sm"
          variant={showImageInput ? 'solid' : 'ghost'}
          color={showImageInput ? 'colorPalette.fg' : 'fg'}
          onClick={() => {
            setShowImageInput(!showImageInput);
            setShowLinkInput(false);
          }}
          disabled={disabled}
        >
          <FiImage />
        </IconButton>
      </HStack>

      {showLinkInput && (
        <HStack
          p={2}
          borderBottomWidth="1px"
          borderColor="border"
          bg="bg.subtle"
        >
          <Input
            placeholder="Enter URL"
            size="sm"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddLink();
              }
            }}
          />
          <IconButton
            aria-label="Apply Link"
            size="sm"
            variant="solid"
            color="colorPalette.fg"
            onClick={handleAddLink}
            disabled={!linkUrl}
          >
            <FiLink />
          </IconButton>
        </HStack>
      )}

      {showImageInput && (
        <HStack
          p={2}
          borderBottomWidth="1px"
          borderColor="border"
          bg="bg.subtle"
        >
          <Input
            placeholder="Enter image URL"
            size="sm"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddImage();
              }
            }}
          />
          <IconButton
            aria-label="Apply Image"
            size="sm"
            variant="solid"
            color="colorPalette.fg"
            onClick={handleAddImage}
            disabled={!imageUrl}
          >
            <FiImage />
          </IconButton>
        </HStack>
      )}

      <Box p={4} minH="200px" className="tiptap-editor-wrapper">
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
