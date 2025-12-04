import { Node, mergeAttributes } from '@tiptap/core';
import type {
  OverlayFontSize,
  OverlayPosition,
  OverlayAlign,
  ImageTextOverlay,
} from '@/domain/pages/types/ImageOverlay';
import {
  DEFAULT_OVERLAY_CONFIG,
  OVERLAY_FONT_SIZES,
} from '@/domain/pages/types/ImageOverlay';

/**
 * Calculates luminance from a hex color to determine if it's light or dark
 */
function getColorLuminance(hexColor: string): number {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Gets contrasting background color based on text color
 */
function getContrastBackground(textColor: string): string {
  const luminance = getColorLuminance(textColor);
  return luminance > 0.5 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';
}

export interface ImageWithOverlayOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageWithOverlay: {
      /**
       * Add text overlay to the image at the given position
       */
      addOverlay: (text: string, pos: number) => ReturnType;
      /**
       * Update overlay attributes
       */
      updateOverlay: (attrs: Partial<OverlayAttributes>) => ReturnType;
      /**
       * Remove overlay from the image at the given position
       */
      removeOverlay: (pos: number) => ReturnType;
    };
  }
}

/**
 * Overlay attributes for Tiptap node.
 * Maps ImageTextOverlay properties with 'overlay' prefix for HTML data attributes.
 */
export type OverlayAttributes = {
  [K in keyof ImageTextOverlay as `overlay${Capitalize<K>}`]: K extends 'text'
    ? string | null
    : ImageTextOverlay[K];
};

