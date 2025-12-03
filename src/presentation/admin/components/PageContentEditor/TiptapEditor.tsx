'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Box, HStack, IconButton, Input, Spinner } from '@chakra-ui/react';
import {
  FiBold,
  FiItalic,
  FiList,
  FiLink,
  FiImage,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
} from 'react-icons/fi';
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuListOrdered,
} from 'react-icons/lu';
import { MdFormatColorText } from 'react-icons/md';
import { useState, useCallback, useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import './tiptap-styles.css';
import { ThemeColorMark } from './ThemeColorMark';
import { toaster } from '@/presentation/shared/components/ui/toaster';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function TiptapEditor({
  content,
  onChange,
  disabled = false,
}: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return 'Invalid file type. Only PNG, JPG, GIF, and WebP files are allowed.';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return 'File size must be less than 5MB.';
    }
    return null;
  }, []);

  const uploadImage = useCallback(
    async (file: File): Promise<void> => {
      const validationError = validateFile(file);
      if (validationError) {
        toaster.create({
          title: 'Upload failed',
          description: validationError,
          type: 'error',
        });
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/page-content-images', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to upload image. Please try again.'
          );
        }

        const { image } = await response.json();
        editorRef.current?.chain().focus().setImage({ src: image.url }).run();
      } catch (error) {
        toaster.create({
          title: 'Upload failed',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to upload image. Please try again.',
          type: 'error',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [validateFile]
  );

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0];
      if (file) {
        uploadImage(file);
      }
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [uploadImage]
  );

  const handleImageButtonClick = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);

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
      ThemeColorMark,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
    ],
    content,
    editable: !disabled,
    immediatelyRender: false,
    onCreate: ({ editor: ed }) => {
      editorRef.current = ed;
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      handleDrop: (_view, event, _slice, moved) => {
        if (moved || disabled || isUploading) {
          return false;
        }
        const file = event.dataTransfer?.files[0];
        if (file && file.type.startsWith('image/')) {
          event.preventDefault();
          uploadImage(file);
          return true;
        }
        return false;
      },
      handlePaste: (_view, event) => {
        if (disabled || isUploading) {
          return false;
        }
        const items = event.clipboardData?.items;
        if (!items) {
          return false;
        }
        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              uploadImage(file);
              return true;
            }
          }
        }
        return false;
      },
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
      position="relative"
    >
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        disabled={disabled || isUploading}
      />

      {/* Loading overlay */}
      {isUploading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.400"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={10}
        >
          <Spinner size="lg" color="colorPalette.solid" />
        </Box>
      )}

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
          aria-label="Theme Color"
          size="sm"
          variant={editor.isActive('themeColor') ? 'solid' : 'ghost'}
          color={editor.isActive('themeColor') ? 'colorPalette.fg' : 'fg'}
          onClick={() => editor.chain().focus().toggleThemeColor().run()}
          disabled={disabled}
        >
          <MdFormatColorText />
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
          aria-label="Align Left"
          size="sm"
          variant={editor.isActive({ textAlign: 'left' }) ? 'solid' : 'ghost'}
          color={
            editor.isActive({ textAlign: 'left' }) ? 'colorPalette.fg' : 'fg'
          }
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          disabled={disabled}
        >
          <FiAlignLeft />
        </IconButton>
        <IconButton
          aria-label="Align Center"
          size="sm"
          variant={editor.isActive({ textAlign: 'center' }) ? 'solid' : 'ghost'}
          color={
            editor.isActive({ textAlign: 'center' }) ? 'colorPalette.fg' : 'fg'
          }
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          disabled={disabled}
        >
          <FiAlignCenter />
        </IconButton>
        <IconButton
          aria-label="Align Right"
          size="sm"
          variant={editor.isActive({ textAlign: 'right' }) ? 'solid' : 'ghost'}
          color={
            editor.isActive({ textAlign: 'right' }) ? 'colorPalette.fg' : 'fg'
          }
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          disabled={disabled}
        >
          <FiAlignRight />
        </IconButton>
        <IconButton
          aria-label="Justify"
          size="sm"
          variant={
            editor.isActive({ textAlign: 'justify' }) ? 'solid' : 'ghost'
          }
          color={
            editor.isActive({ textAlign: 'justify' }) ? 'colorPalette.fg' : 'fg'
          }
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          disabled={disabled}
        >
          <FiAlignJustify />
        </IconButton>
        <IconButton
          aria-label="Add Link"
          size="sm"
          variant={showLinkInput ? 'solid' : 'ghost'}
          color={showLinkInput ? 'colorPalette.fg' : 'fg'}
          onClick={() => {
            setShowLinkInput(!showLinkInput);
          }}
          disabled={disabled}
        >
          <FiLink />
        </IconButton>
        <IconButton
          aria-label="Upload Image"
          size="sm"
          variant="ghost"
          color="fg"
          onClick={handleImageButtonClick}
          disabled={disabled || isUploading}
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

      <Box p={4} minH="200px" className="tiptap-editor-wrapper">
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
