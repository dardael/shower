/**
 * Integration tests for appointment booking creation
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

const mockResolve = jest.fn();
jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: mockResolve,
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

jest.mock('@/infrastructure/auth/BetterAuthInstance', () => ({
  auth: {
    api: {
      getSession: jest.fn().mockResolvedValue(null),
    },
  },
}));

jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue(new Headers()),
}));

describe('POST /api/appointments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create appointment with valid data', async () => {
    const mockAppointment = {
      id: 'apt-1',
      activityId: 'activity-1',
      activityName: 'Consultation',
      activityDurationMinutes: 60,
      dateTime: new Date('2024-01-16T10:00:00.000Z'),
      endDateTime: new Date('2024-01-16T11:00:00.000Z'),
      status: { value: 'pending' },
      createdAt: new Date(),
      updatedAt: new Date(),
      clientInfo: {
        toObject: () => ({
          name: 'Jean Dupont',
          email: 'jean@example.com',
        }),
      },
    };

    const mockCreateAppointment = {
      execute: jest.fn().mockResolvedValue(mockAppointment),
    };
    mockResolve.mockReturnValue(mockCreateAppointment);

    const { POST } = await import('@/app/api/appointments/route');

    const request = new NextRequest('http://localhost/api/appointments', {
      method: 'POST',
    });
    jest.spyOn(request, 'json').mockResolvedValue({
      activityId: 'activity-1',
      dateTime: '2024-01-16T10:00:00.000Z',
      clientInfo: { name: 'Jean Dupont', email: 'jean@example.com' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe('apt-1');
  });

  it('should return 400 when required fields are missing', async () => {
    const { POST } = await import('@/app/api/appointments/route');

    const request = new NextRequest('http://localhost/api/appointments', {
      method: 'POST',
    });
    jest.spyOn(request, 'json').mockResolvedValue({
      activityId: 'activity-1',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Champs requis manquants');
  });
});
