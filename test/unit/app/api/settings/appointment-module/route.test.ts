/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/settings/appointment-module/route';
import { container } from '@/infrastructure/container';
import { AppointmentModuleEnabled } from '@/domain/appointment/value-objects/AppointmentModuleEnabled';

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

function createMockNextRequest(): NextRequest {
  return new NextRequest(
    'http://localhost:3000/api/settings/appointment-module',
    { method: 'GET' }
  );
}

describe('GET /api/settings/appointment-module', () => {
  const mockContainer = container as jest.Mocked<typeof container>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return enabled: true when module is enabled', async () => {
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(AppointmentModuleEnabled.enabled()),
    };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest();
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ enabled: true });
  });

  it('should return enabled: false when module is disabled', async () => {
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(AppointmentModuleEnabled.disabled()),
    };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest();
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ enabled: false });
  });

  it('should return 500 when use case throws error', async () => {
    const mockUseCase = {
      execute: jest.fn().mockRejectedValue(new Error('Database error')),
    };
    mockContainer.resolve.mockReturnValue(mockUseCase);

    const request = createMockNextRequest();
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Internal server error');
    expect(body.details).toBe('Database error');
  });
});
