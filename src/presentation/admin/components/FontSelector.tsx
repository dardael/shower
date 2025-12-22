'use client';

import { Box, VStack, HStack, Text, Spinner, Button } from '@chakra-ui/react';
import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import {
  getFontsByCategory,
  getFontByName,
  FONT_CATEGORY_LABELS,
  type FontCategory,
  type FontMetadata,
} from '@/domain/settings/constants/AvailableFonts';
import { WebsiteFont } from '@/domain/settings/value-objects/WebsiteFont';

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

interface FontButtonProps {
  font: FontMetadata;
  isSelected: boolean;
  onClick: () => void;
  onHover: (font: FontMetadata) => void;
  onLeave: () => void;
  disabled: boolean;
  isLoading?: boolean;
}

interface FontPreviewProps {
  fontName: string;
  fontMetadata: FontMetadata | undefined;
  isPreview: boolean;
}

// Inject Google Fonts link for preview
function usePreviewFontLoader(fontName: string | null): void {
  useEffect(() => {
    if (!fontName || typeof window === 'undefined') return;

    const previewLinkId = 'font-preview-link';
    const existingLink = document.getElementById(previewLinkId);

    try {
      const fontObj = WebsiteFont.fromString(fontName);
      const googleFontsUrl = fontObj.getGoogleFontsUrl();

      if (existingLink) {
        existingLink.setAttribute('href', googleFontsUrl);
      } else {
        const link = document.createElement('link');
        link.id = previewLinkId;
        link.rel = 'stylesheet';
        link.href = googleFontsUrl;
        document.head.appendChild(link);
      }
    } catch {
      // Invalid font name, ignore
    }

    return () => {
      // Keep the link to avoid flickering during hover transitions
    };
  }, [fontName]);
}

// Font preview component showing sample text
const FontPreview = memo<FontPreviewProps>(
  ({ fontName, fontMetadata, isPreview }) => {
    const fontFamily = fontMetadata?.family || `'${fontName}', sans-serif`;

    return (
      <Box
        bg="bg.canvas"
        borderWidth="2px"
        borderColor={isPreview ? 'colorPalette.solid' : 'border'}
        borderRadius="lg"
        p={4}
        width="full"
        transition="border-color 0.2s"
      >
        <VStack gap={3} align="start" width="full">
          <HStack gap={2} align="center">
            <Text fontSize="xs" color="fg.subtle" fontWeight="medium">
              {isPreview ? 'Aperçu :' : 'Actuel :'}
            </Text>
            <Text
              fontSize="xs"
              color={isPreview ? 'colorPalette.solid' : 'fg.muted'}
              fontWeight="semibold"
            >
              {fontName}
            </Text>
            {fontMetadata && (
              <Text fontSize="xs" color="fg.subtle">
                ({fontMetadata.category})
              </Text>
            )}
          </HStack>

          <Text
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="bold"
            fontFamily={fontFamily}
            color="fg"
            lineHeight="short"
          >
            The quick brown fox jumps
          </Text>

          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            fontFamily={fontFamily}
            color="fg.muted"
            lineHeight="relaxed"
          >
            Pack my box with five dozen liquor jugs. How vexingly quick daft
            zebras jump! The five boxing wizards jump quickly.
          </Text>
        </VStack>
      </Box>
    );
  }
);

FontPreview.displayName = 'FontPreview';

// Memoized font button to prevent unnecessary re-renders
const FontButton = memo<FontButtonProps>(
  ({
    font,
    isSelected,
    onClick,
    onHover,
    onLeave,
    disabled,
    isLoading = false,
  }) => {
    return (
      <Button
        onClick={onClick}
        onMouseEnter={() => onHover(font)}
        onMouseLeave={onLeave}
        disabled={disabled || isLoading}
        variant={isSelected ? 'solid' : 'outline'}
        size="sm"
        px={3}
        py={2}
        height="auto"
        borderWidth="2px"
        borderColor={isSelected ? 'colorPalette.solid' : 'border'}
        bg={isSelected ? 'colorPalette.subtle' : 'bg.canvas'}
        opacity={disabled || isLoading ? 0.6 : 1}
        aria-label={`Sélectionner la police ${font.name}`}
        aria-pressed={isSelected}
        data-selected={isSelected}
      >
        <Text
          fontSize="sm"
          fontFamily={font.family}
          fontWeight={isSelected ? 'semibold' : 'normal'}
          color={isSelected ? 'colorPalette.solid' : 'fg'}
          whiteSpace="nowrap"
        >
          {font.name}
        </Text>
      </Button>
    );
  }
);

