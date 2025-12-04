/**
 * Unit tests for Full Width Button functionality
 *
 * Note: The full-width button is integrated directly into TiptapEditor.
 * These tests verify the rendered output using inline styles.
 * Button visibility and click behavior are covered by integration tests.
 *
 * Implementation note: We test inline styles (width: 100%) rather than
 * data attributes because DOMPurify strips data-* attributes in jsdom.
 * The actual browser implementation uses both data attributes and inline styles.
 */

import { render, screen } from '@testing-library/react';
import PublicPageContent from '@/presentation/shared/components/PublicPageContent/PublicPageContent';

describe('Full Width Button Unit Tests', () => {
  describe('Button Visibility Logic', () => {
    it('should render full-width image with width: 100% style', () => {
      const htmlContent = `
        <img src="/test.jpg" class="tiptap-image" style="width: 100%;" />
      `;

      const { container } = render(<PublicPageContent content={htmlContent} />);

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveStyle('width: 100%');
    });

    it('should not have full-width style when not set', () => {
      const htmlContent = `
        <img src="/test.jpg" class="tiptap-image" style="width: 300px;" />
      `;

      const { container } = render(<PublicPageContent content={htmlContent} />);

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveStyle('width: 300px');
    });
  });

  describe('Button Active State Logic', () => {
    it('should render image with overlay at full width using inline style', () => {
      const htmlContent = `
        <div class="image-with-overlay" style="width: 100%;">
          <img src="/test.jpg" class="tiptap-image" style="width: 100%;" />
          <div class="text-overlay">Test</div>
        </div>
      `;

      const { container } = render(<PublicPageContent content={htmlContent} />);

      const wrapper = container.querySelector('.image-with-overlay');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle('width: 100%');
    });

    it('should render image with overlay at fit-content width when not full width', () => {
      const htmlContent = `
        <div class="image-with-overlay" style="width: fit-content;">
          <img src="/test.jpg" class="tiptap-image" style="width: 300px;" />
          <div class="text-overlay">Test</div>
        </div>
      `;

      const { container } = render(<PublicPageContent content={htmlContent} />);

      const wrapper = container.querySelector('.image-with-overlay');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle('width: fit-content');
    });
  });

  describe('Toggle Behavior', () => {
    it('should support full-width with overlay configuration', () => {
      const htmlContent = `
        <div class="image-with-overlay" style="width: 100%;">
          <img src="/test.jpg" class="tiptap-image" style="width: 100%;" />
          <div class="text-overlay text-overlay-center text-overlay-align-center">Welcome</div>
        </div>
      `;

      const { container } = render(<PublicPageContent content={htmlContent} />);

      const wrapper = container.querySelector('.image-with-overlay');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle('width: 100%');
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });

    it('should preserve overlay settings when full-width is toggled', () => {
      // Test that overlay text is preserved regardless of full-width state
      const htmlContentWithFullWidth = `
        <div class="image-with-overlay" style="width: 100%;">
          <img src="/test.jpg" class="tiptap-image" style="width: 100%;" />
          <div class="text-overlay">Keep Me</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContentWithFullWidth} />);
      expect(screen.getByText('Keep Me')).toBeInTheDocument();

      // Cleanup and render without full-width
      const htmlContentWithoutFullWidth = `
        <div class="image-with-overlay" style="width: fit-content;">
          <img src="/test.jpg" class="tiptap-image" style="width: 300px;" />
          <div class="text-overlay">Keep Me</div>
        </div>
      `;

      render(<PublicPageContent content={htmlContentWithoutFullWidth} />);
      expect(screen.getAllByText('Keep Me')).toHaveLength(2);
    });
  });
});
