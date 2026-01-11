/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ActivitySelector } from '@/presentation/public/components/appointment/ActivitySelector';
import { ThemeColorProvider } from '@/presentation/shared/contexts/ThemeColorContext';

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
  },
  {
    id: 'activity-2',
    name: 'Massage',
    description: 'Un massage relaxant',
    durationMinutes: 90,
    color: '#38A169',
    price: 80,
  },
];

const renderWithChakra = (ui: React.ReactElement): ReturnType<typeof render> => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <ThemeColorProvider>{ui}</ThemeColorProvider>
    </ChakraProvider>
  );
};

describe('ActivitySelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should display loading spinner while fetching activities', async () => {
      global.fetch = jest.fn(
        () => new Promise(() => {})
      ) as jest.Mock;

      renderWithChakra(<ActivitySelector onSelect={jest.fn()} />);

      expect(screen.getByText('Chargement des activités...')).toBeInTheDocument();
    });
  });

  describe('Activities display', () => {
    it('should display activities after successful fetch', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockActivities),
        })
      ) as jest.Mock;

      renderWithChakra(<ActivitySelector onSelect={jest.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('Consultation')).toBeInTheDocument();
      });

      expect(screen.getByText('Massage')).toBeInTheDocument();
      expect(screen.getByText('Une consultation personnalisée')).toBeInTheDocument();
      expect(screen.getByText('Un massage relaxant')).toBeInTheDocument();
    });

    it('should display activity duration in minutes', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockActivities),
        })
      ) as jest.Mock;

      renderWithChakra(<ActivitySelector onSelect={jest.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('60 min')).toBeInTheDocument();
      });

      expect(screen.getByText('90 min')).toBeInTheDocument();
    });

    it('should display activity price when provided', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockActivities),
        })
      ) as jest.Mock;

      renderWithChakra(<ActivitySelector onSelect={jest.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('50.00 €')).toBeInTheDocument();
      });

      expect(screen.getByText('80.00 €')).toBeInTheDocument();
    });

    it('should display empty message when no activities available', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      ) as jest.Mock;

      renderWithChakra(<ActivitySelector onSelect={jest.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('Aucune activité disponible pour le moment')).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('should display error message on fetch failure', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      ) as jest.Mock;

      renderWithChakra(<ActivitySelector onSelect={jest.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('Impossible de charger les activités')).toBeInTheDocument();
      });
    });

    it('should display error message on network error', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      ) as jest.Mock;

      renderWithChakra(<ActivitySelector onSelect={jest.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('Erreur de connexion')).toBeInTheDocument();
      });
    });
  });

  describe('User interactions', () => {
    it('should call onSelect with activity when clicked', async () => {
      const onSelect = jest.fn();
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockActivities),
        })
      ) as jest.Mock;

      renderWithChakra(<ActivitySelector onSelect={onSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Consultation')).toBeInTheDocument();
      });

      // Structure: Box (onClick) > VStack > Box (color dot) + Heading + Text + HStack
      // The Heading "Consultation" is inside VStack, which is inside the clickable Box
      const activityHeading = screen.getByText('Consultation');
      // Go up: Heading -> VStack -> Box (this is the clickable one with onClick)
      const clickableBox = activityHeading.parentElement?.parentElement;
      if (clickableBox) {
        fireEvent.click(clickableBox);
      }

      expect(onSelect).toHaveBeenCalledWith(mockActivities[0]);
    });

    it('should display all activities from the API response', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockActivities),
        })
      ) as jest.Mock;

      renderWithChakra(<ActivitySelector onSelect={jest.fn()} />);

      await waitFor(() => {
        expect(screen.getByText('Consultation')).toBeInTheDocument();
      });

      expect(screen.getByText('Massage')).toBeInTheDocument();
    });
  });

  describe('API integration', () => {
    it('should fetch activities from correct endpoint', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockActivities),
        })
      ) as jest.Mock;

      renderWithChakra(<ActivitySelector onSelect={jest.fn()} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/appointments/activities/public');
      });
    });
  });
});
