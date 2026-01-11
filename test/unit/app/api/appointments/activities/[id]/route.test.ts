/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from '@/app/api/appointments/activities/[id]/route';
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

describe('GET /api/appointments/activities/[id]', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return 404 when activity not found', async () => {
    const mockUseCase = { execute: jest.fn().mockResolvedValue(null) };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/activities/1'
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe('Activité non trouvée');
  });

  it('should return activity when found (admin only)', async () => {
    const mockActivity = createMockActivity({ id: '1' });
    const mockUseCase = { execute: jest.fn().mockResolvedValue(mockActivity) };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/activities/1'
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toBe('1');
  });
});

describe('PUT /api/appointments/activities/[id]', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/activities/1',
      {
        method: 'PUT',
        body: { name: 'Updated' },
      }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(401);
  });

  it('should update activity', async () => {
    const mockActivity = createMockActivity({ id: '1', name: 'Updated' });
    const mockUseCase = { execute: jest.fn().mockResolvedValue(mockActivity) };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/activities/1',
      {
        method: 'PUT',
        body: {
          name: 'Updated',
          durationMinutes: 60,
          color: '#3182ce',
          minimumBookingNoticeHours: 2,
        },
      }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: '1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.name).toBe('Updated');
  });
});

describe('DELETE /api/appointments/activities/[id]', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ user: { id: '1' } });
  });

  it('should return 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/activities/1',
      {
        method: 'DELETE',
      }
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(401);
  });

  it('should delete activity and return 204', async () => {
    const mockUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest(
      'http://localhost/api/appointments/activities/1',
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
