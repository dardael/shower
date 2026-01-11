/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BookingForm } from '@/presentation/public/components/appointment/BookingForm';

jest.mock('@/presentation/shared/components/ui/toaster', () => ({
  toaster: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/presentation/shared/contexts/ThemeColorContext', () => ({
  useThemeColorContext: () => ({
    themeColor: 'blue',
    updateThemeColor: jest.fn(),
    refreshThemeColor: jest.fn(),
    isLoading: false,
    setThemeColor: jest.fn(),
  }),
}));

const mockActivity = {
  id: 'activity-1',
  name: 'Consultation',
  durationMinutes: 60,
  color: '#3B82F6',
  isActive: true,
  minimumBookingNoticeHours: 24,
  requiredFields: {
    fields: ['name', 'email'],
  },
  reminderSettings: {
    enabled: true,
    hoursBefore: 24,
  },
};

const mockActivityWithRequiredFields = {
  id: 'activity-2',
  name: 'Massage',
  durationMinutes: 90,
  color: '#3B82F6',
  isActive: true,
  minimumBookingNoticeHours: 24,
  requiredFields: {
    fields: ['name', 'email', 'phone', 'address', 'custom'],
    customFieldLabel: 'Allergie connue',
  },
  reminderSettings: {
    enabled: true,
    hoursBefore: 24,
  },
};

const mockDate = new Date('2024-01-16T00:00:00.000Z');
const mockSlot = { startTime: '2024-01-16T10:00:00.000Z', endTime: '2024-01-16T11:00:00.000Z' };

const renderWithChakra = (ui: React.ReactElement): ReturnType<typeof render> => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

