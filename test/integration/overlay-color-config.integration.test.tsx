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

describe('Overlay Color Configuration Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Custom Overlay Background Color', () => {
    it('should render overlay with custom background color', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Welcome" data-overlay-color="#ffffff" data-overlay-bg-color="#ff0000" data-overlay-bg-opacity="50">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="color: #ffffff; background: rgba(255, 0, 0, 0.5);">Welcome</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Welcome');
      expect(overlayDiv).toHaveStyle('background: rgba(255, 0, 0, 0.5)');
    });

    it('should render overlay with blue background color', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Hello" data-overlay-bg-color="#0000ff" data-overlay-bg-opacity="75">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="background: rgba(0, 0, 255, 0.75);">Hello</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Hello');
      expect(overlayDiv).toHaveStyle('background: rgba(0, 0, 255, 0.75)');
    });

    it('should render overlay with green background color', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Green" data-overlay-bg-color="#00ff00" data-overlay-bg-opacity="60">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="background: rgba(0, 255, 0, 0.6);">Green</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Green');
      expect(overlayDiv).toHaveStyle('background: rgba(0, 255, 0, 0.6)');
    });
  });

  describe('Custom Overlay Opacity', () => {
    it('should render overlay with 50% opacity', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Half Opacity" data-overlay-bg-color="#000000" data-overlay-bg-opacity="50">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="background: rgba(0, 0, 0, 0.5);">Half Opacity</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Half Opacity');
      expect(overlayDiv).toHaveStyle('background: rgba(0, 0, 0, 0.5)');
    });

    it('should render overlay with 25% opacity', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Light Overlay" data-overlay-bg-color="#000000" data-overlay-bg-opacity="25">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="background: rgba(0, 0, 0, 0.25);">Light Overlay</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Light Overlay');
      expect(overlayDiv).toHaveStyle('background: rgba(0, 0, 0, 0.25)');
    });
  });

  describe('Default Values', () => {
    it('should apply default background with black color and 50% opacity', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Default Style">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="background: rgba(0, 0, 0, 0.5);">Default Style</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Default Style');
      expect(overlayDiv).toHaveStyle('background: rgba(0, 0, 0, 0.5)');
    });
  });

  describe('Multiple Images with Different Configurations', () => {
    it('should render multiple images with different overlay configurations', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Red Overlay" data-overlay-bg-color="#ff0000" data-overlay-bg-opacity="50">
          <img src="/first.jpg" class="tiptap-image" alt="First image" />
          <div class="text-overlay" style="background: rgba(255, 0, 0, 0.5);">Red Overlay</div>
        </div>
        <div class="image-with-overlay" data-overlay-text="Blue Overlay" data-overlay-bg-color="#0000ff" data-overlay-bg-opacity="75">
          <img src="/second.jpg" class="tiptap-image" alt="Second image" />
          <div class="text-overlay" style="background: rgba(0, 0, 255, 0.75);">Blue Overlay</div>
        </div>
        <div class="image-with-overlay" data-overlay-text="Green Overlay" data-overlay-bg-color="#00ff00" data-overlay-bg-opacity="25">
          <img src="/third.jpg" class="tiptap-image" alt="Third image" />
          <div class="text-overlay" style="background: rgba(0, 255, 0, 0.25);">Green Overlay</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const redOverlay = screen.getByText('Red Overlay');
      const blueOverlay = screen.getByText('Blue Overlay');
      const greenOverlay = screen.getByText('Green Overlay');

      expect(redOverlay).toHaveStyle('background: rgba(255, 0, 0, 0.5)');
      expect(blueOverlay).toHaveStyle('background: rgba(0, 0, 255, 0.75)');
      expect(greenOverlay).toHaveStyle('background: rgba(0, 255, 0, 0.25)');
      expect(screen.getAllByRole('img')).toHaveLength(3);
    });
  });

  describe('Edge Cases', () => {
    it('should render overlay with 0% opacity (transparent background)', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Transparent" data-overlay-bg-color="#000000" data-overlay-bg-opacity="0">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="background: rgba(0, 0, 0, 0);">Transparent</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Transparent');
      expect(overlayDiv).toHaveStyle('background: rgba(0, 0, 0, 0)');
      expect(overlayDiv).toBeInTheDocument();
    });

    it('should render overlay with 100% opacity (opaque background)', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Opaque" data-overlay-bg-color="#000000" data-overlay-bg-opacity="100">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="background: rgba(0, 0, 0, 1);">Opaque</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Opaque');
      expect(overlayDiv).toHaveStyle('background: rgba(0, 0, 0, 1)');
    });

    it('should render overlay with white background and high opacity', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="White BG" data-overlay-bg-color="#ffffff" data-overlay-bg-opacity="80">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="color: #000000; background: rgba(255, 255, 255, 0.8);">White BG</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('White BG');
      expect(overlayDiv).toHaveStyle('background: rgba(255, 255, 255, 0.8)');
    });
  });

  describe('Combined Styling', () => {
    it('should render overlay with all style properties including custom background', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Full Style" data-overlay-color="#ff0000" data-overlay-font="Roboto" data-overlay-size="large" data-overlay-position="center" data-overlay-align="center" data-overlay-bg-color="#0000ff" data-overlay-bg-opacity="70">
          <img src="/test.jpg" class="tiptap-image" alt="Styled image" />
          <div class="text-overlay text-overlay-center text-overlay-align-center" style="color: #ff0000; font-family: 'Roboto', sans-serif; font-size: 24px; background: rgba(0, 0, 255, 0.7);">Full Style</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContent} />);

      const overlayDiv = screen.getByText('Full Style');
      expect(overlayDiv).toHaveStyle('color: #ff0000');
      expect(overlayDiv).toHaveStyle("font-family: 'Roboto', sans-serif");
      expect(overlayDiv).toHaveStyle('font-size: 24px');
      expect(overlayDiv).toHaveStyle('background: rgba(0, 0, 255, 0.7)');
      expect(overlayDiv).toHaveClass('text-overlay-center');
      expect(overlayDiv).toHaveClass('text-overlay-align-center');
    });
  });

  describe('Container Structure', () => {
    it('should have correct wrapper structure with background color data attributes', () => {
      const htmlContent = `
        <div class="image-with-overlay" data-overlay-text="Structure Test" data-overlay-bg-color="#123456" data-overlay-bg-opacity="65">
          <img src="/test.jpg" class="tiptap-image" />
          <div class="text-overlay" style="background: rgba(18, 52, 86, 0.65);">Structure Test</div>
        </div>
      `;

      const { container } = render(<PublicPageContent content={htmlContent} />);

      const wrapper = screen
        .getByText('Structure Test')
        .closest('.image-with-overlay');
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
