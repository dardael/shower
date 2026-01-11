/**
 * Integration tests for concurrent appointment booking
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

describe('Concurrent booking handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle slot conflict gracefully', async () => {
    const mockCreateAppointment = {
      execute: jest.fn().mockRejectedValue(new Error('Créneau déjà réservé')),
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

    expect(response.status).toBe(400);
  });
});
