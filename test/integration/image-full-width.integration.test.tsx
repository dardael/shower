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

/**
 * Note: DOMPurify in jsdom test environment doesn't preserve data attributes
 * even with ALLOW_DATA_ATTR: true (isSupported returns false).
 * In real browsers, data attributes ARE preserved.
 *
 * These tests verify the HTML structure and inline styles are preserved,
 * which is how full-width functionality is rendered.
 */
describe('Image Full Width Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Full-Width Plain Images (US1)', () => {
    it('should render plain image with full-width inline style', () => {
      // Full-width images use inline style width: 100%
      const htmlContent = `
        <img src="/api/page-content-images/hero.jpg" class="tiptap-image" style="width: 100%;" alt="Hero image" />
      `;

      render(<PublicPageContent content={htmlContent} />);

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/api/page-content-images/hero.jpg');
      expect(img).toHaveStyle('width: 100%');
    });

    it('should render plain image without full-width when style is not set', () => {
      const htmlContent = `
        <img src="/api/page-content-images/regular.jpg" class="tiptap-image" alt="Regular image" />
      `;

      render(<PublicPageContent content={htmlContent} />);

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).not.toHaveStyle('width: 100%');
    });

    it('should render image with fixed width', () => {
      const htmlContent = `
        <img src="/api/page-content-images/sized.jpg" class="tiptap-image" style="width: 400px;" alt="Sized image" />
      `;

      render(<PublicPageContent content={htmlContent} />);

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveStyle('width: 400px');
    });
  });

  describe('Full-Width Images with Overlay (US1)', () => {
    it('should render image with overlay and full-width wrapper style', () => {
      const htmlContent = `
        <div class="image-with-overlay" style="position: relative; display: block; width: 100%;">
          <img src="/api/page-content-images/hero.jpg" class="tiptap-image" style="width: 100%;" />
          <div class="text-overlay text-overlay-center text-overlay-align-center" style="color: #ffffff; font-family: 'Roboto', sans-serif; font-size: 24px; background: rgba(0, 0, 0, 0.6);">Welcome</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByText('Welcome')).toBeInTheDocument();
      const wrapper = screen
        .getByText('Welcome')
        .closest('.image-with-overlay');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle('width: 100%');
    });

    it('should render image with overlay without full-width (fit-content)', () => {
      const htmlContent = `
        <div class="image-with-overlay" style="position: relative; display: block; width: fit-content;">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay">Hello</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const wrapper = screen.getByText('Hello').closest('.image-with-overlay');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle('width: fit-content');
    });

    it('should preserve overlay styling when full-width is enabled', () => {
      const htmlContent = `
        <div class="image-with-overlay" style="position: relative; display: block; width: 100%;">
          <img src="/test.jpg" class="tiptap-image" style="width: 100%;" />
          <div class="text-overlay text-overlay-bottom text-overlay-align-right" style="color: #ff0000; font-family: 'Pacifico', sans-serif; font-size: 24px;">Styled Overlay</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Styled Overlay');
      expect(overlayDiv).toHaveClass('text-overlay-bottom');
      expect(overlayDiv).toHaveClass('text-overlay-align-right');
      expect(overlayDiv).toHaveStyle('color: #ff0000');
    });
  });

  describe('Toggle Full Width Off (US2)', () => {
    it('should render image with fixed width after toggle off', () => {
      // Simulates the HTML output after toggling full-width off
      const htmlContent = `
        <img src="/api/page-content-images/hero.jpg" class="tiptap-image" alt="Hero image" style="width: 400px;" />
      `;

      render(<PublicPageContent content={htmlContent} />);

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveStyle('width: 400px');
    });

    it('should render image with overlay with fit-content after toggle off', () => {
      const htmlContent = `
        <div class="image-with-overlay" style="position: relative; display: block; width: fit-content;">
          <img src="/test.jpg" class="tiptap-image" style="width: 300px;" />
          <div class="text-overlay">Normal Width</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const wrapper = screen
        .getByText('Normal Width')
        .closest('.image-with-overlay');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle('width: fit-content');
    });
  });

  describe('Full-Width with Alignment', () => {
    it('should render full-width image with 100% width style', () => {
      // When full-width is enabled, the wrapper uses width: 100%
      const htmlContent = `
        <div class="image-with-overlay" style="position: relative; display: block; width: 100%;">
          <img src="/test.jpg" class="tiptap-image" style="width: 100%;" />
          <div class="text-overlay">Centered but Full Width</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const wrapper = screen
        .getByText('Centered but Full Width')
        .closest('.image-with-overlay');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle('width: 100%');
    });
  });

  describe('Container Structure', () => {
    it('should have correct wrapper structure for full-width image with overlay', () => {
      const htmlContent = `
        <div class="image-with-overlay" style="position: relative; display: block; width: 100%;">
          <img src="/test.jpg" class="tiptap-image" style="width: 100%;" />
          <div class="text-overlay">Test</div>
        </div>
      `;

      const { container } = render(<PublicPageContent content={htmlContent} />);

      const wrapper = screen.getByText('Test').closest('.image-with-overlay');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('image-with-overlay');
      expect(
        container.querySelector('.image-with-overlay img')
      ).toBeInTheDocument();
      expect(
        container.querySelector('.image-with-overlay .text-overlay')
      ).toBeInTheDocument();
    });
  });
});
