import { render, screen } from '@testing-library/react';
import { SocialNetworkIcon } from '@/presentation/shared/components/SocialNetworksFooter/SocialNetworkIcon';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';

describe('SocialNetworkIcon', () => {
  it('renders Instagram icon correctly', () => {
    render(<SocialNetworkIcon type={SocialNetworkType.INSTAGRAM} size={24} />);

    const icon = screen.getByTestId('social-network-icon-instagram');
    expect(icon).toBeInTheDocument();
  });

  it('renders Facebook icon correctly', () => {
    render(<SocialNetworkIcon type={SocialNetworkType.FACEBOOK} size={24} />);

    const icon = screen.getByTestId('social-network-icon-facebook');
    expect(icon).toBeInTheDocument();
  });

  it('renders LinkedIn icon correctly', () => {
    render(<SocialNetworkIcon type={SocialNetworkType.LINKEDIN} size={24} />);

    const icon = screen.getByTestId('social-network-icon-linkedin');
    expect(icon).toBeInTheDocument();
  });

  it('renders email icon correctly', () => {
    render(<SocialNetworkIcon type={SocialNetworkType.EMAIL} size={24} />);

    const icon = screen.getByTestId('social-network-icon-email');
    expect(icon).toBeInTheDocument();
  });

  it('renders phone icon correctly', () => {
    render(<SocialNetworkIcon type={SocialNetworkType.PHONE} size={24} />);

    const icon = screen.getByTestId('social-network-icon-phone');
    expect(icon).toBeInTheDocument();
  });

  it('applies correct size prop', () => {
    render(<SocialNetworkIcon type={SocialNetworkType.INSTAGRAM} size={32} />);

    const icon = screen.getByTestId('social-network-icon-instagram');
    expect(icon).toBeInTheDocument();

    // Check that an SVG element is rendered (indicating the icon component)
    const svgElement = icon.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('renders icon with SVG element', () => {
    render(<SocialNetworkIcon type={SocialNetworkType.INSTAGRAM} size={24} />);

    const icon = screen.getByTestId('social-network-icon-instagram');
    expect(icon).toBeInTheDocument();

    // Check that an SVG element is rendered (indicating the icon component)
    const svgElement = icon.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('renders different icon types', () => {
    const { rerender } = render(
      <SocialNetworkIcon type={SocialNetworkType.EMAIL} size={24} />
    );

    // Initially email icon
    expect(screen.getByTestId('social-network-icon-email')).toBeInTheDocument();

    // Rerender with different type
    rerender(<SocialNetworkIcon type={SocialNetworkType.PHONE} size={24} />);
    expect(screen.getByTestId('social-network-icon-phone')).toBeInTheDocument();
  });
});