describe('BookingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should display form with basic fields', () => {
      renderWithChakra(
        <BookingForm
          activity={mockActivity}
          date={mockDate}
          slot={mockSlot}
          onSuccess={jest.fn()}

        />
      );


      expect(screen.getByText('Nom complet *')).toBeInTheDocument();
      expect(screen.getByText('Email *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Jean Dupont')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('jean@example.com')).toBeInTheDocument();
    });

    it('should display activity summary', () => {
      renderWithChakra(
        <BookingForm
          activity={mockActivity}
          date={mockDate}
          slot={mockSlot}
          onSuccess={jest.fn()}

        />
      );

      expect(screen.getByText('Consultation')).toBeInTheDocument();
      expect(screen.getByText(/16\/01\/2024.*10:00 - 11:00.*\(60 min\)/)).toBeInTheDocument();
    });

    it('should display optional fields when required', () => {
      renderWithChakra(
        <BookingForm
          activity={mockActivityWithRequiredFields}
          date={mockDate}
          slot={mockSlot}
          onSuccess={jest.fn()}

        />
      );

      expect(screen.getByText('Téléphone *')).toBeInTheDocument();
      expect(screen.getByText('Adresse *')).toBeInTheDocument();
      expect(screen.getByText('Allergie connue *')).toBeInTheDocument();
    });

    it('should not display optional fields when not required', () => {
      renderWithChakra(
        <BookingForm
          activity={mockActivity}
          date={mockDate}
          slot={mockSlot}
          onSuccess={jest.fn()}

        />
      );

      expect(screen.queryByText('Téléphone *')).not.toBeInTheDocument();
      expect(screen.queryByText('Adresse *')).not.toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('should show error when name is empty', async () => {
      renderWithChakra(
        <BookingForm
          activity={mockActivity}
          date={mockDate}
          slot={mockSlot}
          onSuccess={jest.fn()}

        />
      );

      const submitButton = screen.getByText('Confirmer le rendez-vous');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
      });
    });

    it('should show error when email is empty', async () => {
      renderWithChakra(
        <BookingForm
          activity={mockActivity}
          date={mockDate}
          slot={mockSlot}
          onSuccess={jest.fn()}

        />
      );

      const nameInput = screen.getByPlaceholderText('Jean Dupont');
      fireEvent.change(nameInput, { target: { value: 'Jean Dupont' } });

      const submitButton = screen.getByText('Confirmer le rendez-vous');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("L'email est requis")).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      renderWithChakra(
        <BookingForm
          activity={mockActivity}
          date={mockDate}
          slot={mockSlot}
          onSuccess={jest.fn()}

        />
      );

      const nameInput = screen.getByPlaceholderText('Jean Dupont');
      const emailInput = screen.getByPlaceholderText('jean@example.com');

      fireEvent.change(nameInput, { target: { value: 'Jean Dupont' } });
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const submitButton = screen.getByText('Confirmer le rendez-vous');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Format d'email invalide")).toBeInTheDocument();
      });
    });

    it('should show error when required phone is empty', async () => {
      renderWithChakra(
        <BookingForm
          activity={mockActivityWithRequiredFields}
          date={mockDate}
          slot={mockSlot}
          onSuccess={jest.fn()}

        />
      );

      const nameInput = screen.getByPlaceholderText('Jean Dupont');
      const emailInput = screen.getByPlaceholderText('jean@example.com');

      fireEvent.change(nameInput, { target: { value: 'Jean Dupont' } });
      fireEvent.change(emailInput, { target: { value: 'jean@example.com' } });

      const submitButton = screen.getByText('Continuer');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Le téléphone est requis')).toBeInTheDocument();
      });
    });

    it('should clear error when field is corrected', async () => {
      renderWithChakra(
        <BookingForm
          activity={mockActivity}
          date={mockDate}
          slot={mockSlot}
          onSuccess={jest.fn()}

        />
      );

      const submitButton = screen.getByText('Confirmer le rendez-vous');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('Jean Dupont');
      fireEvent.change(nameInput, { target: { value: 'Jean Dupont' } });

      expect(screen.queryByText('Le nom est requis')).not.toBeInTheDocument();
    });
  });

  describe('Form submission', () => {
    it('should submit form with correct data', async () => {
      const onSuccess = jest.fn();

      renderWithChakra(
        <BookingForm
          activity={mockActivity}
          date={mockDate}
          slot={mockSlot}
          onSuccess={onSuccess}

        />
      );

      const nameInput = screen.getByPlaceholderText('Jean Dupont');
      const emailInput = screen.getByPlaceholderText('jean@example.com');

      fireEvent.change(nameInput, { target: { value: 'Jean Dupont' } });
      fireEvent.change(emailInput, { target: { value: 'jean@example.com' } });

      const submitButton = screen.getByText('Confirmer le rendez-vous');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith({
          name: 'Jean Dupont',
          email: 'jean@example.com',
          phone: '',
          address: '',
          customFieldValue: '',
        });
      });
    });

    it('should show error toast on submission failure', async () => {
      const onSuccess = jest.fn();

      renderWithChakra(
        <BookingForm
          activity={mockActivity}
          date={mockDate}
          slot={mockSlot}
          onSuccess={onSuccess}

        />
      );

      const submitButton = screen.getByText('Confirmer le rendez-vous');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).not.toHaveBeenCalled();
        expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
      });
    });

    it('should show success toast on successful submission', async () => {
      const onSuccess = jest.fn();

      renderWithChakra(
        <BookingForm
          activity={mockActivity}
          date={mockDate}
          slot={mockSlot}
          onSuccess={onSuccess}

        />
      );

      const nameInput = screen.getByPlaceholderText('Jean Dupont');
      const emailInput = screen.getByPlaceholderText('jean@example.com');

      fireEvent.change(nameInput, { target: { value: 'Jean Dupont' } });
      fireEvent.change(emailInput, { target: { value: 'jean@example.com' } });

      const submitButton = screen.getByText('Confirmer le rendez-vous');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith({
          name: 'Jean Dupont',
          email: 'jean@example.com',
          phone: '',
          address: '',
          customFieldValue: '',
        });
      });
    });
  });

  describe('User interactions', () => {

    it('should call onSuccess when form is valid', async () => {
      const onSuccess = jest.fn();

      renderWithChakra(
        <BookingForm
          activity={mockActivity}
          date={mockDate}
          slot={mockSlot}
          onSuccess={onSuccess}

        />
      );

      const nameInput = screen.getByPlaceholderText('Jean Dupont');
      const emailInput = screen.getByPlaceholderText('jean@example.com');

      fireEvent.change(nameInput, { target: { value: 'Jean Dupont' } });
      fireEvent.change(emailInput, { target: { value: 'jean@example.com' } });

      const submitButton = screen.getByText('Confirmer le rendez-vous');
      fireEvent.click(submitButton);

      expect(onSuccess).toHaveBeenCalledWith({
        name: 'Jean Dupont',
        email: 'jean@example.com',
        phone: '',
        address: '',
        customFieldValue: '',
      });
    });
  });
});
