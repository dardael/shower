import React from 'react';
import { render, screen } from '@testing-library/react';
import { SocialNetworksFooter } from '@/presentation/shared/components/SocialNetworksFooter/SocialNetworksFooter';
import type {
  SocialNetworksFooterProps,
  PublicSocialNetwork,
} from '@/presentation/shared/components/SocialNetworksFooter/types';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';

describe('SocialNetworksFooter', () => {
  const createMockSocialNetwork = (
    type: SocialNetworkType,
    url: string
  ): PublicSocialNetwork => {
    const socialNetwork = {
      type,
      url,
      label: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
      icon: `Fa${type.charAt(0).toUpperCase() + type.slice(1)}`,
    };
    return socialNetwork;
  };

  const defaultProps: SocialNetworksFooterProps = {
    socialNetworks: undefined,
  };

  it('should not render when no social networks are provided', () => {
    render(<SocialNetworksFooter {...defaultProps} />);

    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('should not render when social networks array is empty', () => {
    render(<SocialNetworksFooter socialNetworks={[]} />);

    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('should not render when social networks is undefined', () => {
    render(<SocialNetworksFooter socialNetworks={undefined} />);

    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('should render footer with social networks', () => {
    const socialNetworks = [
      createMockSocialNetwork(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test'
      ),
      createMockSocialNetwork(
        SocialNetworkType.FACEBOOK,
        'https://facebook.com/test'
      ),
    ];

    render(<SocialNetworksFooter socialNetworks={socialNetworks} />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute('aria-label', 'Social networks footer');
  });

  it('should render default title when showTitle is true', () => {
    const socialNetworks = [
      createMockSocialNetwork(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test'
      ),
    ];

    render(
      <SocialNetworksFooter socialNetworks={socialNetworks} showTitle={true} />
    );

    expect(
      screen.getByRole('heading', { name: 'Follow Us' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Connect with us on your favorite platforms')
    ).toBeInTheDocument();
  });

  it('should render custom title when provided', () => {
    const socialNetworks = [
      createMockSocialNetwork(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test'
      ),
    ];

    render(
      <SocialNetworksFooter
        socialNetworks={socialNetworks}
        title="Custom Title"
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Custom Title' })
    ).toBeInTheDocument();
  });

  it('should not render title when showTitle is false', () => {
    const socialNetworks = [
      createMockSocialNetwork(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test'
      ),
    ];

    render(
      <SocialNetworksFooter socialNetworks={socialNetworks} showTitle={false} />
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Connect with us on your favorite platforms')
    ).not.toBeInTheDocument();
  });

  it('should render all social network items', () => {
    const socialNetworks = [
      createMockSocialNetwork(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test'
      ),
      createMockSocialNetwork(
        SocialNetworkType.FACEBOOK,
        'https://facebook.com/test'
      ),
      createMockSocialNetwork(
        SocialNetworkType.LINKEDIN,
        'https://linkedin.com/in/test'
      ),
    ];

    render(<SocialNetworksFooter socialNetworks={socialNetworks} />);

    expect(
      screen.getByTestId('social-network-item-instagram')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('social-network-item-facebook')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('social-network-item-linkedin')
    ).toBeInTheDocument();
  });

  it('should limit items when maxItems is provided', () => {
    const socialNetworks = [
      createMockSocialNetwork(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test'
      ),
      createMockSocialNetwork(
        SocialNetworkType.FACEBOOK,
        'https://facebook.com/test'
      ),
      createMockSocialNetwork(
        SocialNetworkType.LINKEDIN,
        'https://linkedin.com/in/test'
      ),
      createMockSocialNetwork(
        SocialNetworkType.EMAIL,
        'mailto:test@example.com'
      ),
    ];

    render(
      <SocialNetworksFooter socialNetworks={socialNetworks} maxItems={2} />
    );

    expect(
      screen.getByTestId('social-network-item-instagram')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('social-network-item-facebook')
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('social-network-item-linkedin')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('social-network-item-email')
    ).not.toBeInTheDocument();
  });

  it('should pass correct props to SocialNetworkItem components', () => {
    const socialNetworks = [
      createMockSocialNetwork(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test'
      ),
    ];

    render(<SocialNetworksFooter socialNetworks={socialNetworks} />);

    const socialNetworkItem = screen.getByTestId(
      'social-network-item-instagram'
    );
    expect(socialNetworkItem).toBeInTheDocument();
    expect(socialNetworkItem.closest('a')).toHaveAttribute(
      'href',
      'https://instagram.com/test'
    );
  });

  it('should render with default maxColumns when not provided', () => {
    const socialNetworks = [
      createMockSocialNetwork(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test'
      ),
      createMockSocialNetwork(
        SocialNetworkType.FACEBOOK,
        'https://facebook.com/test'
      ),
    ];

    render(<SocialNetworksFooter socialNetworks={socialNetworks} />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    // The component should render without errors
  });

  it('should render with custom maxColumns', () => {
    const socialNetworks = [
      createMockSocialNetwork(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test'
      ),
      createMockSocialNetwork(
        SocialNetworkType.FACEBOOK,
        'https://facebook.com/test'
      ),
    ];

    render(
      <SocialNetworksFooter
        socialNetworks={socialNetworks}
        maxColumns={{ base: 1, md: 2 }}
      />
    );

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    // The component should render without errors
  });

  it('should render with custom spacing', () => {
    const socialNetworks = [
      createMockSocialNetwork(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test'
      ),
    ];

    render(
      <SocialNetworksFooter socialNetworks={socialNetworks} spacing={8} />
    );

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    // The component should render without errors
  });
});
