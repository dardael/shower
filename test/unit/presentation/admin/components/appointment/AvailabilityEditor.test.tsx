/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AvailabilityEditor } from '@/presentation/admin/components/appointment/AvailabilityEditor';

jest.mock('@/presentation/shared/contexts/ThemeColorContext', () => ({
  useThemeColorContext: () => ({
    themeColor: 'blue',
    updateThemeColor: jest.fn(),
    refreshThemeColor: jest.fn(),
    isLoading: false,
    setThemeColor: jest.fn(),
  }),
}));

const renderWithChakra = (
  ui: React.ReactElement
): ReturnType<typeof render> => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

describe('AvailabilityEditor', () => {
  const mockOnSlotsChange = jest.fn();
  const mockOnExceptionsChange = jest.fn();

  const defaultProps = {
    weeklySlots: [],
    exceptions: [],
    onSlotsChange: mockOnSlotsChange,
    onExceptionsChange: mockOnExceptionsChange,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render weekly slots section', () => {
      renderWithChakra(<AvailabilityEditor {...defaultProps} />);

      expect(screen.getByText('Créneaux hebdomadaires')).toBeInTheDocument();
      expect(screen.getByText('Ajouter un créneau')).toBeInTheDocument();
    });

    it('should render exceptions section', () => {
      renderWithChakra(<AvailabilityEditor {...defaultProps} />);

      expect(screen.getByText('Exceptions (jours fermés)')).toBeInTheDocument();
      expect(screen.getByText('Ajouter une exception')).toBeInTheDocument();
    });

    it('should show empty message when no slots', () => {
      renderWithChakra(<AvailabilityEditor {...defaultProps} />);

      expect(screen.getByText('Aucun créneau défini')).toBeInTheDocument();
    });

    it('should show empty message when no exceptions', () => {
      renderWithChakra(<AvailabilityEditor {...defaultProps} />);

      expect(screen.getByText('Aucune exception définie')).toBeInTheDocument();
    });

    it('should display existing weekly slots', () => {
      const weeklySlots = [
        { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 1, startTime: '14:00', endTime: '18:00' },
      ];

      renderWithChakra(
        <AvailabilityEditor {...defaultProps} weeklySlots={weeklySlots} />
      );

      expect(screen.getAllByText('Lundi').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('09:00 - 12:00')).toBeInTheDocument();
      expect(screen.getByText('14:00 - 18:00')).toBeInTheDocument();
    });

    it('should display existing exceptions with reason', () => {
      const exceptions = [{ date: '2024-12-25', reason: 'Noël' }];

      renderWithChakra(
        <AvailabilityEditor {...defaultProps} exceptions={exceptions} />
      );

      expect(screen.getByText('(Noël)')).toBeInTheDocument();
    });
  });

  describe('Adding Weekly Slots', () => {
    it('should call onSlotsChange when adding a valid slot', () => {
      renderWithChakra(<AvailabilityEditor {...defaultProps} />);

      const addButton = screen.getAllByText('Ajouter')[0];
      fireEvent.click(addButton);

      expect(mockOnSlotsChange).toHaveBeenCalledWith([
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      ]);
    });

    it('should show error when end time is before start time', () => {
      renderWithChakra(<AvailabilityEditor {...defaultProps} />);

      const startInput = screen.getByDisplayValue('09:00');
      const endInput = screen.getByDisplayValue('17:00');

      fireEvent.change(startInput, { target: { value: '18:00' } });
      fireEvent.change(endInput, { target: { value: '09:00' } });

      const addButton = screen.getAllByText('Ajouter')[0];
      fireEvent.click(addButton);

      expect(
        screen.getByText("L'heure de fin doit être après l'heure de début")
      ).toBeInTheDocument();
      expect(mockOnSlotsChange).not.toHaveBeenCalled();
    });

    it('should show error when slot overlaps existing slot', () => {
      const weeklySlots = [
        { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
      ];

      renderWithChakra(
        <AvailabilityEditor {...defaultProps} weeklySlots={weeklySlots} />
      );

      const startInput = screen.getByDisplayValue('09:00');
      const endInput = screen.getByDisplayValue('17:00');

      fireEvent.change(startInput, { target: { value: '10:00' } });
      fireEvent.change(endInput, { target: { value: '14:00' } });

      const addButton = screen.getAllByText('Ajouter')[0];
      fireEvent.click(addButton);

      expect(
        screen.getByText('Ce créneau chevauche un créneau existant')
      ).toBeInTheDocument();
      expect(mockOnSlotsChange).not.toHaveBeenCalled();
    });
  });

  describe('Removing Weekly Slots', () => {
    it('should call onSlotsChange when removing a slot', () => {
      const weeklySlots = [
        { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '12:00' },
      ];

      renderWithChakra(
        <AvailabilityEditor {...defaultProps} weeklySlots={weeklySlots} />
      );

      const deleteButtons = screen.getAllByLabelText('Supprimer le créneau');
      fireEvent.click(deleteButtons[0]);

      expect(mockOnSlotsChange).toHaveBeenCalledWith([
        { dayOfWeek: 2, startTime: '09:00', endTime: '12:00' },
      ]);
    });

    it('should delete the correct item when slots are sorted differently than original order', () => {
      const weeklySlots = [
        { dayOfWeek: 3, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 1, startTime: '14:00', endTime: '18:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '12:00' },
      ];

      renderWithChakra(
        <AvailabilityEditor {...defaultProps} weeklySlots={weeklySlots} />
      );

      const deleteButtons = screen.getAllByLabelText('Supprimer le créneau');
      fireEvent.click(deleteButtons[0]);

      expect(mockOnSlotsChange).toHaveBeenCalledWith([
        { dayOfWeek: 3, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '12:00' },
      ]);
    });
  });

  describe('Adding Exceptions', () => {
    it('should call onExceptionsChange when adding a valid exception', () => {
      renderWithChakra(<AvailabilityEditor {...defaultProps} />);

      const dateInputs = screen.getAllByDisplayValue('');
      const dateInput = dateInputs.find(
        (input) => input.getAttribute('type') === 'date'
      );

      fireEvent.change(dateInput!, { target: { value: '2024-12-25' } });

      const addButtons = screen.getAllByText('Ajouter');
      fireEvent.click(addButtons[1]);

      expect(mockOnExceptionsChange).toHaveBeenCalledWith([
        { date: '2024-12-25', reason: '' },
      ]);
    });

    it('should show error when date is empty', () => {
      renderWithChakra(<AvailabilityEditor {...defaultProps} />);

      const addButtons = screen.getAllByText('Ajouter');
      fireEvent.click(addButtons[1]);

      expect(screen.getByText('Une date est requise')).toBeInTheDocument();
      expect(mockOnExceptionsChange).not.toHaveBeenCalled();
    });

    it('should show error when exception already exists for date', () => {
      const exceptions = [{ date: '2024-12-25', reason: 'Noël' }];

      renderWithChakra(
        <AvailabilityEditor {...defaultProps} exceptions={exceptions} />
      );

      const dateInputs = screen.getAllByDisplayValue('');
      const dateInput = dateInputs.find(
        (input) => input.getAttribute('type') === 'date'
      );

      fireEvent.change(dateInput!, { target: { value: '2024-12-25' } });

      const addButtons = screen.getAllByText('Ajouter');
      fireEvent.click(addButtons[1]);

      expect(
        screen.getByText('Une exception existe déjà pour cette date')
      ).toBeInTheDocument();
      expect(mockOnExceptionsChange).not.toHaveBeenCalled();
    });
  });

  describe('Removing Exceptions', () => {
    it('should call onExceptionsChange when removing an exception', () => {
      const exceptions = [
        { date: '2024-01-01', reason: 'Nouvel an' },
        { date: '2024-12-25', reason: 'Noël' },
      ];

      renderWithChakra(
        <AvailabilityEditor {...defaultProps} exceptions={exceptions} />
      );

      const deleteButtons = screen.getAllByLabelText("Supprimer l'exception");
      // Sorted by date, so 2024-01-01 is first
      fireEvent.click(deleteButtons[0]);

      expect(mockOnExceptionsChange).toHaveBeenCalledWith([
        { date: '2024-12-25', reason: 'Noël' },
      ]);
    });
  });

  describe('Loading State', () => {
    it('should disable inputs when loading', () => {
      renderWithChakra(
        <AvailabilityEditor {...defaultProps} isLoading={true} />
      );

      const addButtons = screen.getAllByText('Ajouter');
      addButtons.forEach((button) => {
        expect(button.closest('button')).toBeDisabled();
      });
    });
  });

  describe('French Day Names', () => {
    it('should display correct French day names', () => {
      const weeklySlots = [
        { dayOfWeek: 0, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 6, startTime: '09:00', endTime: '12:00' },
      ];

      renderWithChakra(
        <AvailabilityEditor {...defaultProps} weeklySlots={weeklySlots} />
      );

      // Each day name appears in slot display + in dropdown, so use getAllByText
      expect(screen.getAllByText('Dimanche').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Lundi').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Mardi').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Mercredi').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Jeudi').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Vendredi').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Samedi').length).toBeGreaterThanOrEqual(1);
    });
  });
});
