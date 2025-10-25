import { renderHook, waitFor } from '@testing-library/react';
import { useSocialNetworksFooter } from '@/presentation/shared/components/SocialNetworksFooter/useSocialNetworksFooter';

// Mock fetch
global.fetch = jest.fn();

describe('useSocialNetworksFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useSocialNetworksFooter());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.socialNetworks).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should fetch social networks successfully', async () => {
    const mockSocialNetworks = [
      {
        type: 'instagram',
        url: 'https://instagram.com/test',
        label: 'Instagram',
        icon: 'FaInstagram',
      },
      {
        type: 'email',
        url: 'mailto:test@example.com',
        label: 'Email',
        icon: 'FaEnvelope',
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockSocialNetworks,
        }),
    });

    const { result } = renderHook(() => useSocialNetworksFooter());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.socialNetworks).toEqual(mockSocialNetworks);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle API error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useSocialNetworksFooter());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.socialNetworks).toBeNull();
      expect(result.current.error).toBe('Failed to fetch social networks: 500');
    });
  });

  it('should handle network error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSocialNetworksFooter());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.socialNetworks).toBeNull();
      expect(result.current.error).toBe('Network error');
    });
  });
});
