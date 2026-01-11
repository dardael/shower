/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { NextRequest } from 'next/server';
import { GET, PATCH, DELETE } from '@/app/api/appointments/[id]/route';
import { container } from '@/infrastructure/container';
import { Appointment } from '@/domain/appointment/entities/Appointment';
import { AppointmentStatus } from '@/domain/appointment/value-objects/AppointmentStatus';
import { ClientInfo } from '@/domain/appointment/value-objects/ClientInfo';

jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: jest.fn(),
  },
}));

jest.mock('@/infrastructure/shared/databaseConnection', () => ({
  DatabaseConnection: {
    getInstance: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue(undefined),
    }),
  },
}));

jest.mock('@/application/shared/Logger', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    logErrorWithObject: jest.fn(),
  })),
}));

const mockGetSession = jest.fn();
jest.mock('@/infrastructure/auth/ApiAuthentication', () => ({
  authenticateRequest: jest.fn().mockImplementation(async () => {
    const session = await mockGetSession();
    if (!session) {
      const { NextResponse } = await import('next/server');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    return null;
  }),
}));

jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue(new Headers()),
}));

function createMockNextRequest(
  url: string,
  options?: { method?: string; body?: unknown }
): NextRequest {
  const request = new NextRequest(url, {
    method: options?.method || 'GET',
  });
  if (options?.body) {
    jest.spyOn(request, 'json').mockResolvedValue(options.body);
  }
  return request;
}

function createMockAppointment(
  overrides?: Partial<{
    id: string;
    status: AppointmentStatus;
  }>
): Appointment {
  return Appointment.create({
    id: overrides?.id || '1',
    activityId: 'activity-1',
    activityName: 'Consultation',
    activityDurationMinutes: 60,
    clientInfo: ClientInfo.create({
      name: 'Jean Dupont',
      email: 'jean@example.com',
    }),
    dateTime: new Date('2024-01-15T10:00:00Z'),
    status: overrides?.status || AppointmentStatus.pending(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

describe('GET /api/appointments/[id]', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/1'
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(401);
  });

  it('should return 404 when appointment not found', async () => {
    const mockUseCase = { execute: jest.fn().mockResolvedValue(null) };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/1'
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe('Rendez-vous non trouvé');
  });

  it('should return appointment when found', async () => {
    const mockAppointment = createMockAppointment({ id: '1' });
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(mockAppointment),
    };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/1'
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toBe('1');
  });
});

describe('PATCH /api/appointments/[id]', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/1',
      {
        method: 'PATCH',
        body: { action: 'confirm' },
      }
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(401);
  });

  it('should confirm appointment', async () => {
    const mockAppointment = createMockAppointment({
      id: '1',
      status: AppointmentStatus.confirmed(),
    });
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(mockAppointment),
    };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/1',
      {
        method: 'PATCH',
        body: { action: 'confirm' },
      }
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('confirmed');
  });

  it('should cancel appointment', async () => {
    const mockAppointment = createMockAppointment({
      id: '1',
      status: AppointmentStatus.cancelled(),
    });
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(mockAppointment),
    };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/1',
      {
        method: 'PATCH',
        body: { action: 'cancel' },
      }
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('cancelled');
  });

  it('should return 400 for invalid action', async () => {
    const request = createMockNextRequest(
      'http://localhost/api/appointments/1',
      {
        method: 'PATCH',
        body: { action: 'invalid' },
      }
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Action invalide');
  });
});

describe('DELETE /api/appointments/[id]', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/1',
      {
        method: 'DELETE',
      }
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(401);
  });

  it('should delete appointment and return 204', async () => {
    const mockUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/1',
      {
        method: 'DELETE',
      }
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(204);
  });
});
