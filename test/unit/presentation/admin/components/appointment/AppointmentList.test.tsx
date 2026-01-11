/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AppointmentList } from '@/presentation/admin/components/appointment/AppointmentList';

jest.mock('@/presentation/shared/components/ui/toaster', () => ({
  toaster: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Chakra UI Table components
jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    Table: {
      Root: ({
        children,
        ...props
      }: React.PropsWithChildren<Record<string, unknown>>) => (
        <table {...props}>{children}</table>
      ),
      Header: ({
        children,
        ...props
      }: React.PropsWithChildren<Record<string, unknown>>) => (
        <thead {...props}>{children}</thead>
      ),
      Body: ({
        children,
        ...props
      }: React.PropsWithChildren<Record<string, unknown>>) => (
        <tbody {...props}>{children}</tbody>
      ),
      Row: ({
        children,
        ...props
      }: React.PropsWithChildren<Record<string, unknown>>) => (
        <tr {...props}>{children}</tr>
      ),
      ColumnHeader: ({
        children,
        ...props
      }: React.PropsWithChildren<Record<string, unknown>>) => (
        <th {...props}>{children}</th>
      ),
      Cell: ({
        children,
        ...props
      }: React.PropsWithChildren<Record<string, unknown>>) => (
        <td {...props}>{children}</td>
      ),
    },
  };
});

const mockAppointments = [
  {
    id: 'apt-1',
    activityName: 'Consultation',
    activityColor: '#3182CE',
    dateTime: '2024-01-16T10:00:00.000Z',
    durationMinutes: 60,
    status: 'pending',
    clientInfo: {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      phone: '0612345678',
    },
  },
  {
    id: 'apt-2',
    activityName: 'Massage',
    activityColor: '#38A169',
    dateTime: '2024-01-17T14:00:00.000Z',
    durationMinutes: 90,
    status: 'confirmed',
    clientInfo: {
      name: 'Marie Martin',
      email: 'marie@example.com',
    },
  },
  {
    id: 'apt-3',
    activityName: 'Soin',
    activityColor: '#805AD5',
    dateTime: '2024-01-15T09:00:00.000Z',
    durationMinutes: 45,
    status: 'cancelled',
    clientInfo: {
      name: 'Pierre Durand',
      email: 'pierre@example.com',
    },
  },
];

const renderWithChakra = (
  ui: React.ReactElement
): ReturnType<typeof render> => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

