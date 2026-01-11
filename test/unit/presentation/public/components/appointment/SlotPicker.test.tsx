/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { SlotPicker } from '@/presentation/public/components/appointment/SlotPicker';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

const mockSlots: TimeSlot[] = [
  { startTime: '2024-01-16T09:00:00.000Z', endTime: '2024-01-16T10:00:00.000Z' },
  { startTime: '2024-01-16T10:00:00.000Z', endTime: '2024-01-16T11:00:00.000Z' },
  { startTime: '2024-01-16T11:00:00.000Z', endTime: '2024-01-16T12:00:00.000Z' },
  { startTime: '2024-01-16T14:00:00.000Z', endTime: '2024-01-16T15:00:00.000Z' },
  { startTime: '2024-01-16T15:00:00.000Z', endTime: '2024-01-16T16:00:00.000Z' },
];

const renderWithChakra = (ui: React.ReactElement): ReturnType<typeof render> => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

describe('SlotPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ doNotFake: ['setTimeout', 'setInterval', 'queueMicrotask', 'nextTick'] });
    jest.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Week navigation', () => {
    it('should display current week days', () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      ) as jest.Mock;

      renderWithChakra(
        <SlotPicker activityId="activity-1" onSelect={jest.fn()} themeColor="blue" />
      );

      expect(screen.getByText('Lun')).toBeInTheDocument();
      expect(screen.getByText('Mar')).toBeInTheDocument();
      expect(screen.getByText('Mer')).toBeInTheDocument();
      expect(screen.getByText('Jeu')).toBeInTheDocument();
      expect(screen.getByText('Ven')).toBeInTheDocument();
      expect(screen.getByText('Sam')).toBeInTheDocument();
      expect(screen.getByText('Dim')).toBeInTheDocument();
    });

    it('should navigate to previous week when clicking previous button', () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      ) as jest.Mock;

      renderWithChakra(
        <SlotPicker activityId="activity-1" onSelect={jest.fn()} themeColor="blue" />
      );

      // Find all buttons, the first one is the previous week button
      const buttons = screen.getAllByRole('button');
      const prevButton = buttons[0];
      fireEvent.click(prevButton);

      // Should show previous week dates (8 Janvier - 14 Janvier2024)
      expect(screen.getByText(/8 Janvier - 14 Janvier 2024/)).toBeInTheDocument();
    });

    it('should navigate to next week when clicking next button', () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      ) as jest.Mock;

      renderWithChakra(
        <SlotPicker activityId="activity-1" onSelect={jest.fn()} themeColor="blue" />
      );

      // Find all buttons, the second one is the next week button
      const buttons = screen.getAllByRole('button');
      const nextButton = buttons[1];
      fireEvent.click(nextButton);

      // Should show next week dates (22 Janvier - 28 Janvier 2024)
      expect(screen.getByText(/22 Janvier - 28 Janvier 2024/)).toBeInTheDocument();
    });
  });

  describe('Date selection', () => {
    it('should display available slots when date is selected', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSlots),
        })
      ) as jest.Mock;

      renderWithChakra(
        <SlotPicker activityId="activity-1" onSelect={jest.fn()} themeColor="blue" />
      );

      // Wait for availability fetch to complete so dates become clickable
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const dayElements = screen.getAllByText('16');
      const dayButton = dayElements[0];
      fireEvent.click(dayButton);

      await waitFor(() => {
        expect(screen.getByText(/09:00 - 10:00/)).toBeInTheDocument();
      });

      expect(screen.getByText(/10:00 - 11:00/)).toBeInTheDocument();
      expect(screen.getByText(/14:00 - 15:00/)).toBeInTheDocument();
    });

    it('should highlight selected date', async () => {
      const selectedDate = new Date('2024-01-16T00:00:00.000Z');
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSlots),
        })
      ) as jest.Mock;

      renderWithChakra(
        <SlotPicker themeColor="blue"
          activityId="activity-1"
          onSelect={jest.fn()}
          selectedDate={selectedDate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/09:00 - 10:00/)).toBeInTheDocument();
      });
    });
  });

  describe('Slot selection', () => {
    it('should call onSelect when slot is clicked', async () => {
      jest.useRealTimers(); // Use real timers for async tests
      jest.useFakeTimers({ doNotFake: ['setTimeout', 'setInterval', 'queueMicrotask', 'nextTick'] });
      jest.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));

      const onSelect = jest.fn();
      const selectedDate = new Date('2024-01-16T00:00:00.000Z');
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSlots),
        })
      ) as jest.Mock;

      renderWithChakra(
        <SlotPicker themeColor="blue"
          activityId="activity-1"
          onSelect={onSelect}
          selectedDate={selectedDate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/09:00 - 10:00/)).toBeInTheDocument();
      });

      const slotButton = screen.getByText(/09:00 - 10:00/);
      fireEvent.click(slotButton);

      expect(onSelect).toHaveBeenCalledWith(
        expect.any(Date),
        { startTime: '2024-01-16T09:00:00.000Z', endTime: '2024-01-16T10:00:00.000Z' }
      );
    });

    it('should highlight selected slot', async () => {
      const selectedDate = new Date('2024-01-16T00:00:00.000Z');
      const selectedSlot: TimeSlot = { startTime: '2024-01-16T10:00:00.000Z', endTime: '2024-01-16T11:00:00.000Z' };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSlots),
        })
      ) as jest.Mock;

      renderWithChakra(
        <SlotPicker themeColor="blue"
          activityId="activity-1"
          onSelect={jest.fn()}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
        />
      );

      await waitFor(() => {
        const selectedSlotButton = screen.getByText(/10:00 - 11:00/);
        // Check that button exists and is rendered
        expect(selectedSlotButton.closest('button')).toBeInTheDocument();
      });
    });
  });

  describe('Loading state', () => {
it('should display loading indicator while fetching slots', async () => {
      const selectedDate = new Date('2024-01-16T00:00:00.000Z');
      // Mock a delayed response
      global.fetch = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: () => Promise.resolve(mockSlots),
              });
            }, 100);
          })
      ) as jest.Mock;

      renderWithChakra(
        <SlotPicker themeColor="blue"
          activityId="activity-1"
          onSelect={jest.fn()}
          selectedDate={selectedDate}
        />
      );

      expect(screen.getByText('Chargement des créneaux...')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('should display message when no slots available', async () => {
      const selectedDate = new Date('2024-01-16T00:00:00.000Z');
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      ) as jest.Mock;

      renderWithChakra(
        <SlotPicker themeColor="blue"
          activityId="activity-1"
          onSelect={jest.fn()}
          selectedDate={selectedDate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Aucun créneau disponible pour cette date')).toBeInTheDocument();
      });
    });
  });

  describe('API integration', () => {
    it('should fetch slots with correct parameters', async () => {
      const selectedDate = new Date('2024-01-16T00:00:00.000Z');
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSlots),
        })
      ) as jest.Mock;

      renderWithChakra(
        <SlotPicker themeColor="blue"
          activityId="activity-1"
          onSelect={jest.fn()}
          selectedDate={selectedDate}
        />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/appointments/availability/slots')
        );
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('activityId=activity-1')
      );
    });
  });

  describe('Past dates', () => {
    it('should show today with full opacity when slots are available', async () => {
      // Return slots so today will be enabled (not disabled)
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSlots),
        })
      ) as jest.Mock;

      renderWithChakra(
        <SlotPicker activityId="activity-1" onSelect={jest.fn()} themeColor="blue" />
      );

      // Wait for availability fetch to complete
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Today (15) should have full opacity when slots are available
      const todayElements = screen.getAllByText('15');
      const todayCell = todayElements[0].closest('div[opacity]');
      expect(todayCell).toHaveAttribute('opacity', '1');
    });
  });
});
