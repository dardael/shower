import { screen, fireEvent } from '@testing-library/react';
import {
  ColorPicker,
  PRESET_COLORS,
} from '@/presentation/admin/components/PageContentEditor/ColorPicker';
import type { Editor } from '@tiptap/react';
import { renderWithChakra } from '../../../../setup';

const createMockEditor = (overrides: Partial<Editor> = {}): Editor => {
  const mockChain = {
    focus: jest.fn().mockReturnThis(),
    setColor: jest.fn().mockReturnThis(),
    unsetColor: jest.fn().mockReturnThis(),
    run: jest.fn(),
  };

  return {
    chain: jest.fn(() => mockChain),
    isActive: jest.fn(() => false),
    getAttributes: jest.fn(() => ({})),
    ...overrides,
  } as unknown as Editor;
};

describe('ColorPicker', () => {
  let mockEditor: Editor;

  beforeEach(() => {
    mockEditor = createMockEditor();
  });

  describe('Preset palette', () => {
    it('should render all preset colors as clickable swatches', () => {
      renderWithChakra(<ColorPicker editor={mockEditor} disabled={false} />);

      // Click the color button to open the picker
      const colorButton = screen.getByRole('button', { name: /text color/i });
      fireEvent.click(colorButton);

      // Verify preset colors are rendered
      const colorButtons = screen.getAllByRole('button', {
        name: /select color/i,
      });
      expect(colorButtons).toHaveLength(PRESET_COLORS.length);
    });

    it('should apply color to selected text via preset palette click', () => {
      renderWithChakra(<ColorPicker editor={mockEditor} disabled={false} />);

      // Click the color button to open the picker
      const colorButton = screen.getByRole('button', { name: /text color/i });
      fireEvent.click(colorButton);

      // Click the first preset color (black #000000)
      const presetButtons = screen.getAllByRole('button', {
        name: /select color/i,
      });
      fireEvent.click(presetButtons[0]);

      // Verify setColor was called with the correct color
      const mockChain = mockEditor.chain();
      expect(mockChain.focus).toHaveBeenCalled();
      expect(mockChain.setColor).toHaveBeenCalledWith('#000000');
      expect(mockChain.run).toHaveBeenCalled();
    });
  });

  describe('Custom hex color input', () => {
    it('should apply custom hex color via input field', () => {
      renderWithChakra(<ColorPicker editor={mockEditor} disabled={false} />);

      // Click the color button to open the picker
      const colorButton = screen.getByRole('button', { name: /text color/i });
      fireEvent.click(colorButton);

      // Enter a custom hex color
      const hexInput = screen.getByPlaceholderText(/hex color/i);
      fireEvent.change(hexInput, { target: { value: '#FF5500' } });
      fireEvent.keyDown(hexInput, { key: 'Enter' });

      // Verify setColor was called with the custom color
      const mockChain = mockEditor.chain();
      expect(mockChain.focus).toHaveBeenCalled();
      expect(mockChain.setColor).toHaveBeenCalledWith('#FF5500');
      expect(mockChain.run).toHaveBeenCalled();
    });

    it('should validate hex color format', () => {
      renderWithChakra(<ColorPicker editor={mockEditor} disabled={false} />);

      // Click the color button to open the picker
      const colorButton = screen.getByRole('button', { name: /text color/i });
      fireEvent.click(colorButton);

      // Enter an invalid hex color
      const hexInput = screen.getByPlaceholderText(/hex color/i);
      fireEvent.change(hexInput, { target: { value: 'invalid' } });
      fireEvent.keyDown(hexInput, { key: 'Enter' });

      // Verify setColor was NOT called
      const mockChain = mockEditor.chain();
      expect(mockChain.setColor).not.toHaveBeenCalled();
    });

    it('should accept 3-digit hex colors', () => {
      renderWithChakra(<ColorPicker editor={mockEditor} disabled={false} />);

      // Click the color button to open the picker
      const colorButton = screen.getByRole('button', { name: /text color/i });
      fireEvent.click(colorButton);

      // Enter a 3-digit hex color
      const hexInput = screen.getByPlaceholderText(/hex color/i);
      fireEvent.change(hexInput, { target: { value: '#F00' } });
      fireEvent.keyDown(hexInput, { key: 'Enter' });

      // Verify setColor was called
      const mockChain = mockEditor.chain();
      expect(mockChain.setColor).toHaveBeenCalledWith('#F00');
    });
  });

  describe('Remove color', () => {
    it('should remove color from text via unsetColor command', () => {
      renderWithChakra(<ColorPicker editor={mockEditor} disabled={false} />);

      // Click the color button to open the picker
      const colorButton = screen.getByRole('button', { name: /text color/i });
      fireEvent.click(colorButton);

      // Click the remove color button
      const removeButton = screen.getByRole('button', {
        name: /remove color/i,
      });
      fireEvent.click(removeButton);

      // Verify unsetColor was called
      const mockChain = mockEditor.chain();
      expect(mockChain.focus).toHaveBeenCalled();
      expect(mockChain.unsetColor).toHaveBeenCalled();
      expect(mockChain.run).toHaveBeenCalled();
    });
  });

  describe('Disabled state', () => {
    it('should disable the color button when disabled prop is true', () => {
      renderWithChakra(<ColorPicker editor={mockEditor} disabled={true} />);

      const colorButton = screen.getByRole('button', { name: /text color/i });
      expect(colorButton).toBeDisabled();
    });
  });
});