FontButton.displayName = 'FontButton';

const FontSelector = memo<FontSelectorProps>(
  ({ selectedFont, onFontChange, disabled = false, isLoading = false }) => {
    const textColor = 'fg.muted';
    const [announcement, setAnnouncement] = useState('');
    const [hoveredFont, setHoveredFont] = useState<FontMetadata | null>(null);

    const fontsByCategory = useMemo(() => getFontsByCategory(), []);
    const categories = useMemo(
      () => Object.keys(fontsByCategory) as FontCategory[],
      [fontsByCategory]
    );

    // Get metadata for the current font (either hovered or selected)
    const previewFontName = hoveredFont?.name || selectedFont;
    const previewFontMetadata = useMemo(
      () => hoveredFont || getFontByName(selectedFont),
      [hoveredFont, selectedFont]
    );
    const isPreview = hoveredFont !== null;

    // Load preview font dynamically
    usePreviewFontLoader(hoveredFont?.name || null);

    // Handlers for font button hover
    const handleFontHover = useCallback((font: FontMetadata) => {
      setHoveredFont(font);
    }, []);

    const handleFontLeave = useCallback(() => {
      setHoveredFont(null);
    }, []);

    // Announce font changes for screen readers
    useEffect(() => {
      if (selectedFont) {
        setAnnouncement(`Police du site changée en ${selectedFont}`);
        // Clear announcement after it's read
        const timer = setTimeout(() => setAnnouncement(''), 1000);
        return () => clearTimeout(timer);
      }
    }, [selectedFont]);

    return (
      <VStack gap={4} align="start" width="full">
        {/* ARIA live region for screen reader announcements */}
        <Box
          position="absolute"
          width="1px"
          height="1px"
          padding={0}
          margin="-1px"
          overflow="hidden"
          clip="rect(0, 0, 0, 0)"
          border={0}
          aria-live="polite"
          aria-atomic="true"
          whiteSpace="nowrap"
        >
          {announcement}
        </Box>

        <HStack gap={2} align="center">
          <Text
            fontSize="md"
            fontWeight="medium"
            color={textColor}
            data-testid="website-font-label"
          >
            Police du site
          </Text>
          {isLoading && (
            <Spinner
              size="sm"
              color="fg.muted"
              aria-label="Mise à jour de la police"
            />
          )}
        </HStack>

        {/* Font Preview Section */}
        <FontPreview
          fontName={previewFontName}
          fontMetadata={previewFontMetadata}
          isPreview={isPreview}
        />

        <VStack gap={4} align="start" width="full">
          {categories.map((category) => (
            <Box key={category} width="full">
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="fg.subtle"
                textTransform="uppercase"
                letterSpacing="wide"
                mb={2}
              >
                {FONT_CATEGORY_LABELS[category]}
              </Text>
              <HStack gap={2} wrap="wrap" width="full">
                {fontsByCategory[category].map((font) => (
                  <FontButton
                    key={font.name}
                    font={font}
                    isSelected={selectedFont === font.name}
                    onClick={() => onFontChange(font.name)}
                    onHover={handleFontHover}
                    onLeave={handleFontLeave}
                    disabled={disabled}
                    isLoading={isLoading}
                  />
                ))}
              </HStack>
            </Box>
          ))}
        </VStack>

        <Text fontSize="sm" color={textColor} opacity={0.7}>
          {isLoading
            ? 'Mise à jour de la police...'
            : 'Sélectionnez une police pour personnaliser la typographie de votre site. Survolez les polices pour un aperçu.'}
        </Text>
      </VStack>
    );
  }
);

FontSelector.displayName = 'FontSelector';

export { FontSelector };
