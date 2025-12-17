'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle, FontFamily } from '@tiptap/extension-text-style';
import { TableRow } from '@tiptap/extension-table-row';
import { CustomTable, CustomTableCell, CustomTableHeader } from './extensions';
import { NodeSelection } from '@tiptap/pm/state';
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
  FiMaximize2,
} from 'react-icons/fi';
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuListOrdered,
  LuUnfoldHorizontal,
} from 'react-icons/lu';
import { useState, useCallback, useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { findParentNode } from '@tiptap/core';
import './tiptap-styles.css';
import { ColorPicker } from './ColorPicker';
import { FontPicker } from './FontPicker';
import { toaster } from '@/presentation/shared/components/ui/toaster';
import { Tooltip } from '@/presentation/shared/components/ui/tooltip';
import { ImageWithOverlay } from './extensions/ImageWithOverlay';
import { OverlayToolbar } from './OverlayToolbar';
import { TableInsertDialog } from './TableInsertDialog';
import { TableToolbar } from './TableToolbar';
import { FiType } from 'react-icons/fi';
import { DEFAULT_OVERLAY_TEXT } from '@/domain/pages/types/ImageOverlay';

const ResizableImage = Image.extend({
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      textAlign: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-text-align'),
        renderHTML: (attributes) => {
          if (!attributes.textAlign) {
            return {};
          }
          return { 'data-text-align': attributes.textAlign };
        },
      },
      fullWidth: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute('data-full-width') === 'true',
        renderHTML: (attributes) => {
          if (!attributes.fullWidth) {
            return {};
          }
          return { 'data-full-width': 'true' };
        },
      },
      fullBleed: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute('data-full-bleed') === 'true',
        renderHTML: (attributes) => {
          if (!attributes.fullBleed) {
            return {};
          }
          return { 'data-full-bleed': 'true' };
        },
      },
    };
  },
}).configure({
  HTMLAttributes: {
    class: 'tiptap-image',
  },
  resize: {
    enabled: true,
    directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    minWidth: 50,
    minHeight: 50,
    alwaysPreserveAspectRatio: true,
  },
});

const setImageAlignment = (
  editor: Editor,
  imagePos: number,
  alignment: 'left' | 'center' | 'right'
): void => {
  const node = editor.state.doc.nodeAt(imagePos);
  if (node?.type.name === 'image' || node?.type.name === 'imageWithOverlay') {
    // Update the node attributes
    const { tr } = editor.state;
    editor.view.dispatch(
      tr.setNodeMarkup(imagePos, undefined, {
        ...node.attrs,
        textAlign: alignment,
      })
    );

    // Apply alignment to the DOM container (for resize container)
    if (node.type.name === 'image') {
      applyImageAlignmentToDOM(editor, imagePos, alignment);
    }
  }
};

const applyImageAlignmentToDOM = (
  editor: Editor,
  imagePos: number,
  alignment: string | null
): void => {
  const domNode = editor.view.nodeDOM(imagePos) as HTMLElement | null;
  if (domNode) {
    // The domNode could be the container or the image itself
    const container = domNode.hasAttribute?.('data-resize-container')
      ? domNode
      : (domNode.closest?.('[data-resize-container]') as HTMLElement | null);

    if (container) {
      if (alignment === 'center') {
        container.style.justifyContent = 'center';
      } else if (alignment === 'right') {
        container.style.justifyContent = 'flex-end';
      } else {
        container.style.justifyContent = 'flex-start';
      }
    }
  }
};

const syncAllImageAlignments = (editor: Editor): void => {
  const { doc } = editor.state;
  doc.descendants((node, pos) => {
    if (node.type.name === 'image' && node.attrs.textAlign) {
      applyImageAlignmentToDOM(editor, pos, node.attrs.textAlign);
    }
    return true;
  });
};