describe('AppointmentList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should display loading state initially', () => {
      global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      expect(
        screen.getByText('Chargement des rendez-vous...')
      ).toBeInTheDocument();
    });

    it('should display appointments after loading', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      expect(screen.getByText('Marie Martin')).toBeInTheDocument();
      expect(screen.getByText('Pierre Durand')).toBeInTheDocument();
    });

    it('should display empty state when no appointments', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(
          screen.getByText('Aucun rendez-vous à afficher')
        ).toBeInTheDocument();
      });
    });

    it('should display activity name and color', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Consultation')).toBeInTheDocument();
      });

      expect(screen.getByText('Massage')).toBeInTheDocument();
    });

    it('should display client information', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('jean@example.com')).toBeInTheDocument();
      });

      expect(screen.getByText('0612345678')).toBeInTheDocument();
    });

    it('should display status labels in French', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('En attente')).toBeInTheDocument();
      });

      expect(screen.getByText('Confirmé')).toBeInTheDocument();
      expect(screen.getByText('Annulé')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('should display filter buttons with counts', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Tous (3)')).toBeInTheDocument();
      });

      expect(screen.getByText(/En attente \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Confirmés \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Annulés \(1\)/)).toBeInTheDocument();
    });

    it('should filter by pending status', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      const pendingButton = screen.getByText(/En attente \(1\)/);
      fireEvent.click(pendingButton);

      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      expect(screen.queryByText('Marie Martin')).not.toBeInTheDocument();
      expect(screen.queryByText('Pierre Durand')).not.toBeInTheDocument();
    });

    it('should filter by confirmed status', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      const confirmedButton = screen.getByText(/Confirmés \(1\)/);
      fireEvent.click(confirmedButton);

      expect(screen.queryByText('Jean Dupont')).not.toBeInTheDocument();
      expect(screen.getByText('Marie Martin')).toBeInTheDocument();
      expect(screen.queryByText('Pierre Durand')).not.toBeInTheDocument();
    });

    it('should show all when "Tous" filter is clicked', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      // First filter to pending
      const pendingButton = screen.getByText(/En attente \(1\)/);
      fireEvent.click(pendingButton);

      expect(screen.queryByText('Marie Martin')).not.toBeInTheDocument();

      // Then show all
      const allButton = screen.getByText('Tous (3)');
      fireEvent.click(allButton);

      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      expect(screen.getByText('Marie Martin')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should show confirm and cancel buttons for pending appointments', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      const confirmButtons = screen.getAllByLabelText('Confirmer');
      expect(confirmButtons.length).toBeGreaterThan(0);
    });

    it('should call confirm API when confirm button is clicked', async () => {
      global.fetch = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAppointments),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
          })
        )
        .mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAppointments),
          })
        );

      const { toaster } = jest.requireMock(
        '@/presentation/shared/components/ui/toaster'
      );

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      const confirmButton = screen.getAllByLabelText('Confirmer')[0];
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/appointments/apt-1', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'confirm' }),
        });
      });

      expect(toaster.success).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Rendez-vous confirmé',
        })
      );
    });

    it('should call cancel API when cancel button is clicked', async () => {
      global.fetch = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAppointments),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
          })
        )
        .mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAppointments),
          })
        );

      const { toaster } = jest.requireMock(
        '@/presentation/shared/components/ui/toaster'
      );

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      const cancelButtons = screen.getAllByLabelText('Annuler');
      fireEvent.click(cancelButtons[0]);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/appointments/apt-1', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'cancel' }),
        });
      });

      expect(toaster.success).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Rendez-vous annulé',
        })
      );
    });

    it('should call delete API when delete button is clicked', async () => {
      window.confirm = jest.fn(() => true);
      global.fetch = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAppointments),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
          })
        )
        .mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAppointments),
          })
        );

      const { toaster } = jest.requireMock(
        '@/presentation/shared/components/ui/toaster'
      );

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      // Click the delete button for the first appointment (this opens the dialog)
      const deleteButtons = screen.getAllByLabelText('Supprimer');
      fireEvent.click(deleteButtons[0]);

      // Wait for the confirmation dialog to appear
      await waitFor(() => {
        expect(
          screen.getByText(
            'Êtes-vous sûr de vouloir supprimer ce rendez-vous ?'
          )
        ).toBeInTheDocument();
      });

      // Click the "Supprimer" button in the dialog to confirm
      const confirmButtons = screen.getAllByRole('button', {
        name: 'Supprimer',
      });
      const confirmDeleteButton = confirmButtons.find((button) =>
        button.closest('[role="dialog"]')
      );
      fireEvent.click(confirmDeleteButton!);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/appointments/apt-3', {
          method: 'DELETE',
        });
      });

      expect(toaster.success).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Rendez-vous supprimé',
        })
      );
    });

    it('should not delete when confirmation is cancelled', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      // Click the delete button to open the dialog
      const deleteButtons = screen.getAllByLabelText('Supprimer');
      fireEvent.click(deleteButtons[0]);

      // Wait for the confirmation dialog to appear
      await waitFor(() => {
        expect(
          screen.getByText(
            'Êtes-vous sûr de vouloir supprimer ce rendez-vous ?'
          )
        ).toBeInTheDocument();
      });

      // Click the "Annuler" button in the dialog (not the aria-label ones in the table)
      const cancelButtons = screen.getAllByRole('button', { name: 'Annuler' });
      const dialogCancelButton = cancelButtons.find((button) =>
        button.closest('[role="dialog"]')
      );
      fireEvent.click(dialogCancelButton!);

      // Wait for dialog to close
      await waitFor(() => {
        expect(
          screen.queryByText(
            'Êtes-vous sûr de vouloir supprimer ce rendez-vous ?'
          )
        ).not.toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledTimes(1); // Only the initial fetch
    });

    it('should refresh appointments when refresh button is clicked', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      const refreshButton = screen.getByLabelText('Actualiser');
      fireEvent.click(refreshButton);

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error handling', () => {
    it('should show error toast on fetch failure', async () => {
      const { toaster } = jest.requireMock(
        '@/presentation/shared/components/ui/toaster'
      );
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(toaster.error).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'Impossible de charger les rendez-vous',
          })
        );
      });
    });

    it('should show error toast on network error', async () => {
      const { toaster } = jest.requireMock(
        '@/presentation/shared/components/ui/toaster'
      );
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Network error'))
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(toaster.error).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'Erreur de connexion',
          })
        );
      });
    });

    it('should show error toast when confirm fails', async () => {
      const { toaster } = jest.requireMock(
        '@/presentation/shared/components/ui/toaster'
      );
      global.fetch = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAppointments),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ message: 'Conflit de version' }),
          })
        );

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      const confirmButton = screen.getAllByLabelText('Confirmer')[0];
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toaster.error).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'Conflit de version',
          })
        );
      });
    });
  });

  describe('Localization', () => {
    it('should display all labels in French', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments),
        })
      ) as jest.Mock;

      renderWithChakra(<AppointmentList />);

      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });

      // Check French labels - use getAllByText for elements that appear multiple times
      expect(screen.getByText('Tous (3)')).toBeInTheDocument();
      expect(screen.getAllByText(/En attente/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Confirmé/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Annulé/).length).toBeGreaterThan(0);
    });
  });
});
