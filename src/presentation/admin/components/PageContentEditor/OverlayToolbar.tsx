'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  HStack,
  IconButton,
  Input,
  Text,
  Button,
  Popover as ChakraPopover,
  Slider,
} from '@chakra-ui/react';
import { FiType, FiTrash2 } from 'react-icons/fi';
import {
  MdVerticalAlignTop,
  MdVerticalAlignCenter,
  MdVerticalAlignBottom,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
} from 'react-icons/md';
import type { Editor } from '@tiptap/react';
import { ColorPickerPopover } from './ColorPickerPopover';
import { FontPickerPopover } from './FontPickerPopover';
import {
  type OverlayFontSize,
  type OverlayPosition,
  type OverlayAlign,
  OVERLAY_FONT_SIZE_LABELS,
  OVERLAY_POSITION_LABELS,
  OVERLAY_ALIGN_LABELS,
  DEFAULT_OVERLAY_CONFIG,
} from '@/domain/pages/types/ImageOverlay';

interface OverlayToolbarProps {
  editor: Editor;
  disabled?: boolean;
  imagePos: number;
}

interface PopoverOpenChangeDetails {
  open: boolean;
}

const FONT_SIZES: OverlayFontSize[] = [
  'small',
  'medium',
  'large',
  'extra-large',
];
const POSITIONS: OverlayPosition[] = ['top', 'center', 'bottom'];
const ALIGNMENTS: OverlayAlign[] = ['left', 'center', 'right'];

const POSITION_ICONS: Record<OverlayPosition, React.ReactNode> = {
  top: <MdVerticalAlignTop />,
  center: <MdVerticalAlignCenter />,
  bottom: <MdVerticalAlignBottom />,
};

const ALIGN_ICONS: Record<OverlayAlign, React.ReactNode> = {
  left: <MdFormatAlignLeft />,
  center: <MdFormatAlignCenter />,
  right: <MdFormatAlignRight />,
};