const isImageAlignmentActive = (
  editor: Editor,
  imagePos: number,
  alignment: 'left' | 'center' | 'right'
): boolean => {
  const node = editor.state.doc.nodeAt(imagePos);
  if (node?.type.name === 'image' || node?.type.name === 'imageWithOverlay') {
    return node.attrs.textAlign === alignment;
  }
  return false;
};

const isFullWidthActive = (editor: Editor, imagePos: number): boolean => {
  const node = editor.state.doc.nodeAt(imagePos);
  if (node?.type.name === 'image' || node?.type.name === 'imageWithOverlay') {
    return node.attrs.fullWidth === true;
  }
  return false;
};

const toggleFullWidth = (editor: Editor, imagePos: number): void => {
  const node = editor.state.doc.nodeAt(imagePos);
  if (node?.type.name === 'image' || node?.type.name === 'imageWithOverlay') {
    const { tr } = editor.state;
    const newFullWidth = !node.attrs.fullWidth;
    editor.view.dispatch(
      tr.setNodeMarkup(imagePos, undefined, {
        ...node.attrs,
        fullWidth: newFullWidth,
        // When setting fullWidth, we don't need to clear the width
        // because fullWidth takes precedence in rendering
      })
    );
  }
};

const isFullBleedActive = (editor: Editor, imagePos: number): boolean => {
  const node = editor.state.doc.nodeAt(imagePos);
  if (node?.type.name === 'image' || node?.type.name === 'imageWithOverlay') {
    return node.attrs.fullBleed === true;
  }
  return false;
};

