'use client';

import React from 'react';
import type { Editor } from '@tiptap/react';
import { HStack, IconButton, Input, Text } from '@chakra-ui/react';
import { Tooltip } from '@/presentation/shared/components/ui/tooltip';
import { LuTrash2 } from 'react-icons/lu';
import type { CalloutVariant } from './extensions/CalloutBlock';

interface CalloutToolbarProps {
  editor: Editor;
  disabled: boolean;
}

const VARIANTS: { value: CalloutVariant; emoji: string; label: string }[] = [
  { value: 'info', emoji: 'ℹ️', label: 'Info' },
  { value: 'tip', emoji: '✨', label: 'Conseil' },
  { value: 'warning', emoji: '⚠️', label: 'Avertissement' },
  { value: 'highlight', emoji: '💡', label: 'À retenir' },
];

const VARIANT_DEFAULT_EMOJIS: Record<CalloutVariant, string> = {
  info: 'ℹ️',
  tip: '✨',
  warning: '⚠️',
  highlight: '💡',
};

export function CalloutToolbar({
  editor,
  disabled,
}: CalloutToolbarProps): React.ReactElement {
  const currentVariant =
    (editor.getAttributes('calloutBlock').variant as CalloutVariant) ?? 'info';
  const currentEmoji =
    (editor.getAttributes('calloutBlock').emoji as string) ?? 'ℹ️';

  const handleVariantChange = (variant: CalloutVariant): void => {
    editor
      .chain()
      .focus()
      .updateAttributes('calloutBlock', {
        variant,
        emoji: VARIANT_DEFAULT_EMOJIS[variant],
      })
      .run();
  };

  const handleEmojiChange = (emoji: string): void => {
    editor.chain().focus().updateAttributes('calloutBlock', { emoji }).run();
  };

  const handleRemove = (): void => {
    editor.chain().focus().removeCalloutBlock().run();
  };

  return (
    <HStack
      p={2}
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg.subtle"
      gap={1}
      flexWrap="wrap"
    >
      <Text fontSize="xs" color="fg.muted" fontWeight="medium" mr={1}>
        Callout :
      </Text>

      {VARIANTS.map(({ value, emoji, label }) => (
        <Tooltip key={value} content={label}>
          <IconButton
            aria-label={label}
            size="sm"
            variant={currentVariant === value ? 'solid' : 'ghost'}
            color={currentVariant === value ? 'colorPalette.fg' : 'fg'}
            onClick={() => handleVariantChange(value)}
            disabled={disabled}
          >
            <span style={{ fontSize: '16px', lineHeight: '1' }}>{emoji}</span>
          </IconButton>
        </Tooltip>
      ))}

      <Tooltip content="Emoji personnalisé">
        <Input
          aria-label="Emoji du callout"
          size="sm"
          value={currentEmoji}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleEmojiChange(e.target.value)
          }
          disabled={disabled}
          maxLength={4}
          style={{ width: '56px', textAlign: 'center', fontSize: '16px' }}
        />
      </Tooltip>

      <Tooltip content="Supprimer le bloc">
        <IconButton
          aria-label="Supprimer le bloc callout"
          size="sm"
          variant="ghost"
          color="red.500"
          onClick={handleRemove}
          disabled={disabled}
          ml={1}
        >
          <LuTrash2 />
        </IconButton>
      </Tooltip>
    </HStack>
  );
}
