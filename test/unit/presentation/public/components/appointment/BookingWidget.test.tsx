/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BookingWidget } from '@/presentation/public/components/appointment/BookingWidget';
import { ThemeColorProvider } from '@/presentation/shared/contexts/ThemeColorContext';

jest.mock('@/presentation/shared/components/ui/toaster', () => ({
  toaster: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/presentation/shared/utils/ThemeColorStorage', () => ({
  ThemeColorStorage: {
    getThemeColor: () => 'blue',
    syncWithServer: jest.fn().mockResolvedValue('blue'),
    listenToUpdate: jest.fn(() => () => {}),
    setThemeColor: jest.fn(),
  },
}));

const mockActivities = [
  {
    id: 'activity-1',
    name: 'Consultation',
    description: 'Une consultation personnalisée',
    durationMinutes: 60,
    color: '#3182CE',
    price: 50,
    requiredFields: {
      fields: [],
      customFieldLabel: '',
    },
  },
];

const mockSlots = [
  { startTime: '2024-01-16T09:00:00.000Z', endTime: '2024-01-16T10:00:00.000Z' },
  { startTime: '2024-01-16T10:00:00.000Z', endTime: '2024-01-16T11:00:00.000Z' },
];

const renderWithChakra = (ui: React.ReactElement): ReturnType<typeof render> => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <ThemeColorProvider>{ui}</ThemeColorProvider>
    </ChakraProvider>
  );
};

// Helper function to click on an activity card
const clickActivityCard = async (activityName: string): Promise<void> => {
  const heading = screen.getByText(activityName);
  // Navigate up: Heading -> VStack -> Box (with onClick)
  const clickableBox = heading.parentElement?.parentElement;
  if (clickableBox) {
    fireEvent.click(clickableBox);
  }
};

