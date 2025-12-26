'use client';

import { useCallback, useEffect, useState } from 'react';
import { HeaderMenuTextColorStorage } from '@/presentation/shared/utils/HeaderMenuTextColorStorage';
import { HeaderMenuTextColor } from '@/domain/settings/value-objects/HeaderMenuTextColor';

interface UseHeaderMenuTextColorResult {
  headerMenuTextColor: string;
  updateHeaderMenuTextColor: (color: string) => Promise<void>;
  refreshHeaderMenuTextColor: () => Promise<void>;
  isLoading: boolean;
  setHeaderMenuTextColor: (color: string) => void;
}

export function useHeaderMenuTextColor(): UseHeaderMenuTextColorResult {
  const [headerMenuTextColor, setHeaderMenuTextColor] = useState<string>(
    HeaderMenuTextColor.getDefault()
  );
  const [isLoading, setIsLoading] = useState(false);

  const updateHeaderMenuTextColor = useCallback(
    async (color: string): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/settings/header-menu-text-color', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: color }),
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        HeaderMenuTextColorStorage.setColor(color);
        setHeaderMenuTextColor(color);
      } catch {
        throw new Error('Échec de la mise à jour de la couleur du texte');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const refreshHeaderMenuTextColor = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const newColor = await HeaderMenuTextColorStorage.syncWithServer();
      setHeaderMenuTextColor(newColor);
    } catch (error) {
      console.warn('Failed to refresh header menu text color:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeColor = async () => {
      try {
        const storedColor = HeaderMenuTextColorStorage.getColor();
        if (isMounted) {
          setHeaderMenuTextColor(storedColor);
        }

        const serverColor = await HeaderMenuTextColorStorage.syncWithServer();
        if (isMounted) {
          setHeaderMenuTextColor(serverColor);
        }
      } catch (error) {
        console.warn('Failed to initialize header menu text color:', error);
      }
    };

    initializeColor();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = HeaderMenuTextColorStorage.listenToUpdate((color) => {
      setHeaderMenuTextColor(color);
    });

    return unsubscribe;
  }, []);

  return {
    headerMenuTextColor,
    updateHeaderMenuTextColor,
    refreshHeaderMenuTextColor,
    isLoading,
    setHeaderMenuTextColor: (color: string) => {
      setHeaderMenuTextColor(color);
    },
  };
}
