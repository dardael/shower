import {
  validateEnvironment,
  isTestEnvironment,
  isDevelopmentEnvironment,
  isProductionEnvironment,
} from '@/infrastructure/shared/utils/envValidation';

describe('envValidation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('validateEnvironment', () => {
    it('should return development when SHOWER_ENV is development', () => {
      process.env.SHOWER_ENV = 'development';

      const result = validateEnvironment();

      expect(result).toBe('development');
    });

    it('should return production when SHOWER_ENV is production', () => {
      process.env.SHOWER_ENV = 'production';

      const result = validateEnvironment();

      expect(result).toBe('production');
    });

    it('should return test when SHOWER_ENV is test', () => {
      process.env.SHOWER_ENV = 'test';

      const result = validateEnvironment();

      expect(result).toBe('test');
    });

    it('should throw error for invalid environment', () => {
      (process.env as { [key: string]: string | undefined }).SHOWER_ENV =
        'invalid';

      expect(() => validateEnvironment()).toThrow(
        'Invalid environment: invalid. Must be one of: development, production, test'
      );
    });

    it('should validate environment type at runtime', () => {
      process.env.SHOWER_ENV = 'development';

      const result = validateEnvironment();

      expect(['development', 'production', 'test']).toContain(result);
    });
  });

  describe('isTestEnvironment', () => {
    it('should return true when environment is test', () => {
      process.env.SHOWER_ENV = 'test';

      const result = isTestEnvironment();

      expect(result).toBe(true);
    });

    it('should return false when environment is development', () => {
      process.env.SHOWER_ENV = 'development';

      const result = isTestEnvironment();

      expect(result).toBe(false);
    });

    it('should return false when environment is production', () => {
      process.env.SHOWER_ENV = 'production';

      const result = isTestEnvironment();

      expect(result).toBe(false);
    });
  });

  describe('isDevelopmentEnvironment', () => {
    it('should return true when environment is development', () => {
      process.env.SHOWER_ENV = 'development';

      const result = isDevelopmentEnvironment();

      expect(result).toBe(true);
    });

    it('should return false when environment is test', () => {
      process.env.SHOWER_ENV = 'test';

      const result = isDevelopmentEnvironment();

      expect(result).toBe(false);
    });

    it('should return false when environment is production', () => {
      process.env.SHOWER_ENV = 'production';

      const result = isDevelopmentEnvironment();

      expect(result).toBe(false);
    });
  });

  describe('isProductionEnvironment', () => {
    it('should return true when environment is production', () => {
      process.env.SHOWER_ENV = 'production';

      const result = isProductionEnvironment();

      expect(result).toBe(true);
    });

    it('should return false when environment is development', () => {
      process.env.SHOWER_ENV = 'development';

      const result = isProductionEnvironment();

      expect(result).toBe(false);
    });

    it('should return false when environment is test', () => {
      process.env.SHOWER_ENV = 'test';

      const result = isProductionEnvironment();

      expect(result).toBe(false);
    });
  });
});
