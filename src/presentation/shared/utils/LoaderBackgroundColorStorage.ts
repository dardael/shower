import { LoaderBackgroundColor } from '@/domain/settings/value-objects/LoaderBackgroundColor';

const STORAGE_KEY = 'loader-background-color';
const UPDATE_EVENT = 'loader-background-color-update';

export class LoaderBackgroundColorStorage {
  static getValue(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && LoaderBackgroundColor.isValid(stored)) {
        return stored;
      }
      return null;
    } catch {
      return null;
    }
  }

  static setValue(value: string | null): void {
    if (typeof window === 'undefined') return;
    try {
      if (value === null) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, value);
      }
      this.dispatchUpdate(value);
    } catch {
      // Ignore storage errors
    }
  }

  static dispatchUpdate(value: string | null): void {
    if (typeof window === 'undefined') return;
    try {
      const event = new CustomEvent(UPDATE_EVENT, { detail: value });
      window.dispatchEvent(event);
    } catch {
      // Ignore dispatch errors
    }
  }

  static listenToUpdate(callback: (value: string | null) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handleUpdate = (event: CustomEvent<string | null>): void => {
      callback(event.detail);
    };
    window.addEventListener(UPDATE_EVENT, handleUpdate as EventListener);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate as EventListener);
    };
  }

  static async syncWithServer(): Promise<string | null> {
    try {
      const response = await fetch(
        '/api/public/loader-background-color?t=' + Date.now(),
        {
          cache: 'no-store',
        }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const value = data.value || null;
      this.setValue(value);
      return value;
    } catch {
      return null;
    }
  }
}
