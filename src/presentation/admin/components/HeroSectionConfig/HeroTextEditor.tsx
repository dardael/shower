'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import { Box, HStack, IconButton, Input, Spinner } from '@chakra-ui/react';
import {
  FiBold,
  FiItalic,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiLink,
} from 'react-icons/fi';
import { LuHeading1, LuHeading2 } from 'react-icons/lu';
import { RxButton } from 'react-icons/rx';
import { ButtonLink } from '@/presentation/admin/components/PageContentEditor/extensions';
import { Tooltip } from '@/presentation/shared/components/ui/tooltip';
import { ColorPicker } from '@/presentation/admin/components/PageContentEditor/ColorPicker';
import '@/presentation/admin/components/PageContentEditor/tiptap-styles.css';
import './hero-text-editor.css';

interface HeroTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

export function HeroTextEditor({
  content,
  onChange,
  disabled = false,
}: HeroTextEditorProps): React.ReactElement {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showButtonLinkInput, setShowButtonLinkInput] = useState(false);
  const [buttonLinkText, setButtonLinkText] = useState('');
  const [buttonLinkUrl, setButtonLinkUrl] = useState('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      TextStyle,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tiptap-link',
        },
      }),
      ButtonLink,
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor: editorInstance }) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onChange(editorInstance.getHTML());
      }, 500);
    },
  });

  const handleToggleLinkInput = useCallback((): void => {
    if (!editor) return;

    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    setShowLinkInput(!showLinkInput);
    setShowButtonLinkInput(false);
    if (!showLinkInput) {
      setLinkUrl('');
    }
  }, [editor, showLinkInput]);

  const handleApplyLink = useCallback((): void => {
    if (!editor || !linkUrl.trim()) return;

    const url = linkUrl.trim().startsWith('http')
      ? linkUrl.trim()
      : `https://${linkUrl.trim()}`;

    editor.chain().focus().setLink({ href: url }).run();
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const handleToggleButtonLinkInput = useCallback((): void => {
    setShowButtonLinkInput(!showButtonLinkInput);
    setShowLinkInput(false);
    if (!showButtonLinkInput) {
      setButtonLinkText('');
      setButtonLinkUrl('');
    }
  }, [showButtonLinkInput]);

  const handleInsertButtonLink = useCallback((): void => {
    if (!editor || !buttonLinkText.trim() || !buttonLinkUrl.trim()) return;

    const url = buttonLinkUrl.trim().startsWith('http')
      ? buttonLinkUrl.trim()
      : `https://${buttonLinkUrl.trim()}`;

    editor.chain().focus().insertButtonLink(buttonLinkText.trim(), url).run();
    setShowButtonLinkInput(false);
    setButtonLinkText('');
    setButtonLinkUrl('');
  }, [editor, buttonLinkText, buttonLinkUrl]);

  if (!editor) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="200px"
      >
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box
      border="1px solid"
      borderColor="border"
      borderRadius="lg"
      overflow="hidden"
      position="relative"
      opacity={disabled ? 0.5 : 1}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      {/* Toolbar */}
      <HStack
        p={2}
        borderBottom="1px solid"
        borderColor="border"
        bg="bg.subtle"
        flexWrap="wrap"
        gap={1}
      >
        <Tooltip content="Gras">
          <IconButton
            aria-label="Gras"
            size="sm"
            variant={editor.isActive('bold') ? 'solid' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FiBold />
          </IconButton>
        </Tooltip>
        <Tooltip content="Italique">
          <IconButton
            aria-label="Italique"
            size="sm"
            variant={editor.isActive('italic') ? 'solid' : 'ghost'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FiItalic />
          </IconButton>
        </Tooltip>

        <ColorPicker editor={editor} />

        <Tooltip content="Titre 1">
          <IconButton
            aria-label="Titre 1"
            size="sm"
            variant={
              editor.isActive('heading', { level: 1 }) ? 'solid' : 'ghost'
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <LuHeading1 />
          </IconButton>
        </Tooltip>
        <Tooltip content="Titre 2">
          <IconButton
            aria-label="Titre 2"
            size="sm"
            variant={
              editor.isActive('heading', { level: 2 }) ? 'solid' : 'ghost'
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <LuHeading2 />
          </IconButton>
        </Tooltip>

        <Tooltip content="Aligner à gauche">
          <IconButton
            aria-label="Aligner à gauche"
            size="sm"
            variant={editor.isActive({ textAlign: 'left' }) ? 'solid' : 'ghost'}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <FiAlignLeft />
          </IconButton>
        </Tooltip>
        <Tooltip content="Centrer">
          <IconButton
            aria-label="Centrer"
            size="sm"
            variant={
              editor.isActive({ textAlign: 'center' }) ? 'solid' : 'ghost'
            }
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <FiAlignCenter />
          </IconButton>
        </Tooltip>
        <Tooltip content="Aligner à droite">
          <IconButton
            aria-label="Aligner à droite"
            size="sm"
            variant={
              editor.isActive({ textAlign: 'right' }) ? 'solid' : 'ghost'
            }
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <FiAlignRight />
          </IconButton>
        </Tooltip>

        <Tooltip content="Lien">
          <IconButton
            aria-label="Lien"
            size="sm"
            variant={
              editor.isActive('link') || showLinkInput ? 'solid' : 'ghost'
            }
            onClick={handleToggleLinkInput}
          >
            <FiLink />
          </IconButton>
        </Tooltip>

        <Tooltip content="Bouton avec lien">
          <IconButton
            aria-label="Bouton avec lien"
            size="sm"
            variant={showButtonLinkInput ? 'solid' : 'ghost'}
            onClick={handleToggleButtonLinkInput}
          >
            <RxButton />
          </IconButton>
        </Tooltip>
      </HStack>

      {/* Link input panel */}
      {showLinkInput && (
        <HStack
          p={2}
          bg="bg.subtle"
          borderBottom="1px solid"
          borderColor="border"
        >
          <Input
            size="sm"
            placeholder="https://exemple.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyLink();
              if (e.key === 'Escape') setShowLinkInput(false);
            }}
          />
          <IconButton
            aria-label="Appliquer le lien"
            size="sm"
            variant="solid"
            onClick={handleApplyLink}
            disabled={!linkUrl.trim()}
          >
            <FiLink />
          </IconButton>
        </HStack>
      )}

      {/* ButtonLink input panel */}
      {showButtonLinkInput && (
        <HStack
          p={2}
          bg="bg.subtle"
          borderBottom="1px solid"
          borderColor="border"
        >
          <Input
            size="sm"
            placeholder="Texte du bouton"
            value={buttonLinkText}
            onChange={(e) => setButtonLinkText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowButtonLinkInput(false);
            }}
          />
          <Input
            size="sm"
            placeholder="https://exemple.com"
            value={buttonLinkUrl}
            onChange={(e) => setButtonLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInsertButtonLink();
              if (e.key === 'Escape') setShowButtonLinkInput(false);
            }}
          />
          <IconButton
            aria-label="Insérer le bouton"
            size="sm"
            variant="solid"
            onClick={handleInsertButtonLink}
            disabled={!buttonLinkText.trim() || !buttonLinkUrl.trim()}
          >
            <RxButton />
          </IconButton>
        </HStack>
      )}

      {/* Editor content */}
      <Box p={4} minH="150px" className="hero-text-editor">
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
