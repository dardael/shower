'use client';

import { HeaderMenuTextColor } from '@/domain/settings/value-objects/HeaderMenuTextColor';

const HEADER_MENU_TEXT_COLOR_STORAGE_KEY = 'shower-header-menu-text-color';
const HEADER_MENU_TEXT_COLOR_UPDATE_EVENT = 'header-menu-text-color-updated';

export class HeaderMenuTextColorStorage {
  static getColor(): string {
    if (typeof window === 'undefined') {
      return HeaderMenuTextColor.getDefault();
    }

    try {
      const stored = localStorage.getItem(HEADER_MENU_TEXT_COLOR_STORAGE_KEY);
      return stored || HeaderMenuTextColor.getDefault();
    } catch {
      return HeaderMenuTextColor.getDefault();
    }
  }

  static setColor(color: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(HEADER_MENU_TEXT_COLOR_STORAGE_KEY, color);
      this.dispatchUpdate(color);
    } catch (error) {
      console.warn(
        'Failed to save header menu text color to localStorage:',
        error
      );
    }
  }

  static dispatchUpdate(color: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const event = new CustomEvent(HEADER_MENU_TEXT_COLOR_UPDATE_EVENT, {
        detail: color,
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.warn(
        'Failed to dispatch header menu text color update event:',
        error
      );
    }
  }

  static listenToUpdate(callback: (color: string) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleUpdate = (event: CustomEvent<string>) => {
      callback(event.detail);
    };

    window.addEventListener(
      HEADER_MENU_TEXT_COLOR_UPDATE_EVENT,
      handleUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        HEADER_MENU_TEXT_COLOR_UPDATE_EVENT,
        handleUpdate as EventListener
      );
    };
  }

  static async syncWithServer(): Promise<string> {
    try {
      const response = await fetch('/api/settings/header-menu-text-color', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const color = data.value || HeaderMenuTextColor.getDefault();
      this.setColor(color);
      return color;
    } catch (error) {
      console.warn('Failed to sync header menu text color with server:', error);
      return HeaderMenuTextColor.getDefault();
    }
  }
}
