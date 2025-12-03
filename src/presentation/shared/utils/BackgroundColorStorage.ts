'use client';

import { ThemeColorToken } from '@/domain/settings/constants/ThemeColorPalette';

const BACKGROUND_COLOR_STORAGE_KEY = 'shower-background-color';
const BACKGROUND_COLOR_UPDATE_EVENT = 'background-color-updated';

// Client-side background color persistence
export class BackgroundColorStorage {
  static getBackgroundColor(): ThemeColorToken {
    if (typeof window === 'undefined') {
      return 'blue'; // Default for SSR
    }

    try {
      const stored = localStorage.getItem(BACKGROUND_COLOR_STORAGE_KEY);
      return (stored as ThemeColorToken) || 'blue';
    } catch {
      return 'blue';
    }
  }

  static setBackgroundColor(color: ThemeColorToken): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(BACKGROUND_COLOR_STORAGE_KEY, color);
      this.dispatchUpdate(color);
    } catch {}
  }

  static dispatchUpdate(color: ThemeColorToken): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const event = new CustomEvent(BACKGROUND_COLOR_UPDATE_EVENT, {
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
      BACKGROUND_COLOR_UPDATE_EVENT,
      handleUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        BACKGROUND_COLOR_UPDATE_EVENT,
        handleUpdate as EventListener
      );
    };
  }

  static async syncWithServer(): Promise<ThemeColorToken> {
    try {
      const response = await fetch('/api/settings?t=' + Date.now(), {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const color = data.backgroundColor || 'blue';
      this.setBackgroundColor(color);
      return color;
    } catch {
      return 'blue';
    }
  }
}
