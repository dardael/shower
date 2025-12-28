'use client';

import { useState, useCallback, useEffect } from 'react';
import { LoaderBackgroundColorStorage } from '@/presentation/shared/utils/LoaderBackgroundColorStorage';
import { LoaderBackgroundColor } from '@/domain/settings/value-objects/LoaderBackgroundColor';

export interface UseLoaderBackgroundColorResult {
  value: string | null;
  updateValue: (value: string | null) => Promise<void>;
  refreshValue: () => Promise<void>;
  isLoading: boolean;
  setValue: (value: string | null) => void;
}

export function useLoaderBackgroundColor(): UseLoaderBackgroundColorResult {
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateValue = useCallback(async (newValue: string | null) => {
    if (newValue !== null && !LoaderBackgroundColor.isValid(newValue)) {
      throw new Error('Invalid loader background color format');
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/loader-background-color', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newValue }),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      LoaderBackgroundColorStorage.setValue(newValue);
      setValue(newValue);
    } catch {
      throw new Error('Failed to update loader background color');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshValue = useCallback(async () => {
    setIsLoading(true);
    try {
      const serverValue = await LoaderBackgroundColorStorage.syncWithServer();
      setValue(serverValue);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const stored = LoaderBackgroundColorStorage.getValue();
      setValue(stored);

      const serverValue = await LoaderBackgroundColorStorage.syncWithServer();
      setValue(serverValue);
    };
    initialize();
  }, []);

  useEffect(() => {
    const unsubscribe = LoaderBackgroundColorStorage.listenToUpdate(
      (newValue) => {
        setValue(newValue);
      }
    );
    return unsubscribe;
  }, []);

  return { value, updateValue, refreshValue, isLoading, setValue };
}
