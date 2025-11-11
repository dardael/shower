import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { SocialNetworkTypeValueObject } from '@/domain/settings/value-objects/SocialNetworkType';
import { SocialNetworkUrl } from '@/domain/settings/value-objects/SocialNetworkUrl';
import { SocialNetworkLabel } from '@/domain/settings/value-objects/SocialNetworkLabel';
import { Logger } from '@/application/shared/Logger';

// Mock the SocialNetworkModel
const mockSocialNetworkModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  deleteMany: jest.fn(),
  insertMany: jest.fn(),
};

jest.mock('@/infrastructure/settings/models/SocialNetworkModel', () => ({
  SocialNetworkModel: mockSocialNetworkModel,
}));

import { MongooseSocialNetworkRepository } from '@/infrastructure/settings/repositories/MongooseSocialNetworkRepository';

describe('MongooseSocialNetworkRepository', () => {
  let repository: MongooseSocialNetworkRepository;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock logger
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      logApiRequest: jest.fn(),
      logApiResponse: jest.fn(),
      logError: jest.fn(),
      logSecurity: jest.fn(),
      logUserAction: jest.fn(),
      logBusinessEvent: jest.fn(),
      startTimer: jest.fn(),
      endTimer: jest.fn(),
      measure: jest.fn(),
      withContext: jest.fn(),
      logIf: jest.fn(),
      debugIf: jest.fn(),
      batch: jest.fn(),
      execute: jest.fn(),
      logErrorWithObject: jest.fn(),
      setPerformanceThreshold: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    // Create repository instance with mocked logger
    repository = new MongooseSocialNetworkRepository(mockLogger);
  });

  describe('getAllSocialNetworks', () => {
    it('should return empty array when no social networks exist', async () => {
      mockSocialNetworkModel.find.mockResolvedValue([]);

      const result = await repository.getAllSocialNetworks();

      expect(mockSocialNetworkModel.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return social networks when documents exist', async () => {
      const mockDocs = [
        {
          type: SocialNetworkType.FACEBOOK,
          url: 'https://facebook.com/test',
          label: 'Facebook',
          enabled: true,
        },
        {
          type: SocialNetworkType.INSTAGRAM,
          url: 'https://instagram.com/test',
          label: 'Instagram',
          enabled: false,
        },
      ];

      mockSocialNetworkModel.find.mockResolvedValue(mockDocs);

      const result = await repository.getAllSocialNetworks();

      expect(mockSocialNetworkModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);

      expect(result[0]).toBeInstanceOf(SocialNetwork);
      expect(result[0].type.value).toBe(SocialNetworkType.FACEBOOK);
      expect(result[0].url.value).toBe('https://facebook.com/test');
      expect(result[0].label.value).toBe('Facebook');
      expect(result[0].enabled).toBe(true);

      expect(result[1]).toBeInstanceOf(SocialNetwork);
      expect(result[1].type.value).toBe(SocialNetworkType.INSTAGRAM);
      expect(result[1].url.value).toBe('https://instagram.com/test');
      expect(result[1].label.value).toBe('Instagram');
      expect(result[1].enabled).toBe(false);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockSocialNetworkModel.find.mockRejectedValue(error);

      await expect(repository.getAllSocialNetworks()).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should handle invalid social network data', async () => {
      const mockDocs = [
        {
          type: SocialNetworkType.FACEBOOK,
          url: 'invalid-url',
          label: 'Facebook',
          enabled: true,
        },
      ];

      mockSocialNetworkModel.find.mockResolvedValue(mockDocs);

      await expect(repository.getAllSocialNetworks()).rejects.toThrow(
        'Invalid social network data'
      );

      expect(mockLogger.logErrorWithObject).toHaveBeenCalledWith(
        expect.any(Error),
        'Invalid social network data found in database',
        {
          socialNetworkType: SocialNetworkType.FACEBOOK,
          url: 'invalid-url',
          label: 'Facebook',
          enabled: true,
        }
      );
    });
  });

  describe('updateSocialNetworks', () => {
    it('should clear existing social networks and insert new ones', async () => {
      const socialNetworks = [
        new SocialNetwork(
          new SocialNetworkTypeValueObject(SocialNetworkType.INSTAGRAM),
          SocialNetworkUrl.fromString(
            'https://instagram.com/test',
            SocialNetworkType.INSTAGRAM
          ),
          SocialNetworkLabel.fromString('Instagram'),
          true
        ),
      ];

      mockSocialNetworkModel.deleteMany.mockResolvedValue({ deletedCount: 1 });
      mockSocialNetworkModel.insertMany.mockResolvedValue([]);

      await repository.updateSocialNetworks(socialNetworks);

      expect(mockSocialNetworkModel.deleteMany).toHaveBeenCalledWith({});
      expect(mockSocialNetworkModel.insertMany).toHaveBeenCalledWith([
        {
          type: SocialNetworkType.INSTAGRAM,
          url: 'https://instagram.com/test',
          label: 'Instagram',
          enabled: true,
        },
      ]);
    });

    it('should handle empty social networks array', async () => {
      mockSocialNetworkModel.deleteMany.mockResolvedValue({ deletedCount: 2 });

      await repository.updateSocialNetworks([]);

      expect(mockSocialNetworkModel.deleteMany).toHaveBeenCalledWith({});
      expect(mockSocialNetworkModel.insertMany).not.toHaveBeenCalled();
    });

    it('should handle database errors during delete', async () => {
      const error = new Error('Delete failed');
      mockSocialNetworkModel.deleteMany.mockRejectedValue(error);

      const socialNetworks = [
        new SocialNetwork(
          new SocialNetworkTypeValueObject(SocialNetworkType.FACEBOOK),
          SocialNetworkUrl.fromString(
            'https://facebook.com/test',
            SocialNetworkType.FACEBOOK
          ),
          SocialNetworkLabel.fromString('Facebook'),
          true
        ),
      ];

      await expect(
        repository.updateSocialNetworks(socialNetworks)
      ).rejects.toThrow('Delete failed');
    });

    it('should handle database errors during insert', async () => {
      const error = new Error('Insert failed');
      mockSocialNetworkModel.deleteMany.mockResolvedValue({ deletedCount: 1 });
      mockSocialNetworkModel.insertMany.mockRejectedValue(error);

      const socialNetworks = [
        new SocialNetwork(
          new SocialNetworkTypeValueObject(SocialNetworkType.FACEBOOK),
          SocialNetworkUrl.fromString(
            'https://facebook.com/test',
            SocialNetworkType.FACEBOOK
          ),
          SocialNetworkLabel.fromString('Facebook'),
          true
        ),
      ];

      await expect(
        repository.updateSocialNetworks(socialNetworks)
      ).rejects.toThrow('Insert failed');
    });
  });

  describe('getSocialNetworkByType', () => {
    it('should return social network when found', async () => {
      const mockDoc = {
        type: SocialNetworkType.LINKEDIN,
        url: 'https://linkedin.com/in/test',
        label: 'LinkedIn',
        enabled: true,
      };

      mockSocialNetworkModel.findOne.mockResolvedValue(mockDoc);

      const result = await repository.getSocialNetworkByType(
        SocialNetworkType.LINKEDIN
      );

      expect(mockSocialNetworkModel.findOne).toHaveBeenCalledWith({
        type: SocialNetworkType.LINKEDIN,
      });

      expect(result).toBeInstanceOf(SocialNetwork);
      expect(result!.type.value).toBe(SocialNetworkType.LINKEDIN);
      expect(result!.url.value).toBe('https://linkedin.com/in/test');
      expect(result!.label.value).toBe('LinkedIn');
      expect(result!.enabled).toBe(true);
    });

    it('should return null when social network not found', async () => {
      mockSocialNetworkModel.findOne.mockResolvedValue(null);

      const result = await repository.getSocialNetworkByType(
        SocialNetworkType.EMAIL
      );

      expect(mockSocialNetworkModel.findOne).toHaveBeenCalledWith({
        type: SocialNetworkType.EMAIL,
      });
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database query failed');
      mockSocialNetworkModel.findOne.mockRejectedValue(error);

      await expect(
        repository.getSocialNetworkByType(SocialNetworkType.PHONE)
      ).rejects.toThrow('Database query failed');
    });

    it('should handle invalid social network data', async () => {
      const mockDoc = {
        type: SocialNetworkType.FACEBOOK,
        url: 'invalid-url',
        label: 'Facebook',
        enabled: true,
      };

      mockSocialNetworkModel.findOne.mockResolvedValue(mockDoc);

      await expect(
        repository.getSocialNetworkByType(SocialNetworkType.FACEBOOK)
      ).rejects.toThrow('Invalid social network data');

      expect(mockLogger.logErrorWithObject).toHaveBeenCalledWith(
        expect.any(Error),
        'Invalid social network data found in database',
        {
          socialNetworkType: SocialNetworkType.FACEBOOK,
          url: 'invalid-url',
          label: 'Facebook',
          enabled: true,
        }
      );
    });
  });
});
