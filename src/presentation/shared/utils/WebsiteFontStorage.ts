'use client';

import { DEFAULT_FONT } from '@/domain/settings/constants/AvailableFonts';

const WEBSITE_FONT_STORAGE_KEY = 'shower-website-font';
const WEBSITE_FONT_UPDATE_EVENT = 'website-font-updated';

// Client-side website font persistence
export class WebsiteFontStorage {
  static getWebsiteFont(): string {
    if (typeof window === 'undefined') {
      return DEFAULT_FONT; // Default for SSR
    }

    try {
      const stored = localStorage.getItem(WEBSITE_FONT_STORAGE_KEY);
      return stored || DEFAULT_FONT;
    } catch {
      return DEFAULT_FONT;
    }
  }

  static setWebsiteFont(font: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(WEBSITE_FONT_STORAGE_KEY, font);
      this.dispatchUpdate(font);
    } catch {}
  }

  static dispatchUpdate(font: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const event = new CustomEvent(WEBSITE_FONT_UPDATE_EVENT, {
        detail: font,
      });
      window.dispatchEvent(event);
    } catch {}
  }

  static listenToUpdate(callback: (font: string) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleUpdate = (event: CustomEvent<string>) => {
      callback(event.detail);
    };

    window.addEventListener(
      WEBSITE_FONT_UPDATE_EVENT,
      handleUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        WEBSITE_FONT_UPDATE_EVENT,
        handleUpdate as EventListener
      );
    };
  }

  static async syncWithServer(): Promise<string> {
    try {
      const response = await fetch(
        '/api/settings/website-font?t=' + Date.now(),
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const font = data.websiteFont || DEFAULT_FONT;
      this.setWebsiteFont(font);
      return font;
    } catch {
      return DEFAULT_FONT;
    }
  }
}
