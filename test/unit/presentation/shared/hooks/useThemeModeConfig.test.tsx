/**
 * @jest-environment jsdom
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import {
  ThemeModeProvider,
  useThemeModeConfig,
} from '@/presentation/shared/contexts/ThemeModeContext';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Wrapper component for the provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeModeProvider>{children}</ThemeModeProvider>
);

describe('useThemeModeConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage to ensure clean state between tests
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should start with user-choice as default', () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'user-choice' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      expect(result.current.themeMode).toBe('user-choice');
      expect(result.current.isLoading).toBe(true);
    });

    it('should fetch theme mode on mount', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'force-dark' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.themeMode).toBe('force-dark');
      expect(mockFetch).toHaveBeenCalledWith('/api/settings', {
        cache: 'no-store',
      });
    });
  });

  describe('isForced', () => {
    it('should return true when force-light is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'force-light' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isForced).toBe(true);
    });

    it('should return true when force-dark is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'force-dark' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isForced).toBe(true);
    });

    it('should return false when user-choice is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'user-choice' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isForced).toBe(false);
    });
  });

  describe('forcedMode', () => {
    it('should return light when force-light is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'force-light' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.forcedMode).toBe('light');
    });

    it('should return dark when force-dark is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'force-dark' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.forcedMode).toBe('dark');
    });

    it('should return null when user-choice is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'user-choice' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.forcedMode).toBeNull();
    });
  });

  describe('shouldShowToggle', () => {
    it('should return true when user-choice is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'user-choice' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.shouldShowToggle).toBe(true);
    });

    it('should return false when force-light is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'force-light' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.shouldShowToggle).toBe(false);
    });

    it('should return false when force-dark is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'force-dark' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.shouldShowToggle).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should keep localStorage value on fetch error', async () => {
      // Set a value in localStorage before the error
      localStorage.setItem('shower-theme-mode', 'force-light');
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should keep the localStorage value, not reset to user-choice
      expect(result.current.themeMode).toBe('force-light');
      expect(result.current.error).toBeTruthy();
    });

    it('should keep localStorage value on HTTP error', async () => {
      // Set a value in localStorage before the error
      localStorage.setItem('shower-theme-mode', 'force-dark');
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should keep the localStorage value, not reset to user-choice
      expect(result.current.themeMode).toBe('force-dark');
      expect(result.current.error).toBeTruthy();
    });

    it('should default to user-choice for invalid theme mode value', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ themeMode: 'invalid-mode' }),
      });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.themeMode).toBe('user-choice');
    });
  });

  describe('updateThemeMode', () => {
    it('should update theme mode with optimistic update', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ themeMode: 'user-choice' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateThemeMode('force-dark');
      });

      expect(result.current.themeMode).toBe('force-dark');
      expect(mockFetch).toHaveBeenLastCalledWith('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeMode: 'force-dark' }),
        cache: 'no-store',
      });
    });

    it('should rollback on update failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ themeMode: 'user-choice' }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
        });

      const { result } = renderHook(() => useThemeModeConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.updateThemeMode('force-dark');
        })
      ).rejects.toThrow();

      // Should rollback to original value
      expect(result.current.themeMode).toBe('user-choice');
    });
  });
});
