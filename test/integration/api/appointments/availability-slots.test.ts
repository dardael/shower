/**
 * Integration tests for availability slots API
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

describe('GET /api/appointments/availability/slots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return available slots for valid request', async () => {
    const mockSlots = [
      {
        startTime: new Date('2024-01-16T09:00:00Z'),
        endTime: new Date('2024-01-16T10:00:00Z'),
      },
    ];
    const mockGetAvailableSlots = {
      execute: jest.fn().mockResolvedValue(mockSlots),
    };
    mockResolve.mockReturnValue(mockGetAvailableSlots);

    const { GET } = await import(
      '@/app/api/appointments/availability/slots/route'
    );

    const request = new NextRequest(
      'http://localhost/api/appointments/availability/slots?activityId=activity-1&date=2024-01-16',
      { method: 'GET' }
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('should return 400 when activityId is missing', async () => {
    const { GET } = await import(
      '@/app/api/appointments/availability/slots/route'
    );

    const request = new NextRequest(
      'http://localhost/api/appointments/availability/slots?date=2024-01-16',
      { method: 'GET' }
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('activityId');
  });
});
