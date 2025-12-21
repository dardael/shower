'use client';

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';

interface SellingConfigContextValue {
  sellingEnabled: boolean;
  isLoading: boolean;
  error: Error | null;
  updateSellingEnabled: (enabled: boolean) => Promise<void>;
  refreshSellingEnabled: () => Promise<void>;
}

const DEFAULT_SELLING_ENABLED = false;
const SELLING_ENABLED_STORAGE_KEY = 'shower-selling-enabled';
const SELLING_ENABLED_BROADCAST_CHANNEL = 'shower-selling-enabled-sync';

const SellingConfigContext = createContext<SellingConfigContextValue | null>(
  null
);

interface SellingConfigProviderProps {
  children: ReactNode;
}

export function SellingConfigProvider({
  children,
}: SellingConfigProviderProps): React.JSX.Element {
  const [sellingEnabled, setSellingEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SELLING_ENABLED_STORAGE_KEY);
      if (stored === 'true' || stored === 'false') {
        return stored === 'true';
      }
    }
    return DEFAULT_SELLING_ENABLED;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      localStorage.setItem(
        SELLING_ENABLED_STORAGE_KEY,
        sellingEnabled ? 'true' : 'false'
      );
    }
  }, [sellingEnabled, isLoading]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      broadcastChannelRef.current = new BroadcastChannel(
        SELLING_ENABLED_BROADCAST_CHANNEL
      );

      broadcastChannelRef.current.onmessage = (event) => {
        const enabled = event.data as boolean;
        if (typeof enabled === 'boolean') {
          setSellingEnabled(enabled);
        }
      };

      return () => {
        broadcastChannelRef.current?.close();
      };
    }
    return undefined;
  }, []);

  const fetchSellingEnabled = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/settings', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const enabled = data.sellingEnabled as boolean;
      if (typeof enabled === 'boolean') {
        setSellingEnabled(enabled);
      } else {
        setSellingEnabled(DEFAULT_SELLING_ENABLED);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch selling enabled setting')
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSellingEnabled = useCallback(
    async (enabled: boolean): Promise<void> => {
      const previousValue = sellingEnabled;
      setSellingEnabled(enabled);
      setError(null);

      broadcastChannelRef.current?.postMessage(enabled);

      try {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sellingEnabled: enabled }),
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        setSellingEnabled(previousValue);
        broadcastChannelRef.current?.postMessage(previousValue);
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to update selling enabled setting')
        );
        throw err;
      }
    },
    [sellingEnabled]
  );

  useEffect(() => {
    fetchSellingEnabled();
  }, [fetchSellingEnabled]);

  const value: SellingConfigContextValue = {
    sellingEnabled,
    isLoading,
    error,
    updateSellingEnabled,
    refreshSellingEnabled: fetchSellingEnabled,
  };

  return (
    <SellingConfigContext.Provider value={value}>
      {children}
    </SellingConfigContext.Provider>
  );
}

export function useSellingConfig(): SellingConfigContextValue {
  const context = useContext(SellingConfigContext);
  if (!context) {
    throw new Error(
      'useSellingConfig must be used within a SellingConfigProvider'
    );
  }
  return context;
}
