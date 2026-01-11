/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { NextRequest } from 'next/server';
import { GET, PUT } from '@/app/api/appointments/availability/route';
import { container } from '@/infrastructure/container';
import { Availability } from '@/domain/appointment/entities/Availability';
import { WeeklySlot } from '@/domain/appointment/value-objects/WeeklySlot';

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

function createMockAvailability(): Availability {
  return Availability.create({
    id: '1',
    weeklySlots: [
      WeeklySlot.create({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }),
    ],
    exceptions: [],
  });
}

describe('GET /api/appointments/availability', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return availability (admin only)', async () => {
    const mockAvailability = createMockAvailability();
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(mockAvailability),
    };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/availability'
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.weeklySlots).toBeDefined();
    expect(Array.isArray(body.weeklySlots)).toBe(true);
  });
});

describe('PUT /api/appointments/availability', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/availability',
      {
        method: 'PUT',
        body: { weeklySlots: [], exceptions: [] },
      }
    );
    const response = await PUT(request);

    expect(response.status).toBe(401);
  });

  it('should update availability', async () => {
    const mockAvailability = createMockAvailability();
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(mockAvailability),
    };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/availability',
      {
        method: 'PUT',
        body: {
          weeklySlots: [{ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }],
          exceptions: [],
        },
      }
    );
    const response = await PUT(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.weeklySlots).toBeDefined();
  });
});
