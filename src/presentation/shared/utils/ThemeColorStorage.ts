'use client';

import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

const THEME_COLOR_STORAGE_KEY = 'shower-theme-color';
const THEME_COLOR_UPDATE_EVENT = 'theme-color-updated';

// Client-side theme color persistence
export class ThemeColorStorage {
  static getThemeColor(): ThemeColorToken {
    if (typeof window === 'undefined') {
      return 'blue'; // Default for SSR
    }

    try {
      const stored = localStorage.getItem(THEME_COLOR_STORAGE_KEY);
      return (stored as ThemeColorToken) || 'blue';
    } catch {
      return 'blue';
    }
  }

  static setThemeColor(color: ThemeColorToken): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(THEME_COLOR_STORAGE_KEY, color);
      this.dispatchUpdate(color);
    } catch {}
  }

  static dispatchUpdate(color: ThemeColorToken): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const event = new CustomEvent(THEME_COLOR_UPDATE_EVENT, {
        detail: color,
      });
      window.dispatchEvent(event);
    } catch {}
  }

  static listenToUpdate(
    callback: (color: ThemeColorToken) => void
  ): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleUpdate = (event: CustomEvent<ThemeColorToken>) => {
      callback(event.detail);
    };

    window.addEventListener(
      THEME_COLOR_UPDATE_EVENT,
      handleUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        THEME_COLOR_UPDATE_EVENT,
        handleUpdate as EventListener
      );
    };
  }

  static async syncWithServer(): Promise<ThemeColorToken> {
    try {
      const response = await fetch(
        '/api/settings/theme-color?t=' + Date.now(),
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const color = data.themeColor || 'blue';
      this.setThemeColor(color);
      return color;
    } catch {
      return 'blue';
    }
  }
}
