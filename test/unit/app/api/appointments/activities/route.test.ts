/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/appointments/activities/route';
import { container } from '@/infrastructure/container';
import { Activity } from '@/domain/appointment/entities/Activity';
import { RequiredFieldsConfig } from '@/domain/appointment/value-objects/RequiredFieldsConfig';
import { ReminderSettings } from '@/domain/appointment/value-objects/ReminderSettings';

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

function createMockActivity(
  overrides?: Partial<{ id: string; name: string }>
): Activity {
  return Activity.create({
    id: overrides?.id || '1',
    name: overrides?.name || 'Consultation',
    description: 'Test activity',
    durationMinutes: 60,
    color: '#3182ce',
    price: 50,
    requiredFields: RequiredFieldsConfig.create({ fields: ['name', 'email'] }),
    reminderSettings: ReminderSettings.create({
      enabled: true,
      hoursBefore: 24,
    }),
    minimumBookingNoticeHours: 2,
  });
}

describe('GET /api/appointments/activities', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return all activities (admin only)', async () => {
    const mockActivities = [
      createMockActivity({ id: '1', name: 'Consultation' }),
    ];
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(mockActivities),
    };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/activities'
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(1);
    expect(body[0].name).toBe('Consultation');
  });

  it('should return empty array when no activities', async () => {
    const mockUseCase = { execute: jest.fn().mockResolvedValue([]) };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/activities'
    );
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([]);
  });
});

describe('POST /api/appointments/activities', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/activities',
      {
        method: 'POST',
        body: { name: 'Test', durationMinutes: 60 },
      }
    );
    const response = await POST(request);

    expect(response.status).toBe(401);
  });

  it('should return 400 when required fields are missing', async () => {
    const request = createMockNextRequest(
      'http://localhost/api/appointments/activities',
      {
        method: 'POST',
        body: { name: 'Test' },
      }
    );
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('durationMinutes');
    expect(body.error).toContain('color');
  });

  it('should create activity with valid data', async () => {
    const mockActivity = createMockActivity({ id: '1', name: 'New Activity' });
    const mockUseCase = { execute: jest.fn().mockResolvedValue(mockActivity) };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/activities',
      {
        method: 'POST',
        body: {
          name: 'New Activity',
          durationMinutes: 60,
          color: '#3182ce',
          minimumBookingNoticeHours: 2,
        },
      }
    );
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.name).toBe('New Activity');
  });
});
