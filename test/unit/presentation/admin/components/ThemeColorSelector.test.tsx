import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeColorSelector } from '@/presentation/admin/components/ThemeColorSelector';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

describe('ThemeColorSelector', () => {
  const mockOnColorChange = jest.fn();

  beforeEach(() => {
    mockOnColorChange.mockClear();
  });

  it('should render all available colors', () => {
    renderWithChakra(
      <ThemeColorSelector
        selectedColor="blue"
        onColorChange={mockOnColorChange}
      />
    );

    const colorButtons = screen.getAllByRole('button');
    expect(colorButtons).toHaveLength(8); // 8 colors in palette
  });

  it('should highlight selected color', () => {
    renderWithChakra(
      <ThemeColorSelector
        selectedColor="red"
        onColorChange={mockOnColorChange}
      />
    );

    const selectedButton = screen.getByRole('button', {
      name: /Select red theme color/i,
    });
    expect(selectedButton).toHaveAttribute('data-selected', 'true');
  });

  it('should call onColorChange when color is clicked', () => {
    renderWithChakra(
      <ThemeColorSelector
        selectedColor="blue"
        onColorChange={mockOnColorChange}
      />
    );

    const allButtons = screen.getAllByRole('button');
    const firstButton = allButtons[0];

    expect(firstButton).toBeInTheDocument();
    expect(firstButton).not.toBeDisabled();

    // Try direct DOM click
    firstButton.click();

    expect(mockOnColorChange).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when disabled prop is true', () => {
    renderWithChakra(
      <ThemeColorSelector
        selectedColor="blue"
        onColorChange={mockOnColorChange}
        disabled={true}
      />
    );

    const colorButtons = screen.getAllByRole('button');
    colorButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should display theme color label', () => {
    renderWithChakra(
      <ThemeColorSelector
        selectedColor="blue"
        onColorChange={mockOnColorChange}
      />
    );

    expect(screen.getByText('Theme Color')).toBeInTheDocument();
  });

  it('should display helper text', () => {
    renderWithChakra(
      <ThemeColorSelector
        selectedColor="blue"
        onColorChange={mockOnColorChange}
      />
    );

    expect(
      screen.getByText('Select a color to customize your website theme')
    ).toBeInTheDocument();
  });
});
