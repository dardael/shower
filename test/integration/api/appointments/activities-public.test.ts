/**
 * Integration tests for public activities API
 * @jest-environment node
 */

// Mock the container
const mockResolve = jest.fn();
jest.mock('@/infrastructure/container', () => ({
  container: {
    resolve: mockResolve,
  },
}));

describe('GET /api/appointments/activities/public', () => {
  const mockActivities = [
    {
      id: 'activity-1',
      name: 'Consultation',
      description: 'Une consultation personnalisée',
      durationMinutes: 60,
      color: '#3182CE',
      price: 50,
      requiredFields: {
        fields: ['name', 'email'],
        toObject: () => ({ fields: ['name', 'email'] }),
      },
    },
    {
      id: 'activity-2',
      name: 'Massage',
      description: 'Massage relaxant',
      durationMinutes: 90,
      color: '#38A169',
      price: 80,
      requiredFields: {
        fields: ['name', 'email', 'phone'],
        toObject: () => ({ fields: ['name', 'email', 'phone'] }),
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of public activities', async () => {
    const mockGetAllActivities = {
      execute: jest.fn().mockResolvedValue(mockActivities),
    };
    mockResolve.mockReturnValue(mockGetAllActivities);

    const { GET } = await import(
      '@/app/api/appointments/activities/public/route'
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].name).toBe('Consultation');
    expect(data[1].name).toBe('Massage');
  });

  it('should return activity details including required fields', async () => {
    const mockGetAllActivities = {
      execute: jest.fn().mockResolvedValue(mockActivities),
    };
    mockResolve.mockReturnValue(mockGetAllActivities);

    const { GET } = await import(
      '@/app/api/appointments/activities/public/route'
    );

    const response = await GET();
    const data = await response.json();

    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('name');
    expect(data[0]).toHaveProperty('description');
    expect(data[0]).toHaveProperty('durationMinutes');
    expect(data[0]).toHaveProperty('price');
    expect(data[0]).toHaveProperty('color');
    expect(data[0]).toHaveProperty('requiredFields');
  });

  it('should return empty array when no activities exist', async () => {
    const mockGetAllActivities = {
      execute: jest.fn().mockResolvedValue([]),
    };
    mockResolve.mockReturnValue(mockGetAllActivities);

    const { GET } = await import(
      '@/app/api/appointments/activities/public/route'
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should handle errors gracefully', async () => {
    const mockGetAllActivities = {
      execute: jest.fn().mockRejectedValue(new Error('Database error')),
    };
    mockResolve.mockReturnValue(mockGetAllActivities);

    const { GET } = await import(
      '@/app/api/appointments/activities/public/route'
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Erreur lors de la récupération des activités');
  });
});
