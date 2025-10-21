import { renderHook, act, waitFor } from '@testing-library/react';
import { useSocialNetworksForm } from '@/presentation/admin/hooks/useSocialNetworksForm';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { toaster } from '@/presentation/shared/components/ui/toaster';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock toaster
jest.mock('@/presentation/shared/components/ui/toaster');

describe('useSocialNetworksForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useSocialNetworksForm());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSaving).toBe(false);
    expect(result.current.socialNetworks).toEqual([]);
  });

  it('should fetch social networks on mount', async () => {
    const mockSocialNetworks = [
      {
        type: SocialNetworkType.INSTAGRAM,
        url: 'https://instagram.com/username',
        label: 'Instagram',
        enabled: true,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        success: true,
        data: mockSocialNetworks,
      }),
    });

    const { result } = renderHook(() => useSocialNetworksForm());

    // Wait for loading state to change and data to be fetched
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.socialNetworks).toEqual(mockSocialNetworks);
    expect(mockFetch).toHaveBeenCalledWith('/api/settings/social-networks');
  });

  it('should handle fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSocialNetworksForm());

    // Wait for loading state to change
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Failed to load social networks',
      type: 'error',
      duration: 3000,
    });
  });

  it('should handle URL change', () => {
    const { result } = renderHook(() => useSocialNetworksForm());

    act(() => {
      result.current.handleUrlChange(SocialNetworkType.INSTAGRAM, 'new-url');
    });

    // Since socialNetworks is empty initially, this should not crash
    expect(result.current.socialNetworks).toEqual([]);
  });

  it('should handle label change', () => {
    const { result } = renderHook(() => useSocialNetworksForm());

    act(() => {
      result.current.handleLabelChange(
        SocialNetworkType.INSTAGRAM,
        'new-label'
      );
    });

    expect(result.current.socialNetworks).toEqual([]);
  });

  it('should handle enabled change', () => {
    const { result } = renderHook(() => useSocialNetworksForm());

    act(() => {
      result.current.handleEnabledChange(SocialNetworkType.INSTAGRAM, {
        checked: true,
      });
    });

    expect(result.current.socialNetworks).toEqual([]);
  });

  it('should validate form successfully', async () => {
    const mockSocialNetworks = [
      {
        type: SocialNetworkType.INSTAGRAM,
        url: 'https://instagram.com/username',
        label: 'Instagram',
        enabled: true,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        success: true,
        data: mockSocialNetworks,
      }),
    });

    const { result } = renderHook(() => useSocialNetworksForm());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const isValid = result.current.validateForm();
    expect(isValid).toBe(true);
  });

  it('should validate form with missing URL', async () => {
    const mockSocialNetworks = [
      {
        type: SocialNetworkType.INSTAGRAM,
        url: '',
        label: 'Instagram',
        enabled: true,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        success: true,
        data: mockSocialNetworks,
      }),
    });

    const { result } = renderHook(() => useSocialNetworksForm());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const isValid = result.current.validateForm();
    expect(isValid).toBe(false);
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Validation Error',
      description: 'Instagram URL is required when enabled',
      type: 'error',
      duration: 3000,
    });
  });

  it('should handle successful submit', async () => {
    const mockSocialNetworks = [
      {
        type: SocialNetworkType.INSTAGRAM,
        url: 'https://instagram.com/username',
        label: 'Instagram',
        enabled: true,
      },
    ];

    mockFetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          data: mockSocialNetworks,
        }),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
        }),
      });

    const { result } = renderHook(() => useSocialNetworksForm());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.isSaving).toBe(false);
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Success',
      description: 'Social networks updated successfully',
      type: 'success',
      duration: 3000,
    });
  });

  it('should handle submit error', async () => {
    const mockSocialNetworks = [
      {
        type: SocialNetworkType.INSTAGRAM,
        url: 'https://instagram.com/username',
        label: 'Instagram',
        enabled: true,
      },
    ];

    mockFetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({
          success: true,
          data: mockSocialNetworks,
        }),
      })
      .mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSocialNetworksForm());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.isSaving).toBe(false);
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Failed to update social networks: Network error',
      type: 'error',
      duration: 5000,
    });
  });
});
