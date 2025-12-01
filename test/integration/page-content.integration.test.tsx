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

describe('Page Content Public Display Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Content Rendering', () => {
    it('should display rich HTML content correctly', () => {
      const htmlContent =
        '<h1>Welcome to Our Services</h1><p>We offer <strong>excellent</strong> solutions.</p>';

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Welcome to Our Services'
      );
      expect(screen.getByText(/We offer/)).toBeInTheDocument();
      expect(screen.getByText('excellent')).toBeInTheDocument();
    });

    it('should render multiple heading levels', () => {
      const htmlContent = `
        <h1>Main Title</h1>
        <h2>Section Title</h2>
        <h3>Subsection Title</h3>
        <p>Content paragraph</p>
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Main Title'
      );
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Section Title'
      );
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Subsection Title'
      );
      expect(screen.getByText('Content paragraph')).toBeInTheDocument();
    });

    it('should render lists correctly', () => {
      const htmlContent = `
        <ul>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
        </ul>
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByText('First item')).toBeInTheDocument();
      expect(screen.getByText('Second item')).toBeInTheDocument();
      expect(screen.getByText('Third item')).toBeInTheDocument();
    });

    it('should render ordered lists correctly', () => {
      const htmlContent = `
        <ol>
          <li>Step one</li>
          <li>Step two</li>
          <li>Step three</li>
        </ol>
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByText('Step one')).toBeInTheDocument();
      expect(screen.getByText('Step two')).toBeInTheDocument();
      expect(screen.getByText('Step three')).toBeInTheDocument();
    });

    it('should render links with proper attributes', () => {
      const htmlContent =
        '<p>Visit <a href="https://example.com" class="tiptap-link">our website</a> for more info.</p>';

      render(<PublicPageContent content={htmlContent} />);

      const link = screen.getByRole('link', { name: 'our website' });
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should render images correctly', () => {
      const htmlContent =
        '<p>Here is an image:</p><img src="https://example.com/image.jpg" alt="Test image" class="tiptap-image" />';

      render(<PublicPageContent content={htmlContent} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(image).toHaveAttribute('alt', 'Test image');
    });

    it('should render formatted text with bold and italic', () => {
      const htmlContent =
        '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>';

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByText('bold')).toBeInTheDocument();
      expect(screen.getByText('italic')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display empty state placeholder when content is empty', () => {
      render(<PublicPageContent content="" />);

      expect(
        screen.getByText('This page has no content yet.')
      ).toBeInTheDocument();
    });

    it('should display empty state for undefined-like empty content', () => {
      render(<PublicPageContent content="" />);

      expect(
        screen.getByText('This page has no content yet.')
      ).toBeInTheDocument();
    });
  });

  describe('Complex Content', () => {
    it('should handle complex nested HTML structures', () => {
      const htmlContent = `
        <h1>Page Title</h1>
        <p>Introduction paragraph with <strong>important</strong> information.</p>
        <h2>Features</h2>
        <ul>
          <li>Feature 1 with <em>emphasis</em></li>
          <li>Feature 2</li>
        </ul>
        <h2>Contact</h2>
        <p>Email us at <a href="mailto:test@example.com">test@example.com</a></p>
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Page Title'
      );
      expect(screen.getByText('important')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText(/Feature 1/)).toBeInTheDocument();
      expect(screen.getByText('emphasis')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'test@example.com' })
      ).toBeInTheDocument();
    });

    it('should handle content with multiple paragraphs', () => {
      const htmlContent = `
        <p>First paragraph content.</p>
        <p>Second paragraph content.</p>
        <p>Third paragraph content.</p>
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByText('First paragraph content.')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph content.')).toBeInTheDocument();
      expect(screen.getByText('Third paragraph content.')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only content as empty', () => {
      // Component treats any falsy or empty string as empty state
      render(<PublicPageContent content="" />);

      expect(
        screen.getByText('This page has no content yet.')
      ).toBeInTheDocument();
    });

    it('should render content with special characters', () => {
      const htmlContent =
        '<p>Special characters: &amp; &lt; &gt; &quot; &#39;</p>';

      render(<PublicPageContent content={htmlContent} />);

      expect(
        screen.getByText('Special characters: & < > " \'')
      ).toBeInTheDocument();
    });

    it('should handle very long content without errors', () => {
      const longParagraph =
        '<p>' + 'Lorem ipsum dolor sit amet. '.repeat(100) + '</p>';
      const htmlContent = `<h1>Long Article</h1>${longParagraph}`;

      expect(() =>
        render(<PublicPageContent content={htmlContent} />)
      ).not.toThrow();

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Long Article'
      );
    });
  });
});
