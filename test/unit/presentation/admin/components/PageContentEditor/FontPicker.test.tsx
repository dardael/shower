import { screen, fireEvent } from '@testing-library/react';
import { FontPicker } from '@/presentation/admin/components/PageContentEditor/FontPicker';
import type { Editor } from '@tiptap/react';
import { renderWithChakra } from '../../../../setup';

const createMockEditor = (overrides: Partial<Editor> = {}): Editor => {
  const mockChain = {
    focus: jest.fn().mockReturnThis(),
    setFontFamily: jest.fn().mockReturnThis(),
    unsetFontFamily: jest.fn().mockReturnThis(),
    run: jest.fn(),
  };

  return {
    chain: jest.fn(() => mockChain),
    isActive: jest.fn(() => false),
    getAttributes: jest.fn(() => ({})),
    ...overrides,
  } as unknown as Editor;
};

describe('FontPicker', () => {
  let mockEditor: Editor;

  beforeEach(() => {
    mockEditor = createMockEditor();
  });

  describe('Basic rendering', () => {
    it('should render font picker button', () => {
      renderWithChakra(<FontPicker editor={mockEditor} disabled={false} />);

      const fontButton = screen.getByRole('button', { name: /font/i });
      expect(fontButton).toBeInTheDocument();
    });

    it('should open font dropdown when button is clicked', () => {
      renderWithChakra(<FontPicker editor={mockEditor} disabled={false} />);

      const fontButton = screen.getByRole('button', { name: /font/i });
      fireEvent.click(fontButton);

      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
  });

  describe('Font selection', () => {
    it('should apply selected font to text via setFontFamily command', () => {
      renderWithChakra(<FontPicker editor={mockEditor} disabled={false} />);

      const fontButton = screen.getByRole('button', { name: /font/i });
      fireEvent.click(fontButton);

      const interOption = screen.getByRole('button', { name: /inter/i });
      fireEvent.click(interOption);

      const mockChain = mockEditor.chain();
      expect(mockChain.focus).toHaveBeenCalled();
      expect(mockChain.setFontFamily).toHaveBeenCalledWith('Inter');
      expect(mockChain.run).toHaveBeenCalled();
    });

    it('should display all available fonts in dropdown', () => {
      renderWithChakra(<FontPicker editor={mockEditor} disabled={false} />);

      const fontButton = screen.getByRole('button', { name: /^font$/i });
      fireEvent.click(fontButton);

      expect(
        screen.getByRole('button', { name: /^inter$/i })
      ).toBeInTheDocument();
      expect(
        screen.getAllByRole('button', { name: /^roboto$/i }).length
      ).toBeGreaterThan(0);
      expect(
        screen.getByRole('button', { name: /^playfair display$/i })
      ).toBeInTheDocument();
    });
  });

  describe('Remove font formatting', () => {
    it('should remove font via unsetFontFamily command when Default is clicked', () => {
      renderWithChakra(<FontPicker editor={mockEditor} disabled={false} />);

      const fontButton = screen.getByRole('button', { name: /font/i });
      fireEvent.click(fontButton);

      const defaultOption = screen.getByRole('button', { name: /default/i });
      fireEvent.click(defaultOption);

      const mockChain = mockEditor.chain();
      expect(mockChain.focus).toHaveBeenCalled();
      expect(mockChain.unsetFontFamily).toHaveBeenCalled();
      expect(mockChain.run).toHaveBeenCalled();
    });
  });

  describe('Disabled state', () => {
    it('should disable the font button when disabled prop is true', () => {
      renderWithChakra(<FontPicker editor={mockEditor} disabled={true} />);

      const fontButton = screen.getByRole('button', { name: /font/i });
      expect(fontButton).toBeDisabled();
    });
  });
});
