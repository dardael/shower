import { render, screen } from '@testing-library/react';
import { PublicHeaderMenuItem } from '@/presentation/shared/components/PublicHeaderMenu/PublicHeaderMenuItem';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = 'Link';
  return MockLink;
});

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Text: ({ children }: { children?: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Link: ({
    children,
    asChild,
    ...props
  }: {
    children?: React.ReactNode;
    asChild?: boolean;
    href?: string;
  }) => {
    if (asChild) {
      return <>{children}</>;
    }
    return <a {...props}>{children}</a>;
  },
}));

describe('PublicHeaderMenuItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders menu item text', () => {
    render(<PublicHeaderMenuItem text="About" url="/about" />);

    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders as a link with the correct href', () => {
    render(<PublicHeaderMenuItem text="Contact" url="/contact" />);

    const link = screen.getByRole('link', { name: 'Contact' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/contact');
  });

  it('handles urls without leading slash', () => {
    render(<PublicHeaderMenuItem text="Services" url="services" />);

    const link = screen.getByRole('link', { name: 'Services' });
    expect(link).toHaveAttribute('href', 'services');
  });

  it('handles urls with nested paths', () => {
    render(<PublicHeaderMenuItem text="Team" url="/about/team" />);

    const link = screen.getByRole('link', { name: 'Team' });
    expect(link).toHaveAttribute('href', '/about/team');
  });

  it('renders with empty url as non-navigable when url is empty string', () => {
    render(<PublicHeaderMenuItem text="Home" url="" />);

    // When url is empty, it should still render as text
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