const toggleFullBleed = (editor: Editor, imagePos: number): void => {
  const node = editor.state.doc.nodeAt(imagePos);
  if (node?.type.name === 'image' || node?.type.name === 'imageWithOverlay') {
    const { tr } = editor.state;
    const newFullBleed = !node.attrs.fullBleed;
    editor.view.dispatch(
      tr.setNodeMarkup(imagePos, undefined, {
        ...node.attrs,
        fullBleed: newFullBleed,
      })
    );
  }
};

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
  const [selectedImagePos, setSelectedImagePos] = useState<number | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [isInTable, setIsInTable] = useState(false);
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
      ResizableImage,
      ImageWithOverlay,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tiptap-link',
        },
      }),
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      CustomTable,
      TableRow,
      CustomTableCell,
      CustomTableHeader,
    ],
    content,
    editable: !disabled,
    immediatelyRender: false,
    onCreate: ({ editor: ed }) => {
      editorRef.current = ed;
      // Sync image alignments after initial render
      setTimeout(() => syncAllImageAlignments(ed), 0);
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
      // Sync image alignments after content update
      syncAllImageAlignments(ed);
      // Check if we're in a table
      const tableNode = findParentNode((node) => node.type.name === 'table')(
        ed.state.selection
      );
      setIsInTable(!!tableNode);
    },
    onSelectionUpdate: ({ editor: ed }) => {
      // Check if we're in a table on selection change
      const tableNode = findParentNode((node) => node.type.name === 'table')(
        ed.state.selection
      );
      setIsInTable(!!tableNode);

      // Track selected image position and type
      const { selection } = ed.state;
      if (
        selection instanceof NodeSelection &&
        (selection.node.type.name === 'image' ||
          selection.node.type.name === 'imageWithOverlay')
      ) {
        setSelectedImagePos(selection.from);
        setSelectedNodeType(selection.node.type.name);
      } else {
        setSelectedImagePos(null);
        setSelectedNodeType(null);
      }
    },
    onTransaction: ({ editor: ed, transaction }) => {
      // Detect resize operations and remove fullWidth when user resizes
      if (!transaction.docChanged) return;

      transaction.steps.forEach((step) => {
        // Check if this is a node attribute change (resize changes width attribute)
        const stepMap = step.getMap();
        stepMap.forEach((_oldStart, _oldEnd, newStart, newEnd) => {
          // Check nodes in the affected range
          ed.state.doc.nodesBetween(newStart, newEnd, (node, pos) => {
            if (
              node.type.name === 'image' ||
              node.type.name === 'imageWithOverlay'
            ) {
              // Check if this node had fullWidth and now has a width set (indicating resize)
              // We need to check the original document for this
              const oldNode = transaction.before.nodeAt(pos);
              if (
                oldNode &&
                oldNode.attrs.fullWidth &&
                node.attrs.width &&
                !oldNode.attrs.width
              ) {
                // User just resized a full-width image - clear fullWidth
                setTimeout(() => {
                  const currentNode = ed.state.doc.nodeAt(pos);
                  if (currentNode?.attrs.fullWidth) {
                    const { tr } = ed.state;
                    ed.view.dispatch(
                      tr.setNodeMarkup(pos, undefined, {
                        ...currentNode.attrs,
                        fullWidth: false,
                      })
                    );
                  }
                }, 0);
              }
            }
            return true;
          });
        });
      });
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
      handleClick: (view, _pos, event) => {
        // Check if clicked on an image
        const target = event.target as HTMLElement;
        const imageElement = target.closest('img');
        if (imageElement) {
          // Find the image node position
          const { doc } = view.state;
          let imagePos: number | null = null;
          let nodeTypeName: string | null = null;
          doc.descendants((node, nodePos) => {
            if (
              (node.type.name === 'image' ||
                node.type.name === 'imageWithOverlay') &&
              imagePos === null
            ) {
              // Check if this is the clicked image by comparing DOM nodes
              const domNode = view.nodeDOM(nodePos);
              if (domNode) {
                // Check if domNode is or contains the clicked image
                // This handles images both at root level and inside table cells
                const domElement = domNode as HTMLElement;
                const imgInDom =
                  domElement.tagName === 'IMG'
                    ? domElement
                    : domElement.querySelector?.('img');
                if (imgInDom === imageElement) {
                  imagePos = nodePos;
                  nodeTypeName = node.type.name;
                }
              }
            }
            return imagePos === null;
          });
          if (imagePos !== null) {
            setSelectedImagePos(imagePos);
            setSelectedNodeType(nodeTypeName);
            return false;
          }
        }
        setSelectedImagePos(null);
        setSelectedNodeType(null);
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

  const handleAddOverlay = useCallback(() => {
    if (editor && selectedImagePos !== null && selectedNodeType === 'image') {
      editor.commands.addOverlay(DEFAULT_OVERLAY_TEXT, selectedImagePos);
      setSelectedNodeType('imageWithOverlay');
    }
  }, [editor, selectedImagePos, selectedNodeType]);

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
      display="flex"
      flexDirection="column"
      maxH="70vh"
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
        flexShrink={0}
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
        <ColorPicker editor={editor} disabled={disabled} />
        <FontPicker editor={editor} disabled={disabled} />
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
          variant={
            selectedImagePos !== null
              ? isImageAlignmentActive(editor, selectedImagePos, 'left')
                ? 'solid'
                : 'ghost'
              : editor.isActive({ textAlign: 'left' })
                ? 'solid'
                : 'ghost'
          }
          color={
            selectedImagePos !== null
              ? isImageAlignmentActive(editor, selectedImagePos, 'left')
                ? 'colorPalette.fg'
                : 'fg'
              : editor.isActive({ textAlign: 'left' })
                ? 'colorPalette.fg'
                : 'fg'
          }
          onClick={() => {
            if (selectedImagePos !== null) {
              setImageAlignment(editor, selectedImagePos, 'left');
            } else {
              editor.chain().focus().setTextAlign('left').run();
            }
          }}
          disabled={disabled}
        >
          <FiAlignLeft />
        </IconButton>
        <IconButton
          aria-label="Align Center"
          size="sm"
          variant={
            selectedImagePos !== null
              ? isImageAlignmentActive(editor, selectedImagePos, 'center')
                ? 'solid'
                : 'ghost'
              : editor.isActive({ textAlign: 'center' })
                ? 'solid'
                : 'ghost'
          }
          color={
            selectedImagePos !== null
              ? isImageAlignmentActive(editor, selectedImagePos, 'center')
                ? 'colorPalette.fg'
                : 'fg'
              : editor.isActive({ textAlign: 'center' })
                ? 'colorPalette.fg'
                : 'fg'
          }
          onClick={() => {
            if (selectedImagePos !== null) {
              setImageAlignment(editor, selectedImagePos, 'center');
            } else {
              editor.chain().focus().setTextAlign('center').run();
            }
          }}
          disabled={disabled}
        >
          <FiAlignCenter />
        </IconButton>
        <IconButton
          aria-label="Align Right"
          size="sm"
          variant={
            selectedImagePos !== null
              ? isImageAlignmentActive(editor, selectedImagePos, 'right')
                ? 'solid'
                : 'ghost'
              : editor.isActive({ textAlign: 'right' })
                ? 'solid'
                : 'ghost'
          }
          color={
            selectedImagePos !== null
              ? isImageAlignmentActive(editor, selectedImagePos, 'right')
                ? 'colorPalette.fg'
                : 'fg'
              : editor.isActive({ textAlign: 'right' })
                ? 'colorPalette.fg'
                : 'fg'
          }
          onClick={() => {
            if (selectedImagePos !== null) {
              setImageAlignment(editor, selectedImagePos, 'right');
            } else {
              editor.chain().focus().setTextAlign('right').run();
            }
          }}
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
          disabled={disabled || selectedImagePos !== null}
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
        <TableInsertDialog editor={editor} disabled={disabled} />
        {/* Add Text Overlay button - only visible when plain image is selected */}
        {selectedImagePos !== null && selectedNodeType === 'image' && (
          <Tooltip content="Add Text Overlay">
            <IconButton
              aria-label="Add Text Overlay"
              size="sm"
              variant="ghost"
              color="fg"
              onClick={handleAddOverlay}
              disabled={disabled}
            >
              <FiType />
            </IconButton>
          </Tooltip>
        )}
        {/* Full Width button - visible when any image is selected */}
        {selectedImagePos !== null && (
          <Tooltip content="Toggle Full Width">
            <IconButton
              aria-label="Toggle Full Width"
              size="sm"
              variant={
                isFullWidthActive(editor, selectedImagePos) ? 'solid' : 'ghost'
              }
              color={
                isFullWidthActive(editor, selectedImagePos)
                  ? 'colorPalette.fg'
                  : 'fg'
              }
              onClick={() => toggleFullWidth(editor, selectedImagePos)}
              disabled={disabled}
            >
              <FiMaximize2 />
            </IconButton>
          </Tooltip>
        )}
        {/* Full Bleed button - visible when any image is selected */}
        {selectedImagePos !== null && (
          <Tooltip content="Toggle Full Bleed (edge-to-edge)">
            <IconButton
              aria-label="Toggle Full Bleed"
              size="sm"
              variant={
                isFullBleedActive(editor, selectedImagePos) ? 'solid' : 'ghost'
              }
              color={
                isFullBleedActive(editor, selectedImagePos)
                  ? 'colorPalette.fg'
                  : 'fg'
              }
              onClick={() => toggleFullBleed(editor, selectedImagePos)}
              disabled={disabled}
            >
              <LuUnfoldHorizontal />
            </IconButton>
          </Tooltip>
        )}
      </HStack>

      {/* Overlay toolbar - visible when imageWithOverlay is selected */}
      {selectedImagePos !== null && selectedNodeType === 'imageWithOverlay' && (
        <OverlayToolbar
          editor={editor}
          disabled={disabled}
          imagePos={selectedImagePos}
        />
      )}

      {/* Table toolbar - visible when cursor is in a table */}
      {isInTable && <TableToolbar editor={editor} disabled={disabled} />}

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

      <Box
        p={4}
        minH="200px"
        className="tiptap-editor-wrapper"
        overflow="auto"
        flex="1"
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
