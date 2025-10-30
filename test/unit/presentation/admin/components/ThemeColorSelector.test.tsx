import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeColorSelector } from '@/presentation/admin/components/ThemeColorSelector';

describe('ThemeColorSelector', () => {
  const mockOnColorChange = jest.fn();

  beforeEach(() => {
    mockOnColorChange.mockClear();
  });

  it('should render all available colors', () => {
    render(
      <ThemeColorSelector
        selectedColor="blue"
        onColorChange={mockOnColorChange}
      />
    );

    const colorButtons = screen.getAllByRole('button');
    expect(colorButtons).toHaveLength(8); // 8 colors in palette
  });

  it('should highlight selected color', () => {
    render(
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
    render(
      <ThemeColorSelector
        selectedColor="blue"
        onColorChange={mockOnColorChange}
      />
    );

    const greenButton = screen.getByRole('button', {
      name: /Select green theme color/i,
    });
    fireEvent.click(greenButton);

    expect(mockOnColorChange).toHaveBeenCalledWith('green');
  });

  it('should disable buttons when disabled prop is true', () => {
    render(
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
    render(
      <ThemeColorSelector
        selectedColor="blue"
        onColorChange={mockOnColorChange}
      />
    );

    expect(screen.getByText('Theme Color')).toBeInTheDocument();
  });

  it('should display helper text', () => {
    render(
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
