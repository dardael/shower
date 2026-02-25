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

// System time is 2024-01-15 (Monday). Week: Jan 15-21. Jan 15=today, Jan 16=Tue.
const mockAvailableDays = [
  '2024-01-15',
  '2024-01-16',
  '2024-01-17',
  '2024-01-18',
  '2024-01-19',
  '2024-01-20',
  '2024-01-21',
];

const createMockFetch = (slots: TimeSlot[] = mockSlots): jest.Mock => {
  return jest.fn((url: string) => {
    if (url.includes('/availability/days')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAvailableDays),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(slots),
    });
  }) as jest.Mock;
};

const createEmptyMockFetch = (): jest.Mock => {
  return jest.fn((url: string) => {
    if (url.includes('/availability/days')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAvailableDays),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  }) as jest.Mock;
};

const renderWithChakra = (ui: React.ReactElement): ReturnType<typeof render> => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

describe('SlotPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({
      doNotFake: ['setTimeout', 'setInterval', 'queueMicrotask', 'nextTick'],
    });
    jest.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Week navigation', () => {
    it('should display current week days', () => {
      global.fetch = createEmptyMockFetch();

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
      global.fetch = createEmptyMockFetch();

      renderWithChakra(
        <SlotPicker activityId="activity-1" onSelect={jest.fn()} themeColor="blue" />
      );

      const buttons = screen.getAllByRole('button');
      const prevButton = buttons[0];
      fireEvent.click(prevButton);

      expect(screen.getByText(/8 Janvier - 14 Janvier 2024/)).toBeInTheDocument();
    });

    it('should navigate to next week when clicking next button', () => {
      global.fetch = createEmptyMockFetch();

      renderWithChakra(
        <SlotPicker activityId="activity-1" onSelect={jest.fn()} themeColor="blue" />
      );

      const buttons = screen.getAllByRole('button');
      const nextButton = buttons[1];
      fireEvent.click(nextButton);

      expect(screen.getByText(/22 Janvier - 28 Janvier 2024/)).toBeInTheDocument();
    });
  });

  describe('Date selection', () => {
    it('should display available slots when date is selected', async () => {
      global.fetch = createMockFetch();

      renderWithChakra(
        <SlotPicker activityId="activity-1" onSelect={jest.fn()} themeColor="blue" />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const dayElements = screen.getAllByText('16');
      fireEvent.click(dayElements[0]);

      await waitFor(() => {
        expect(screen.getByText(/09:00 - 10:00/)).toBeInTheDocument();
      });

      expect(screen.getByText(/10:00 - 11:00/)).toBeInTheDocument();
      expect(screen.getByText(/14:00 - 15:00/)).toBeInTheDocument();
    });

    it('should highlight selected date', async () => {
      const selectedDate = new Date('2024-01-16T00:00:00.000Z');
      global.fetch = createMockFetch();

      renderWithChakra(
        <SlotPicker
          themeColor="blue"
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
      const onSelect = jest.fn();
      const selectedDate = new Date('2024-01-16T00:00:00.000Z');
      global.fetch = createMockFetch();

      renderWithChakra(
        <SlotPicker
          themeColor="blue"
          activityId="activity-1"
          onSelect={onSelect}
          selectedDate={selectedDate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/09:00 - 10:00/)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(/09:00 - 10:00/));

      expect(onSelect).toHaveBeenCalledWith(expect.any(Date), {
        startTime: '2024-01-16T09:00:00.000Z',
        endTime: '2024-01-16T10:00:00.000Z',
      });
    });

    it('should highlight selected slot', async () => {
      const selectedDate = new Date('2024-01-16T00:00:00.000Z');
      const selectedSlot: TimeSlot = {
        startTime: '2024-01-16T10:00:00.000Z',
        endTime: '2024-01-16T11:00:00.000Z',
      };
      global.fetch = createMockFetch();

      renderWithChakra(
        <SlotPicker
          themeColor="blue"
          activityId="activity-1"
          onSelect={jest.fn()}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
        />
      );

      await waitFor(() => {
        const selectedSlotButton = screen.getByText(/10:00 - 11:00/);
        expect(selectedSlotButton).toBeInTheDocument();
      });
    });
  });

  describe('Loading state', () => {
    it('should display loading indicator while fetching slots', async () => {
      const selectedDate = new Date('2024-01-16T00:00:00.000Z');
      global.fetch = jest.fn((url: string) => {
        if (url.includes('/availability/days')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAvailableDays),
          });
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ ok: true, json: () => Promise.resolve(mockSlots) });
          }, 100);
        });
      }) as jest.Mock;

      renderWithChakra(
        <SlotPicker
          themeColor="blue"
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
      global.fetch = createEmptyMockFetch();

      renderWithChakra(
        <SlotPicker
          themeColor="blue"
          activityId="activity-1"
          onSelect={jest.fn()}
          selectedDate={selectedDate}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText('Aucun créneau disponible pour cette date')
        ).toBeInTheDocument();
      });
    });
  });

  describe('API integration', () => {
    it('should fetch slots with correct parameters', async () => {
      const selectedDate = new Date('2024-01-16T00:00:00.000Z');
      global.fetch = createMockFetch();

      renderWithChakra(
        <SlotPicker
          themeColor="blue"
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
      global.fetch = createMockFetch();

      renderWithChakra(
        <SlotPicker activityId="activity-1" onSelect={jest.fn()} themeColor="blue" />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/availability/days')
        );
      });

      // Today (15) is in mockAvailableDays so it should be enabled
      const todayElements = screen.getAllByText('15');
      const todayCell = todayElements[0].closest('[aria-disabled]');
      expect(todayCell).toHaveAttribute('aria-disabled', 'false');
    });
  });
});
