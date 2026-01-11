/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/appointments/calendar/route';
import { container } from '@/infrastructure/container';

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

function createMockNextRequest(url: string): NextRequest {
  return new NextRequest(url, { method: 'GET' });
}

describe('GET /api/appointments/calendar', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/calendar?start=2024-01-01&end=2024-01-31'
    );
    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('should return 400 when start/end parameters are missing', async () => {
    const request = createMockNextRequest(
      'http://localhost/api/appointments/calendar'
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Les paramètres start et end sont requis');
  });

  it('should return calendar events', async () => {
    const mockAppointments = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Consultation',
        dateTime: new Date('2024-01-15T10:00:00Z'),
        endDateTime: new Date('2024-01-15T11:00:00Z'),
        clientInfo: {
          toObject: () => ({ name: 'Jean Dupont', email: 'jean@example.com' }),
        },
        status: { value: 'confirmed' },
      },
    ];

    mockContainer.resolve.mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(mockAppointments),
    }));

    const request = createMockNextRequest(
      'http://localhost/api/appointments/calendar?start=2024-01-01&end=2024-01-31'
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });
});
