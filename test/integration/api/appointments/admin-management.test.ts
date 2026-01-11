/**
 * Integration tests for admin appointment management API
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

describe('GET /api/appointments', () => {
  const mockAppointments = [
    {
      id: 'apt-1',
      activityId: 'activity-1',
      activityName: 'Consultation',
      activityDurationMinutes: 60,
      dateTime: new Date('2024-01-16T10:00:00.000Z'),
      endDateTime: new Date('2024-01-16T11:00:00.000Z'),
      status: { value: 'pending' },
      createdAt: new Date('2024-01-15T10:00:00.000Z'),
      updatedAt: new Date('2024-01-15T10:00:00.000Z'),
      clientInfo: {
        name: 'Jean Dupont',
        email: 'jean@example.com',
        toObject: () => ({
          name: 'Jean Dupont',
          email: 'jean@example.com',
        }),
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({
      session: { userId: 'admin-1' },
      user: { id: 'admin-1', email: 'admin@example.com' },
    });
  });

  it('should return list of appointments for admin', async () => {
    const mockGetAllAppointments = {
      execute: jest.fn().mockResolvedValue(mockAppointments),
    };
    mockResolve.mockReturnValue(mockGetAllAppointments);

    const { GET } = await import('@/app/api/appointments/route');

    const request = new NextRequest('http://localhost/api/appointments', {
      method: 'GET',
    });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should handle errors gracefully', async () => {
    const mockGetAllAppointments = {
      execute: jest.fn().mockRejectedValue(new Error('Database error')),
    };
    mockResolve.mockReturnValue(mockGetAllAppointments);

    const { GET } = await import('@/app/api/appointments/route');

    const request = new NextRequest('http://localhost/api/appointments', {
      method: 'GET',
    });
    const response = await GET(request);

    expect(response.status).toBe(500);
  });
});
