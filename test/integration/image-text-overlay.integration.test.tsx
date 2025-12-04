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

describe('Image Text Overlay Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Overlay Rendering', () => {
    it('should render image with text overlay', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Welcome to Our Site" data-overlay-color="#ffffff" data-overlay-font="Roboto" data-overlay-size="large" data-overlay-position="center" data-overlay-align="center">
          <img src="/api/page-content-images/hero.jpg" class="tiptap-image" alt="Hero image" />
          <div class="text-overlay text-overlay-center text-overlay-align-center" style="color: #ffffff; font-family: 'Roboto', sans-serif; font-size: 24px; background: rgba(0, 0, 0, 0.6);">Welcome to Our Site</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByText('Welcome to Our Site')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        '/api/page-content-images/hero.jpg'
      );
    });

    it('should preserve overlay text color in style', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Red Text" data-overlay-color="#ff0000">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="color: #ff0000;">Red Text</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Red Text');
      expect(overlayDiv).toHaveStyle('color: #ff0000');
    });

    it('should preserve overlay font family in style', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-font="Pacifico">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="font-family: 'Pacifico', sans-serif;">Styled Text</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Styled Text');
      expect(overlayDiv).toHaveStyle("font-family: 'Pacifico', sans-serif");
    });

    it('should preserve overlay font size in style', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-size="large">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="font-size: 24px;">Large Text</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Large Text');
      expect(overlayDiv).toHaveStyle('font-size: 24px');
    });
  });

  describe('Overlay Positioning', () => {
    it('should have text-overlay-top class for top position', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-position="top">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay text-overlay-top">Top Overlay</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Top Overlay');
      expect(overlayDiv).toHaveClass('text-overlay-top');
    });

    it('should have text-overlay-center class for center position', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-position="center">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay text-overlay-center">Center Overlay</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Center Overlay');
      expect(overlayDiv).toHaveClass('text-overlay-center');
    });

    it('should have text-overlay-bottom class for bottom position', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-position="bottom">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay text-overlay-bottom">Bottom Overlay</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Bottom Overlay');
      expect(overlayDiv).toHaveClass('text-overlay-bottom');
    });
  });

  describe('Overlay Alignment', () => {
    it('should have text-overlay-align-left class for left alignment', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-align="left">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay text-overlay-align-left">Left Aligned</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Left Aligned');
      expect(overlayDiv).toHaveClass('text-overlay-align-left');
    });

    it('should have text-overlay-align-center class for center alignment', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-align="center">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay text-overlay-align-center">Center Aligned</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Center Aligned');
      expect(overlayDiv).toHaveClass('text-overlay-align-center');
    });

    it('should have text-overlay-align-right class for right alignment', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-align="right">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay text-overlay-align-right">Right Aligned</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Right Aligned');
      expect(overlayDiv).toHaveClass('text-overlay-align-right');
    });
  });

  describe('Overlay Container Structure', () => {
    it('should have image-with-overlay wrapper class', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Test">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay">Test</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const wrapper = screen.getByText('Test').closest('.image-with-overlay');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('image-with-overlay');
    });

    // Note: DOMPurify in jsdom test environment doesn't preserve data attributes
    // even with ALLOW_DATA_ATTR: true (isSupported returns false).
    // In real browsers, data attributes ARE preserved. This test verifies
    // the wrapper structure is correct even without data attributes.
    it('should have correct wrapper structure', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Hello" data-overlay-color="#ff0000" data-overlay-font="Inter" data-overlay-size="medium" data-overlay-position="center" data-overlay-align="center">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay">Hello</div>
        </div>
      `;

      const { container } = render(<PublicPageContent content={htmlContent} />);

      const wrapper = screen.getByText('Hello').closest('.image-with-overlay');
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

  describe('Background Contrast', () => {
    it('should have dark background for light text', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-color="#ffffff">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="background: rgba(0, 0, 0, 0.6);">Light Text</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Light Text');
      expect(overlayDiv).toHaveStyle('background: rgba(0, 0, 0, 0.6)');
    });

    it('should have light background for dark text', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-color="#000000">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="background: rgba(255, 255, 255, 0.6);">Dark Text</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Dark Text');
      expect(overlayDiv).toHaveStyle('background: rgba(255, 255, 255, 0.6)');
    });
  });

  describe('Multiple Images with Overlays', () => {
    it('should render multiple images with different overlay configurations', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="First">
          <img src="/first.jpg" class="tiptap-image" alt="First image" />
          <div class="text-overlay text-overlay-top text-overlay-align-left">First</div>
        </div>
        <div class="image-with-overlay" data-overlay-text="Second">
          <img src="/second.jpg" class="tiptap-image" alt="Second image" />
          <div class="text-overlay text-overlay-bottom text-overlay-align-right">Second</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getAllByRole('img')).toHaveLength(2);
    });
  });

  describe('Content Without Overlay', () => {
    it('should render regular images without overlay wrapper', () => {
      const htmlContent = `
        <p>Regular content</p>
        <img src="/regular.jpg" class="tiptap-image" alt="Regular image" />
      `;

      render(<PublicPageContent content={htmlContent} />);

      expect(screen.getByText('Regular content')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('Font Size Mapping', () => {
    it('should render small font size (14px)', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-size="small">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="font-size: 14px;">Small Text</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Small Text');
      expect(overlayDiv).toHaveStyle('font-size: 14px');
    });

    it('should render medium font size (18px)', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-size="medium">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="font-size: 18px;">Medium Text</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Medium Text');
      expect(overlayDiv).toHaveStyle('font-size: 18px');
    });

    it('should render large font size (24px)', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-size="large">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="font-size: 24px;">Large Text</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Large Text');
      expect(overlayDiv).toHaveStyle('font-size: 24px');
    });

    it('should render extra-large font size (32px)', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-size="extra-large">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="font-size: 32px;">Extra Large Text</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Extra Large Text');
      expect(overlayDiv).toHaveStyle('font-size: 32px');
    });
  });
});