export const ImageWithOverlay = Node.create<ImageWithOverlayOptions>({
  name: 'imageWithOverlay',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      // Image attributes
      src: {
        default: null,
        parseHTML: (element) => {
          const img = element.querySelector('img');
          return img?.getAttribute('src') || null;
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => {
          const img = element.querySelector('img');
          return img?.getAttribute('alt') || null;
        },
      },
      title: {
        default: null,
        parseHTML: (element) => {
          const img = element.querySelector('img');
          return img?.getAttribute('title') || null;
        },
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const img = element.querySelector('img');
          const style = img?.getAttribute('style') || '';
          const match = style.match(/width:\s*(\d+)px/);
          return match ? parseInt(match[1], 10) : null;
        },
      },
      textAlign: {
        default: null,
        parseHTML: (element) => {
          // Check wrapper first, then fall back to img
          const wrapperAlign = element.getAttribute('data-text-align');
          if (wrapperAlign) return wrapperAlign;
          const img = element.querySelector('img');
          return img?.getAttribute('data-text-align') || null;
        },
      },
      // Overlay attributes
      overlayText: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-overlay-text'),
        renderHTML: (attributes) => {
          if (!attributes.overlayText) {
            return {};
          }
          return { 'data-overlay-text': attributes.overlayText };
        },
      },
      overlayColor: {
        default: DEFAULT_OVERLAY_CONFIG.color,
        parseHTML: (element) =>
          element.getAttribute('data-overlay-color') ||
          DEFAULT_OVERLAY_CONFIG.color,
        renderHTML: (attributes) => {
          return { 'data-overlay-color': attributes.overlayColor };
        },
      },
      overlayFontFamily: {
        default: DEFAULT_OVERLAY_CONFIG.fontFamily,
        parseHTML: (element) =>
          element.getAttribute('data-overlay-font') ||
          DEFAULT_OVERLAY_CONFIG.fontFamily,
        renderHTML: (attributes) => {
          return { 'data-overlay-font': attributes.overlayFontFamily };
        },
      },
      overlayFontSize: {
        default: DEFAULT_OVERLAY_CONFIG.fontSize,
        parseHTML: (element) =>
          (element.getAttribute('data-overlay-size') as OverlayFontSize) ||
          DEFAULT_OVERLAY_CONFIG.fontSize,
        renderHTML: (attributes) => {
          return { 'data-overlay-size': attributes.overlayFontSize };
        },
      },
      overlayPosition: {
        default: DEFAULT_OVERLAY_CONFIG.position,
        parseHTML: (element) =>
          (element.getAttribute('data-overlay-position') as OverlayPosition) ||
          DEFAULT_OVERLAY_CONFIG.position,
        renderHTML: (attributes) => {
          return { 'data-overlay-position': attributes.overlayPosition };
        },
      },
      overlayAlign: {
        default: DEFAULT_OVERLAY_CONFIG.align,
        parseHTML: (element) =>
          (element.getAttribute('data-overlay-align') as OverlayAlign) ||
          DEFAULT_OVERLAY_CONFIG.align,
        renderHTML: (attributes) => {
          return { 'data-overlay-align': attributes.overlayAlign };
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
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.image-with-overlay',
      },
    ];
  },

  renderHTML({ node }) {
    const {
      src,
      alt,
      title,
      width,
      textAlign,
      overlayText,
      overlayColor,
      overlayFontFamily,
      overlayFontSize,
      overlayPosition,
      overlayAlign,
      fullWidth,
    } = node.attrs;

    // When fullWidth is true, use width: 100%; otherwise use fixed width if set
    const imgStyle = fullWidth
      ? 'width: 100%;'
      : width
        ? `width: ${width}px;`
        : '';
    const imgAttrs: Record<string, string> = {
      src: src || '',
      class: 'tiptap-image',
    };
    if (alt) imgAttrs.alt = alt;
    if (title) imgAttrs.title = title;
    if (imgStyle) imgAttrs.style = imgStyle;
    if (textAlign) imgAttrs['data-text-align'] = textAlign;

    // Build wrapper style for alignment (inline styles survive DOMPurify)
    // When fullWidth is true, use width: 100% instead of fit-content
    let wrapperStyle = fullWidth
      ? 'position: relative; display: block; width: 100%;'
      : 'position: relative; display: block; width: fit-content;';
    if (!fullWidth) {
      if (textAlign === 'center') {
        wrapperStyle += ' margin-left: auto; margin-right: auto;';
      } else if (textAlign === 'right') {
        wrapperStyle += ' margin-left: auto; margin-right: 0;';
      } else {
        wrapperStyle += ' margin-left: 0; margin-right: auto;';
      }
    }

    const wrapperAttrs = mergeAttributes(this.options.HTMLAttributes, {
      class: 'image-with-overlay',
      style: wrapperStyle,
      'data-text-align': textAlign,
      'data-full-width': fullWidth ? 'true' : null,
      'data-overlay-text': overlayText,
      'data-overlay-color': overlayColor,
      'data-overlay-font': overlayFontFamily,
      'data-overlay-size': overlayFontSize,
      'data-overlay-position': overlayPosition,
      'data-overlay-align': overlayAlign,
    });

    // Remove null/undefined attributes
    Object.keys(wrapperAttrs).forEach((key) => {
      if (wrapperAttrs[key] === null || wrapperAttrs[key] === undefined) {
        delete wrapperAttrs[key];
      }
    });

    const overlayStyle = overlayText
      ? `color: ${overlayColor}; font-family: '${overlayFontFamily}', sans-serif; font-size: ${OVERLAY_FONT_SIZES[overlayFontSize as OverlayFontSize]}px; background: ${getContrastBackground(overlayColor)};`
      : '';

    if (overlayText) {
      return [
        'div',
        wrapperAttrs,
        ['img', imgAttrs],
        [
          'div',
          {
            class: `text-overlay text-overlay-${overlayPosition} text-overlay-align-${overlayAlign}`,
            style: overlayStyle,
          },
          overlayText,
        ],
      ];
    }

    return ['div', wrapperAttrs, ['img', imgAttrs]];
  },

  addCommands() {
    return {
      addOverlay:
        (text: string, pos: number) =>
        ({ tr, state, dispatch }) => {
          const node = state.doc.nodeAt(pos);

          if (node?.type.name === 'image') {
            // Create new imageWithOverlay node with all original image attributes
            const imageWithOverlayType = state.schema.nodes.imageWithOverlay;
            const newNode = imageWithOverlayType.create({
              src: node.attrs.src,
              alt: node.attrs.alt,
              title: node.attrs.title,
              width: node.attrs.width,
              textAlign: node.attrs.textAlign,
              fullWidth: node.attrs.fullWidth || false,
              overlayText: text,
              overlayColor: DEFAULT_OVERLAY_CONFIG.color,
              overlayFontFamily: DEFAULT_OVERLAY_CONFIG.fontFamily,
              overlayFontSize: DEFAULT_OVERLAY_CONFIG.fontSize,
              overlayPosition: DEFAULT_OVERLAY_CONFIG.position,
              overlayAlign: DEFAULT_OVERLAY_CONFIG.align,
            });

            // Replace the image node with imageWithOverlay
            if (dispatch) {
              tr.replaceWith(pos, pos + node.nodeSize, newNode);
              dispatch(tr);
            }
            return true;
          }

          if (node?.type.name === 'imageWithOverlay') {
            // Just update the overlay text
            if (dispatch) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                overlayText: text,
              });
              dispatch(tr);
            }
            return true;
          }

          return false;
        },

      updateOverlay:
        (attrs: Partial<OverlayAttributes>) =>
        ({ commands }) => {
          return commands.updateAttributes('imageWithOverlay', attrs);
        },

      removeOverlay:
        (pos: number) =>
        ({ tr, state, dispatch }) => {
          const node = state.doc.nodeAt(pos);

          if (node?.type.name === 'imageWithOverlay') {
            // Create plain image node with preserved attributes
            const imageType = state.schema.nodes.image;
            const newNode = imageType.create({
              src: node.attrs.src,
              alt: node.attrs.alt,
              title: node.attrs.title,
              width: node.attrs.width,
              textAlign: node.attrs.textAlign,
              fullWidth: node.attrs.fullWidth || false,
            });

            // Replace imageWithOverlay with plain image
            if (dispatch) {
              tr.replaceWith(pos, pos + node.nodeSize, newNode);
              dispatch(tr);
            }
            return true;
          }

          return false;
        },
    };
  },
});

export default ImageWithOverlay;
