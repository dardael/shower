/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/appointments/route';
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

describe('GET /api/appointments', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = createMockNextRequest('http://localhost/api/appointments');
    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('should return all appointments when authenticated', async () => {
    const mockAppointments = [
      Appointment.create({
        id: '1',
        activityId: 'activity-1',
        activityName: 'Consultation',
        activityDurationMinutes: 60,
        clientInfo: ClientInfo.create({
          name: 'Jean Dupont',
          email: 'jean@example.com',
        }),
        dateTime: new Date('2024-01-15T10:00:00Z'),
        status: AppointmentStatus.pending(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(mockAppointments),
    };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest('http://localhost/api/appointments');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(1);
  });
});

describe('POST /api/appointments', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue(null);
  });

  it('should return 400 when required fields are missing', async () => {
    const request = createMockNextRequest('http://localhost/api/appointments', {
      method: 'POST',
      body: { activityId: 'activity-1' },
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('Champs requis manquants');
  });

  it('should create appointment with valid data', async () => {
    const mockAppointment = Appointment.create({
      id: '1',
      activityId: 'activity-1',
      activityName: 'Consultation',
      activityDurationMinutes: 60,
      clientInfo: ClientInfo.create({
        name: 'Jean Dupont',
        email: 'jean@example.com',
      }),
      dateTime: new Date('2024-01-15T10:00:00Z'),
      status: AppointmentStatus.pending(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(mockAppointment),
    };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest('http://localhost/api/appointments', {
      method: 'POST',
      body: {
        activityId: 'activity-1',
        dateTime: '2024-01-15T10:00:00Z',
        clientInfo: { name: 'Jean Dupont', email: 'jean@example.com' },
      },
    });
    const response = await POST(request);

    expect(response.status).toBe(201);
  });
});