describe('BookingWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Use fake timers but don't fake setTimeout/setInterval to allow waitFor to work
    jest.useFakeTimers({ doNotFake: ['setTimeout', 'setInterval', 'queueMicrotask', 'nextTick'] });
    jest.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Activity selection step', () => {
    it('should display activity selector initially', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockActivities),
        })
      ) as jest.Mock;

      renderWithChakra(<BookingWidget />);

      await waitFor(() => {
        expect(screen.getByText('Consultation')).toBeInTheDocument();
      });
    });

    it('should navigate to slot picker when activity is selected', async () => {
      global.fetch = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockActivities),
          })
        )
        .mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockSlots),
          })
        );

      renderWithChakra(<BookingWidget />);

      await waitFor(() => {
        expect(screen.getByText('Consultation')).toBeInTheDocument();
      });

      await clickActivityCard('Consultation');

      await waitFor(() => {
        expect(screen.getByText('Choisissez une date et un créneau')).toBeInTheDocument();
      });
    });
  });

  describe('Slot selection step', () => {
    it('should display slot picker after activity selection', async () => {
      global.fetch = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockActivities),
          })
        )
        .mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockSlots),
          })
        );

      renderWithChakra(<BookingWidget />);

      await waitFor(() => {
        expect(screen.getByText('Consultation')).toBeInTheDocument();
      });

      await clickActivityCard('Consultation');

      await waitFor(() => {
        expect(screen.getByText('Choisissez une date et un créneau')).toBeInTheDocument();
      });
    });

    it('should navigate back to activity selector when step indicator is clicked', async () => {
      global.fetch = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockActivities),
          })
        )
        .mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockSlots),
          })
        );

      renderWithChakra(<BookingWidget />);

      await waitFor(() => {
        expect(screen.getByText('Consultation')).toBeInTheDocument();
      });

      await clickActivityCard('Consultation');

      await waitFor(() => {
        expect(screen.getByText('Choisissez une date et un créneau')).toBeInTheDocument();
      });

      // Click on step 1 indicator to go back to activity selection
      const stepIndicator = screen.getByText('1');
      fireEvent.click(stepIndicator);

      await waitFor(() => {
        expect(screen.getByText('Choisissez une activité')).toBeInTheDocument();
      });
    });
  });

  describe('Success step', () => {
    it('should display success message after booking completion', async () => {
      let callCount = 0;
      global.fetch = jest.fn((url: string) => {
        callCount++;
        // First call is for activities
        if (callCount === 1) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockActivities),
          });
        }
        // Appointment creation (POST call)
        if (url.includes('/api/appointments') && !url.includes('availability')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'appointment-1' }),
          });
        }
        // All availability/slots calls return mockSlots
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSlots),
        });
      }) as jest.Mock;

      renderWithChakra(<BookingWidget />);

      // Select activity
      await waitFor(() => {
        expect(screen.getByText('Consultation')).toBeInTheDocument();
      });

      await clickActivityCard('Consultation');

      // Select date and slot
      await waitFor(() => {
        expect(screen.getByText('Choisissez une date et un créneau')).toBeInTheDocument();
      });

      // Wait for availability to be fetched
      await waitFor(() => {
        const dayElement = screen.getAllByText('16')[0];
        expect(dayElement.closest('[aria-disabled="false"]')).toBeInTheDocument();
      });

      // Click on a future date
      const dayElements = screen.getAllByText('16');
      if (dayElements[0]) {
        fireEvent.click(dayElements[0]);
      }

      await waitFor(() => {
        expect(screen.getByText(/09:00/)).toBeInTheDocument();
      });

      const slotButton = screen.getByText(/09:00/);
      fireEvent.click(slotButton);

      // Fill form
      await waitFor(() => {
        expect(screen.getByText('Vos informations')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('Jean Dupont');
      const emailInput = screen.getByPlaceholderText('jean@example.com');

      fireEvent.change(nameInput, { target: { value: 'Jean Dupont' } });
      fireEvent.change(emailInput, { target: { value: 'jean@example.com' } });

      // Click to submit form and go to confirmation step
      const submitButton = screen.getByText('Confirmer le rendez-vous');
      fireEvent.click(submitButton);

      // Wait for confirmation step
      await waitFor(() => {
        expect(screen.getByText('Confirmer le rendez-vous')).toBeInTheDocument();
      });

      // Click to confirm
      const confirmButton = screen.getByText('Confirmer le rendez-vous');
      fireEvent.click(confirmButton);

      // Success step
      await waitFor(() => {
        expect(screen.getByText('Rendez-vous confirmé !')).toBeInTheDocument();
      });

      expect(screen.getByText('Prendre un autre rendez-vous')).toBeInTheDocument();
    });

    it('should reset widget when "take another appointment" is clicked', async () => {
      let callCount = 0;
      global.fetch = jest.fn((url: string) => {
        callCount++;
        // First call and reset calls are for activities
        if (callCount === 1 || url.includes('/api/appointments/activities')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockActivities),
          });
        }
        // Appointment creation (POST call)
        if (url.includes('/api/appointments') && !url.includes('availability')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'appointment-1' }),
          });
        }
        // All availability/slots calls return mockSlots
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSlots),
        });
      }) as jest.Mock;

      renderWithChakra(<BookingWidget />);

      // Navigate through the entire flow
      await waitFor(() => {
        expect(screen.getByText('Consultation')).toBeInTheDocument();
      });

      await clickActivityCard('Consultation');

      await waitFor(() => {
        expect(screen.getByText('Choisissez une date et un créneau')).toBeInTheDocument();
      });

      // Wait for availability to be fetched
      await waitFor(() => {
        const dayElement = screen.getAllByText('16')[0];
        expect(dayElement.closest('[aria-disabled="false"]')).toBeInTheDocument();
      });

      const dayElements = screen.getAllByText('16');
      if (dayElements[0]) {
        fireEvent.click(dayElements[0]);
      }

      await waitFor(() => {
        expect(screen.getByText(/09:00/)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(/09:00/));

      await waitFor(() => {
        expect(screen.getByText('Vos informations')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText('Jean Dupont'), {
        target: { value: 'Jean Dupont' },
      });
      fireEvent.change(screen.getByPlaceholderText('jean@example.com'), {
        target: { value: 'jean@example.com' },
      });

      // Click to submit form and go to confirmation step
      fireEvent.click(screen.getByText('Confirmer le rendez-vous'));

      // Wait for confirmation step
      await waitFor(() => {
        expect(screen.getByText('Confirmer le rendez-vous')).toBeInTheDocument();
      });

      // Click to confirm
      fireEvent.click(screen.getByText('Confirmer le rendez-vous'));

      await waitFor(() => {
        expect(screen.getByText('Rendez-vous confirmé !')).toBeInTheDocument();
      });

      // Click reset button
      const resetButton = screen.getByText('Prendre un autre rendez-vous');
      fireEvent.click(resetButton);

      // Should be back to activity selection
      await waitFor(() => {
        expect(screen.getByText('Choisissez une activité')).toBeInTheDocument();
      });
    });
  });

  describe('Form step navigation', () => {
    it('should navigate back to slot picker from form', async () => {
      let callCount = 0;
      global.fetch = jest.fn(() => {
        callCount++;
        // First call is for activities
        if (callCount === 1) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockActivities),
          });
        }
        // All other calls return mockSlots
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSlots),
        });
      }) as jest.Mock;

      renderWithChakra(<BookingWidget />);

      // Navigate to form step
      await waitFor(() => {
        expect(screen.getByText('Consultation')).toBeInTheDocument();
      });

      await clickActivityCard('Consultation');

      await waitFor(() => {
        expect(screen.getByText('Choisissez une date et un créneau')).toBeInTheDocument();
      });

      // Wait for availability to be fetched
      await waitFor(() => {
        const dayElement = screen.getAllByText('16')[0];
        expect(dayElement.closest('[aria-disabled="false"]')).toBeInTheDocument();
      });

      const dayElements = screen.getAllByText('16');
      if (dayElements[0]) {
        fireEvent.click(dayElements[0]);
      }

      await waitFor(() => {
        expect(screen.getByText(/09:00/)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(/09:00/));

      await waitFor(() => {
        expect(screen.getByText('Vos informations')).toBeInTheDocument();
      });

      // Click step 2 indicator to go back to slot picker
      const stepIndicator = screen.getByText('2');
      fireEvent.click(stepIndicator);

      await waitFor(() => {
        expect(screen.getByText('Choisissez une date et un créneau')).toBeInTheDocument();
      });
    });
  });
});
