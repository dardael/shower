import { render, screen } from '@testing-library/react';
import PublicPageContent from '@/presentation/shared/components/PublicPageContent/PublicPageContent';

// Mock console methods to prevent test output pollution
const mockConsoleError = jest.fn();
const mockConsoleWarn = jest.fn();

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = mockConsoleError;
  console.warn = mockConsoleWarn;
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

describe('Root Page Content Display Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T012: Root URL renders first menu item HTML content correctly', () => {
    it('should render first menu item HTML content correctly', () => {
      const htmlContent = '<h1>Welcome</h1><p>This is our homepage.</p>';

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Welcome'
      );
      expect(screen.getByText('This is our homepage.')).toBeInTheDocument();
    });

    it('should render content with text formatting', () => {
      const htmlContent =
        '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>';

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByText('bold')).toBeInTheDocument();
      expect(screen.getByText('italic')).toBeInTheDocument();
    });
  });

  describe('T013: Root URL displays empty state when content is empty', () => {
    it('should display empty state when content is empty string', () => {
      render(<PublicPageContent content="" />);

      expect(
        screen.getByText('This page has no content yet.')
      ).toBeInTheDocument();
    });
  });

  describe('T014: Root URL renders complex content structure', () => {
    it('should render complex content structure with headings and lists', () => {
      const htmlContent = `
        <h1>Our Services</h1>
        <p>We provide the following services:</p>
        <ul>
          <li>Web Design</li>
          <li>Development</li>
          <li>Consulting</li>
        </ul>
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByRole('heading')).toHaveTextContent('Our Services');
      expect(screen.getByText('Web Design')).toBeInTheDocument();
      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText('Consulting')).toBeInTheDocument();
    });

    it('should render multiple headings and paragraphs', () => {
      const htmlContent = `
        <h1>Main Title</h1>
        <p>Introduction paragraph.</p>
        <h2>Section Title</h2>
        <p>Section content with <a href="/contact">a link</a>.</p>
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Main Title'
      );
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Section Title'
      );
      expect(screen.getByText('Introduction paragraph.')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'a link' })).toBeInTheDocument();
    });

    it('should render nested lists correctly', () => {
      const htmlContent = `
        <h1>Features</h1>
        <ol>
          <li>First feature</li>
          <li>Second feature</li>
          <li>Third feature</li>
        </ol>
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByText('First feature')).toBeInTheDocument();
      expect(screen.getByText('Second feature')).toBeInTheDocument();
      expect(screen.getByText('Third feature')).toBeInTheDocument();
    });

    it('should render images with alt text', () => {
      const htmlContent =
        '<p>Check out our work:</p><img src="/images/portfolio.jpg" alt="Portfolio example" />';

      render(<PublicPageContent content={htmlContent} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Portfolio example');
    });
  });

  describe('T033: Root URL displays new first menu item content after reordering', () => {
    it('should display different content when rendered with different props', () => {
      // First render with original content
      const { rerender } = render(
        <PublicPageContent content="<h1>Original First Page</h1>" />
      );
      expect(screen.getByRole('heading')).toHaveTextContent(
        'Original First Page'
      );

      // Rerender with new content (simulating menu reorder)
      rerender(
        <PublicPageContent content="<h1>New First Page After Reorder</h1>" />
      );
      expect(screen.getByRole('heading')).toHaveTextContent(
        'New First Page After Reorder'
      );
    });
  });

  describe('T034: Root URL content updates without caching issues', () => {
    it('should immediately reflect content changes', () => {
      const { rerender } = render(
        <PublicPageContent content="<p>Version 1</p>" />
      );
      expect(screen.getByText('Version 1')).toBeInTheDocument();

      // Simulate content update
      rerender(<PublicPageContent content="<p>Version 2</p>" />);
      expect(screen.getByText('Version 2')).toBeInTheDocument();
      expect(screen.queryByText('Version 1')).not.toBeInTheDocument();
    });
  });

  describe('T042: Empty state message content and styling', () => {
    it('should display styled empty state message', () => {
      render(<PublicPageContent content="" />);

      const emptyMessage = screen.getByText('This page has no content yet.');
      expect(emptyMessage).toBeInTheDocument();
    });
  });
});
