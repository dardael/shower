import { render, screen } from '@testing-library/react';
import { SocialNetworksFooterContainer } from '@/presentation/shared/components/SocialNetworksFooter/SocialNetworksFooterContainer';

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

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

    // Check for loading spinner using data-testid
    const spinner = screen.getByTestId('social-networks-footer');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Social networks footer');
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

  it('should render placeholder when no social networks', () => {
    (useSocialNetworksFooter as jest.Mock).mockReturnValue({
      socialNetworks: [],
      isLoading: false,
      error: null,
    });

    render(<SocialNetworksFooterContainer />);

    // Component should render placeholder when no social networks
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(
      screen.getByText('No social networks configured yet')
    ).toBeInTheDocument();
  });
});