export function OverlayToolbar({
  editor,
  disabled = false,
  imagePos,
}: OverlayToolbarProps): React.ReactElement | null {
  const [overlayText, setOverlayText] = useState('');
  const [overlayColor, setOverlayColor] = useState(
    DEFAULT_OVERLAY_CONFIG.color
  );
  const [overlayFontFamily, setOverlayFontFamily] = useState(
    DEFAULT_OVERLAY_CONFIG.fontFamily
  );
  const [overlayFontSize, setOverlayFontSize] = useState<OverlayFontSize>(
    DEFAULT_OVERLAY_CONFIG.fontSize
  );
  const [overlayPosition, setOverlayPosition] = useState<OverlayPosition>(
    DEFAULT_OVERLAY_CONFIG.position
  );
  const [overlayAlign, setOverlayAlign] = useState<OverlayAlign>(
    DEFAULT_OVERLAY_CONFIG.align
  );
  const [overlayBgColor, setOverlayBgColor] = useState(
    DEFAULT_OVERLAY_CONFIG.bgColor
  );
  const [overlayBgOpacity, setOverlayBgOpacity] = useState(
    DEFAULT_OVERLAY_CONFIG.bgOpacity
  );
  const [isSizePickerOpen, setIsSizePickerOpen] = useState(false);

  // Get current overlay attributes from the selected node
  const getNodeAttrs = useCallback((): Record<string, unknown> | null => {
    const node = editor.state.doc.nodeAt(imagePos);
    if (node && node.type.name === 'imageWithOverlay') {
      return node.attrs;
    }
    return null;
  }, [editor, imagePos]);

  // Sync state with node attributes
  useEffect(() => {
    const attrs = getNodeAttrs();
    if (attrs) {
      setOverlayText((attrs.overlayText as string) || '');
      setOverlayColor(
        (attrs.overlayColor as string) || DEFAULT_OVERLAY_CONFIG.color
      );
      setOverlayFontFamily(
        (attrs.overlayFontFamily as string) || DEFAULT_OVERLAY_CONFIG.fontFamily
      );
      setOverlayFontSize(
        (attrs.overlayFontSize as OverlayFontSize) ||
          DEFAULT_OVERLAY_CONFIG.fontSize
      );
      setOverlayPosition(
        (attrs.overlayPosition as OverlayPosition) ||
          DEFAULT_OVERLAY_CONFIG.position
      );
      setOverlayAlign(
        (attrs.overlayAlign as OverlayAlign) || DEFAULT_OVERLAY_CONFIG.align
      );
      setOverlayBgColor(
        (attrs.overlayBgColor as string) || DEFAULT_OVERLAY_CONFIG.bgColor
      );
      setOverlayBgOpacity(
        (attrs.overlayBgOpacity as number) ?? DEFAULT_OVERLAY_CONFIG.bgOpacity
      );
    }
  }, [getNodeAttrs]);

  const updateOverlay = useCallback(
    (
      attrs: Partial<{
        overlayText: string;
        overlayColor: string;
        overlayFontFamily: string;
        overlayFontSize: OverlayFontSize;
        overlayPosition: OverlayPosition;
        overlayAlign: OverlayAlign;
        overlayBgColor: string;
        overlayBgOpacity: number;
      }>
    ): void => {
      editor.commands.updateOverlay(attrs);
    },
    [editor]
  );

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const text = event.target.value;
      setOverlayText(text);
      updateOverlay({ overlayText: text });
    },
    [updateOverlay]
  );

  const handleColorSelect = useCallback(
    (color: string): void => {
      setOverlayColor(color);
      updateOverlay({ overlayColor: color });
    },
    [updateOverlay]
  );

  const handleFontSelect = useCallback(
    (fontName: string): void => {
      setOverlayFontFamily(fontName);
      updateOverlay({ overlayFontFamily: fontName });
    },
    [updateOverlay]
  );

  const handleFontSizeSelect = useCallback(
    (size: OverlayFontSize): void => {
      setOverlayFontSize(size);
      updateOverlay({ overlayFontSize: size });
      setIsSizePickerOpen(false);
    },
    [updateOverlay]
  );

  const handlePositionSelect = useCallback(
    (position: OverlayPosition): void => {
      setOverlayPosition(position);
      updateOverlay({ overlayPosition: position });
    },
    [updateOverlay]
  );

  const handleAlignSelect = useCallback(
    (align: OverlayAlign): void => {
      setOverlayAlign(align);
      updateOverlay({ overlayAlign: align });
    },
    [updateOverlay]
  );

  const handleBgColorSelect = useCallback(
    (color: string): void => {
      setOverlayBgColor(color);
      updateOverlay({ overlayBgColor: color });
    },
    [updateOverlay]
  );

  const handleBgOpacityChange = useCallback(
    (details: { value: number[] }): void => {
      const opacity = details.value[0];
      setOverlayBgOpacity(opacity);
      updateOverlay({ overlayBgOpacity: opacity });
    },
    [updateOverlay]
  );

  const handleRemoveOverlay = useCallback((): void => {
    editor.commands.removeOverlay(imagePos);
  }, [editor, imagePos]);

  // Only show if the selected node is an imageWithOverlay
  const attrs = getNodeAttrs();
  if (!attrs) {
    return null;
  }

  return (
    <HStack
      p={2}
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg.subtle"
      flexWrap="wrap"
      gap={1}
    >
      {/* Text input */}
      <Input
        size="sm"
        placeholder="Overlay text..."
        value={overlayText}
        onChange={handleTextChange}
        disabled={disabled}
        maxW="200px"
      />

      {/* Color picker */}
      <ColorPickerPopover
        selectedColor={overlayColor}
        onColorSelect={handleColorSelect}
        disabled={disabled}
        title="Overlay Color"
        trigger={
          <IconButton aria-label="Text Color" size="sm" variant="ghost">
            <Box
              w="16px"
              h="16px"
              borderRadius="sm"
              bg={overlayColor}
              borderWidth="1px"
              borderColor="border"
            />
          </IconButton>
        }
      />

      {/* Font picker */}
      <FontPickerPopover
        selectedFont={overlayFontFamily}
        onFontSelect={handleFontSelect}
        disabled={disabled}
        title="Overlay Font"
        trigger={
          <Button
            aria-label="Font Family"
            size="sm"
            variant="ghost"
            color="fg"
            fontFamily={overlayFontFamily}
          >
            <FiType />
            <Text ml={1} fontSize="xs" fontFamily={overlayFontFamily}>
              {overlayFontFamily}
            </Text>
          </Button>
        }
      />

      {/* Font size picker */}
      <ChakraPopover.Root
        open={isSizePickerOpen}
        onOpenChange={(e: PopoverOpenChangeDetails) =>
          setIsSizePickerOpen(e.open)
        }
      >
        <ChakraPopover.Trigger asChild>
          <Button
            aria-label="Font Size"
            size="sm"
            variant="ghost"
            color="fg"
            disabled={disabled}
          >
            <Text fontSize="xs">
              {OVERLAY_FONT_SIZE_LABELS[overlayFontSize]}
            </Text>
          </Button>
        </ChakraPopover.Trigger>
        <ChakraPopover.Positioner>
          <ChakraPopover.Content width="auto">
            <ChakraPopover.Body>
              <Box p={2}>
                <Text fontSize="sm" fontWeight="medium" mb={2} color="fg">
                  Font Size
                </Text>
                {FONT_SIZES.map((size) => (
                  <Button
                    key={size}
                    aria-label={OVERLAY_FONT_SIZE_LABELS[size]}
                    size="sm"
                    variant={overlayFontSize === size ? 'solid' : 'ghost'}
                    color={overlayFontSize === size ? 'colorPalette.fg' : 'fg'}
                    width="100%"
                    justifyContent="flex-start"
                    onClick={() => handleFontSizeSelect(size)}
                    mb={1}
                  >
                    {OVERLAY_FONT_SIZE_LABELS[size]}
                  </Button>
                ))}
              </Box>
            </ChakraPopover.Body>
          </ChakraPopover.Content>
        </ChakraPopover.Positioner>
      </ChakraPopover.Root>

      {/* Vertical position selector */}
      <HStack gap={0}>
        {POSITIONS.map((pos) => (
          <IconButton
            key={pos}
            aria-label={`Position ${OVERLAY_POSITION_LABELS[pos]}`}
            size="sm"
            variant={overlayPosition === pos ? 'solid' : 'ghost'}
            color={overlayPosition === pos ? 'colorPalette.fg' : 'fg'}
            onClick={() => handlePositionSelect(pos)}
            disabled={disabled}
          >
            {POSITION_ICONS[pos]}
          </IconButton>
        ))}
      </HStack>

      {/* Horizontal alignment selector */}
      <HStack gap={0}>
        {ALIGNMENTS.map((align) => (
          <IconButton
            key={align}
            aria-label={`Align ${OVERLAY_ALIGN_LABELS[align]}`}
            size="sm"
            variant={overlayAlign === align ? 'solid' : 'ghost'}
            color={overlayAlign === align ? 'colorPalette.fg' : 'fg'}
            onClick={() => handleAlignSelect(align)}
            disabled={disabled}
          >
            {ALIGN_ICONS[align]}
          </IconButton>
        ))}
      </HStack>

      {/* Background color picker */}
      <ColorPickerPopover
        selectedColor={overlayBgColor}
        onColorSelect={handleBgColorSelect}
        disabled={disabled}
        title="Background Color"
        trigger={
          <IconButton aria-label="Background Color" size="sm" variant="ghost">
            <Box
              w="16px"
              h="16px"
              borderRadius="sm"
              bg={overlayBgColor}
              borderWidth="1px"
              borderColor="border"
              opacity={overlayBgOpacity / 100}
            />
          </IconButton>
        }
      />

      {/* Background opacity slider */}
      <HStack gap={2} minW="120px">
        <Slider.Root
          value={[overlayBgOpacity]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleBgOpacityChange}
          disabled={disabled}
          size="sm"
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
        <Text fontSize="xs" minW="32px" textAlign="right">
          {overlayBgOpacity}%
        </Text>
      </HStack>

      {/* Remove overlay button */}
      <IconButton
        aria-label="Remove Overlay"
        size="sm"
        variant="ghost"
        colorPalette="red"
        color="red.500"
        onClick={handleRemoveOverlay}
        disabled={disabled}
      >
        <FiTrash2 />
      </IconButton>
    </HStack>
  );
}
