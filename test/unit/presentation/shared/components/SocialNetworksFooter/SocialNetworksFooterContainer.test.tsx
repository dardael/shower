import { render, screen } from '@testing-library/react';
import { SocialNetworksFooterContainer } from '@/presentation/shared/components/SocialNetworksFooter/SocialNetworksFooterContainer';

// Mock the hook
jest.mock(
  '@/presentation/shared/components/SocialNetworksFooter/useSocialNetworksFooter',
  () => ({
    useSocialNetworksFooter: jest.fn(),
  })
);

import { useSocialNetworksFooter } from '@/presentation/shared/components/SocialNetworksFooter/useSocialNetworksFooter';

describe('SocialNetworksFooterContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading spinner initially', () => {
    (useSocialNetworksFooter as jest.Mock).mockReturnValue({
      socialNetworks: null,
      isLoading: true,
      error: null,
    });

    render(<SocialNetworksFooterContainer />);

    // Check for loading spinner
    const spinner = screen.getByRole('status', { name: /loading/i });
    expect(spinner).toBeInTheDocument();
  });

  it('should not render on error', () => {
    (useSocialNetworksFooter as jest.Mock).mockReturnValue({
      socialNetworks: null,
      isLoading: false,
      error: 'API Error',
    });

    render(<SocialNetworksFooterContainer />);

    // Component should return null on error
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('should render footer when social networks are loaded', () => {
    const mockSocialNetworks = [
      {
        type: 'instagram',
        url: 'https://instagram.com/test',
        label: 'Instagram',
        icon: 'FaInstagram',
      },
    ];

    (useSocialNetworksFooter as jest.Mock).mockReturnValue({
      socialNetworks: mockSocialNetworks,
      isLoading: false,
      error: null,
    });

    render(<SocialNetworksFooterContainer />);

    // Check for footer
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute('aria-label', 'Social networks footer');
  });

  it('should not render when no social networks', () => {
    (useSocialNetworksFooter as jest.Mock).mockReturnValue({
      socialNetworks: [],
      isLoading: false,
      error: null,
    });

    render(<SocialNetworksFooterContainer />);

    // Component should return null when no social networks
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });
});
