'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useLogger } from '@/presentation/shared/hooks/useLogger';

interface AppointmentModuleContextType {
  isEnabled: boolean;
  isLoading: boolean;
  toggle: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AppointmentModuleContext = createContext<
  AppointmentModuleContextType | undefined
>(undefined);

const LOCAL_STORAGE_KEY = 'appointment-module-enabled';
const BROADCAST_CHANNEL_NAME = 'appointment-module-sync';

interface AppointmentModuleProviderProps {
  children: ReactNode;
}

export function AppointmentModuleProvider({
  children,
}: AppointmentModuleProviderProps): React.ReactElement {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const logger = useLogger();

  const fetchStatus = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/settings/appointment-module');
      if (response.ok) {
        const data = await response.json();
        setIsEnabled(data.enabled);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.enabled));
      }
    } catch (error) {
      logger.error(
        'Échec de la récupération du statut du module de rendez-vous',
        error
      );
      // Try to use cached value
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached !== null) {
        setIsEnabled(JSON.parse(cached));
      }
    } finally {
      setIsLoading(false);
    }
  }, [logger]);

  const toggle = useCallback(async (): Promise<void> => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);

    try {
      const response = await fetch('/api/settings/appointment-module', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newValue }),
      });

      if (!response.ok) {
        // Revert on failure
        setIsEnabled(!newValue);
        throw new Error(
          'Échec de la mise à jour du statut du module de rendez-vous'
        );
      }

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newValue));

      // Broadcast change to other tabs
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({ enabled: newValue });
      channel.close();
    } catch (error) {
      logger.error('Échec de la bascule du module de rendez-vous', error);
      throw error;
    }
  }, [isEnabled, logger]);

  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    // Load cached value first for faster initial render
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached !== null) {
      setIsEnabled(JSON.parse(cached));
      setIsLoading(false);
    }

    // Then fetch fresh data
    fetchStatus();

    // Listen for changes from other tabs
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.onmessage = (event): void => {
      if (typeof event.data?.enabled === 'boolean') {
        setIsEnabled(event.data.enabled);
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(event.data.enabled)
        );
      }
    };

    return (): void => {
      channel.close();
    };
  }, [fetchStatus]);

  return (
    <AppointmentModuleContext.Provider
      value={{ isEnabled, isLoading, toggle, refresh }}
    >
      {children}
    </AppointmentModuleContext.Provider>
  );
}

export function useAppointmentModule(): AppointmentModuleContextType {
  const context = useContext(AppointmentModuleContext);
  if (!context) {
    throw new Error(
      'useAppointmentModule must be used within an AppointmentModuleProvider'
    );
  }
  return context;
}
