/**
 * @jest-environment jsdom
 */
import { screen } from '@testing-library/react';
import PublicPageContent from '@/presentation/shared/components/PublicPageContent/PublicPageContent';
import { renderWithChakra } from '../../../../setup';

describe('PublicPageContent', () => {
  describe('Colored text rendering', () => {
    it('should render colored text with correct inline style', () => {
      const content =
        '<p>Normal text <span style="color: #3B82F6">blue text</span></p>';

      renderWithChakra(<PublicPageContent content={content} />);

      const blueText = screen.getByText('blue text');
      expect(blueText).toBeInTheDocument();
      expect(blueText).toHaveStyle({ color: 'rgb(59, 130, 246)' }); // #3B82F6 in RGB
    });

    it('should render multiple colored text spans', () => {
      const content =
        '<p><span style="color: #EF4444">red</span> and <span style="color: #22C55E">green</span></p>';

      renderWithChakra(<PublicPageContent content={content} />);

      const redText = screen.getByText('red');
      const greenText = screen.getByText('green');

      expect(redText).toHaveStyle({ color: 'rgb(239, 68, 68)' }); // #EF4444
      expect(greenText).toHaveStyle({ color: 'rgb(34, 197, 94)' }); // #22C55E
    });
  });

  describe('Plain text rendering', () => {
    it('should render plain text without color style', () => {
      const content = '<p>This is plain text without any color</p>';

      renderWithChakra(<PublicPageContent content={content} />);

      const plainText = screen.getByText(
        'This is plain text without any color'
      );
      expect(plainText).toBeInTheDocument();
      // Plain text should not have inline color style
      expect(plainText.getAttribute('style')).toBeNull();
    });

    it('should render empty content message when no content', () => {
      renderWithChakra(<PublicPageContent content="" />);

      expect(
        screen.getByText('This page has no content yet.')
      ).toBeInTheDocument();
    });
  });

  describe('Security - XSS sanitization', () => {
    it('should allow legitimate color styles in style attribute', () => {
      // Tiptap color extension outputs safe color styles
      const content = '<p><span style="color: #3B82F6">styled text</span></p>';

      renderWithChakra(<PublicPageContent content={content} />);

      const text = screen.getByText('styled text');
      expect(text).toBeInTheDocument();
      expect(text).toHaveStyle({ color: 'rgb(59, 130, 246)' });
    });

    it('should sanitize script tags in content', () => {
      const maliciousContent = '<p>Safe text</p><script>alert("xss")</script>';

      renderWithChakra(<PublicPageContent content={maliciousContent} />);

      expect(screen.getByText('Safe text')).toBeInTheDocument();
      // Script should not be in the document
      expect(document.querySelector('script')).toBeNull();
    });

    it('should sanitize onclick handlers', () => {
      const maliciousContent = '<p onclick="alert(1)">Click me</p>';

      renderWithChakra(<PublicPageContent content={maliciousContent} />);

      const paragraph = screen.getByText('Click me');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph.getAttribute('onclick')).toBeNull();
    });
  });

  describe('Legacy theme-color-text support', () => {
    it('should render legacy theme-color-text class', () => {
      const legacyContent =
        '<p><span class="theme-color-text">themed text</span></p>';

      renderWithChakra(<PublicPageContent content={legacyContent} />);

      const themedText = screen.getByText('themed text');
      expect(themedText).toBeInTheDocument();
      expect(themedText).toHaveClass('theme-color-text');
    });

    it('should render legacy data-theme-color attribute', () => {
      const legacyContent =
        '<p><span data-theme-color="true">themed text</span></p>';

      renderWithChakra(<PublicPageContent content={legacyContent} />);

      const themedText = screen.getByText('themed text');
      expect(themedText).toBeInTheDocument();
    });
  });
});
