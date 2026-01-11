/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ActivityForm } from '@/presentation/admin/components/appointment/ActivityForm';

// Mock Chakra UI Checkbox component
jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    Checkbox: {
      Root: ({
        children,
        checked,
        disabled,
        onCheckedChange,
      }: {
        children: React.ReactNode;
        checked?: boolean;
        disabled?: boolean;
        onCheckedChange?: (e: { checked: boolean }) => void;
      }) => (
        <label>
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onCheckedChange?.({ checked: e.target.checked })}
          />
          {children}
        </label>
      ),
      HiddenInput: () => null,
      Control: () => null,
      Label: ({ children }: { children: React.ReactNode }) => (
        <span>{children}</span>
      ),
    },
  };
});

const renderWithChakra = (
  ui: React.ReactElement
): ReturnType<typeof render> => {
  return render(<ChakraProvider value={defaultSystem}>{ui}</ChakraProvider>);
};

describe('ActivityForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSuccess.mockClear();
    mockOnCancel.mockClear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const defaultActivity = {
    id: 'activity-1',
    name: 'Consultation initiale',
    description: 'Description de la consultation',
    durationMinutes: 60,
    color: '#3182ce',
    price: 50,
    isActive: true,
    requiredFields: {
      fields: ['name', 'email', 'phone'],
      customFieldLabel: undefined,
    },
    reminderSettings: {
      enabled: true,
      hoursBefore: 24,
    },
    minimumBookingNoticeHours: 2,
  };

  describe('Rendering', () => {
    it('should render form with "Nouvelle activité" title when creating new activity', () => {
      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Nouvelle activité')).toBeInTheDocument();
    });

    it('should render form with "Modifier l\'activité" title when editing existing activity', () => {
      renderWithChakra(
        <ActivityForm
          activity={defaultActivity}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Modifier l'activité")).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Nom de l'activité")).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Durée (minutes)')).toBeInTheDocument();
      expect(screen.getByText('Prix (€)')).toBeInTheDocument();
      expect(screen.getByText('Couleur')).toBeInTheDocument();
      expect(
        screen.getByText('Délai minimum de réservation (heures)')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Informations requises du client')
      ).toBeInTheDocument();
      expect(screen.getByText('Rappel par email')).toBeInTheDocument();
    });

    it('should render required fields checkboxes', () => {
      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Nom (obligatoire)')).toBeInTheDocument();
      expect(screen.getByText('Email (obligatoire)')).toBeInTheDocument();
      expect(screen.getByText('Téléphone')).toBeInTheDocument();
      expect(screen.getByText('Adresse')).toBeInTheDocument();
      expect(screen.getByText('Champ personnalisé')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Annuler' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Créer' })).toBeInTheDocument();
    });

    it('should show "Enregistrer" button when editing', () => {
      renderWithChakra(
        <ActivityForm
          activity={defaultActivity}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Enregistrer' })
      ).toBeInTheDocument();
    });
  });

  describe('Pre-population', () => {
    it('should pre-populate form fields when editing an activity', () => {
      renderWithChakra(
        <ActivityForm
          activity={defaultActivity}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByDisplayValue('Consultation initiale')
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Description de la consultation')
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('60')).toBeInTheDocument();
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
      expect(screen.getByDisplayValue('#3182ce')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    });

    it('should show default values when creating new activity', () => {
      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const durationInputs = screen.getAllByDisplayValue('60');
      expect(durationInputs.length).toBeGreaterThan(0);
      expect(screen.getByDisplayValue('#3182ce')).toBeInTheDocument();
    });
  });

  describe('Custom field label', () => {
    it('should show custom field label input when custom field is checked', () => {
      const activityWithCustomField = {
        ...defaultActivity,
        isActive: true,
        requiredFields: {
          fields: ['name', 'email', 'custom'],
          customFieldLabel: 'Motif de la consultation',
        },
      };

      renderWithChakra(
        <ActivityForm
          activity={activityWithCustomField}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByText('Libellé du champ personnalisé')
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('Motif de la consultation')
      ).toBeInTheDocument();
    });

    it('should not show custom field label input when custom field is not checked', () => {
      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.queryByText('Libellé du champ personnalisé')
      ).not.toBeInTheDocument();
    });
  });

  describe('Reminder settings', () => {
    it('should show reminder hours input when reminder is enabled', () => {
      renderWithChakra(
        <ActivityForm
          activity={defaultActivity}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByText('Heures avant le rendez-vous')
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('24')).toBeInTheDocument();
    });

    it('should not show reminder hours input when reminder is disabled', () => {
      const activityWithoutReminder = {
        ...defaultActivity,
        isActive: true,
        reminderSettings: {
          enabled: false,
          hoursBefore: undefined,
        },
      };

      renderWithChakra(
        <ActivityForm
          activity={activityWithoutReminder}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.queryByText('Heures avant le rendez-vous')
      ).not.toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    it('should call onCancel when cancel button is clicked', () => {
      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should update input values when user types', () => {
      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByPlaceholderText(
        'Ex: Consultation initiale'
      );
      fireEvent.change(nameInput, {
        target: { value: 'Ma nouvelle activité' },
      });

      expect(
        screen.getByDisplayValue('Ma nouvelle activité')
      ).toBeInTheDocument();
    });
  });

  describe('Form submission', () => {
    it('should call POST endpoint when creating new activity', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-id' }),
      });

      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByPlaceholderText(
        'Ex: Consultation initiale'
      );
      fireEvent.change(nameInput, { target: { value: 'Test Activity' } });

      fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/appointments/activities',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('should call PUT endpoint when updating existing activity', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: defaultActivity.id }),
      });

      renderWithChakra(
        <ActivityForm
          activity={defaultActivity}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          `/api/appointments/activities/${defaultActivity.id}`,
          expect.objectContaining({
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('should display error message when API call fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Erreur de validation' }),
      });

      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByPlaceholderText(
        'Ex: Consultation initiale'
      );
      fireEvent.change(nameInput, { target: { value: 'Test Activity' } });

      fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

      await waitFor(() => {
        expect(screen.getByText('Erreur de validation')).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should include required fields in payload', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'new-id' }),
      });

      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByPlaceholderText(
        'Ex: Consultation initiale'
      );
      fireEvent.change(nameInput, { target: { value: 'Test Activity' } });

      fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const fetchCalls = (global.fetch as jest.Mock).mock.calls;
      const callArgs = fetchCalls[fetchCalls.length - 1];
      const body = JSON.parse(callArgs[1].body);

      expect(body.requiredFields.fields).toContain('name');
      expect(body.requiredFields.fields).toContain('email');
    });
  });

  describe('French localization', () => {
    it('should display all labels in French', () => {
      renderWithChakra(
        <ActivityForm
          activity={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Nom de l'activité")).toBeInTheDocument();
      expect(screen.getByText('Durée (minutes)')).toBeInTheDocument();
      expect(screen.getByText('Prix (€)')).toBeInTheDocument();
      expect(screen.getByText('Couleur')).toBeInTheDocument();
      expect(
        screen.getByText('Délai minimum de réservation (heures)')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Informations requises du client')
      ).toBeInTheDocument();
      expect(screen.getByText('Rappel par email')).toBeInTheDocument();
      expect(
        screen.getByText('Envoyer un rappel par email')
      ).toBeInTheDocument();
      expect(screen.getByText('Téléphone')).toBeInTheDocument();
      expect(screen.getByText('Adresse')).toBeInTheDocument();
      expect(screen.getByText('Champ personnalisé')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Annuler' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Créer' })).toBeInTheDocument();
    });
  });
});
