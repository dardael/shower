/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import {
  AppointmentModuleProvider,
  useAppointmentModule,
} from '@/presentation/shared/contexts/AppointmentModuleContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock BroadcastChannel
const mockBroadcastChannel = {
  postMessage: jest.fn(),
  close: jest.fn(),
  onmessage: null as ((event: MessageEvent) => void) | null,
};

global.BroadcastChannel = jest.fn().mockImplementation(() => ({
  ...mockBroadcastChannel,
}));

// Mock fetch
global.fetch = jest.fn();
const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;

function wrapper({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <AppointmentModuleProvider>{children}</AppointmentModuleProvider>;
}

describe('AppointmentModuleContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ enabled: false }),
    } as Response);
  });

  describe('useAppointmentModule', () => {
    it('should throw error when used outside AppointmentModuleProvider', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAppointmentModule());
      }).toThrow(
        'useAppointmentModule must be used within an AppointmentModuleProvider'
      );

      consoleError.mockRestore();
    });

    it('should provide context values', async () => {
      const { result } = renderHook(() => useAppointmentModule(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current).toHaveProperty('isEnabled');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('toggle');
      expect(result.current).toHaveProperty('refresh');
    });
  });

  describe('initial state', () => {
    it('should fetch status from API on mount', async () => {
      mockedFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ enabled: true }),
      } as Response);

      const { result } = renderHook(() => useAppointmentModule(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockedFetch).toHaveBeenCalledWith(
        '/api/settings/appointment-module'
      );
      expect(result.current.isEnabled).toBe(true);
    });

    it('should use cached value from localStorage initially', async () => {
      localStorageMock.setItem('appointment-module-enabled', 'true');
      mockedFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ enabled: true }),
      } as Response);

      const { result } = renderHook(() => useAppointmentModule(), { wrapper });

      // Should immediately use cached value
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(true);
    });

    it('should fallback to cached value when API fails', async () => {
      localStorageMock.setItem('appointment-module-enabled', 'true');
      mockedFetch.mockRejectedValue(new Error('Network error'));
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() => useAppointmentModule(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(true);
      consoleError.mockRestore();
    });
  });

  describe('toggle', () => {
    it('should toggle the enabled state and call API', async () => {
      mockedFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ enabled: false }),
      } as Response);

      const { result } = renderHook(() => useAppointmentModule(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(false);

      // Mock the PUT response
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ enabled: true }),
      } as Response);

      await act(async () => {
        await result.current.toggle();
      });

      expect(result.current.isEnabled).toBe(true);
      expect(mockedFetch).toHaveBeenCalledWith(
        '/api/settings/appointment-module',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: true }),
        }
      );
    });

    it('should revert state when API call fails', async () => {
      mockedFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ enabled: false }),
      } as Response);

      const { result } = renderHook(() => useAppointmentModule(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(false);

      // Mock the PUT response to fail
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed' }),
      } as Response);

      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(
        act(async () => {
          await result.current.toggle();
        })
      ).rejects.toThrow(
        'Échec de la mise à jour du statut du module de rendez-vous'
      );

      expect(result.current.isEnabled).toBe(false);
      consoleError.mockRestore();
    });

    it('should update localStorage on successful toggle', async () => {
      mockedFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ enabled: false }),
      } as Response);

      const { result } = renderHook(() => useAppointmentModule(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ enabled: true }),
      } as Response);

      await act(async () => {
        await result.current.toggle();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'appointment-module-enabled',
        'true'
      );
    });
  });

  describe('refresh', () => {
    it('should fetch fresh data from API', async () => {
      mockedFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ enabled: false }),
      } as Response);

      const { result } = renderHook(() => useAppointmentModule(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ enabled: true }),
      } as Response);

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.isEnabled).toBe(true);
    });

    it('should update state after refresh', async () => {
      mockedFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ enabled: false }),
      } as Response);

      const { result } = renderHook(() => useAppointmentModule(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(false);

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ enabled: true }),
      } as Response);

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.isEnabled).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'appointment-module-enabled',
        'true'
      );
    });
  });
});
