import { GetConfiguredSocialNetworks } from '@/application/settings/GetConfiguredSocialNetworks';
import { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { Logger } from '@/application/shared/Logger';

describe('GetConfiguredSocialNetworks', () => {
  let getConfiguredSocialNetworks: GetConfiguredSocialNetworks;
  let mockRepository: jest.Mocked<SocialNetworkRepository>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockRepository = {
      getAllSocialNetworks: jest.fn(),
      updateSocialNetworks: jest.fn(),
      getSocialNetworkByType: jest.fn(),
    } as jest.Mocked<SocialNetworkRepository>;

    mockLogger = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      logApiRequest: jest.fn(),
      logApiResponse: jest.fn(),
      logError: jest.fn(),
      logSecurity: jest.fn(),
      logUserAction: jest.fn(),
      logBusinessEvent: jest.fn(),
      logSystemEvent: jest.fn(),
      startTimer: jest.fn(),
      endTimer: jest.fn(),
      measure: jest.fn(),
      logIf: jest.fn(),
      debugIf: jest.fn(),
      batch: jest.fn(),
      withContext: jest.fn().mockReturnThis(),
      execute: jest.fn(),
      child: jest.fn(),
      getPerformanceMonitor: jest.fn(),
      getPerformanceStatistics: jest.fn(),
      setPerformanceThreshold: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    getConfiguredSocialNetworks = new GetConfiguredSocialNetworks(
      mockRepository,
      mockLogger
    );
  });

  it('should return only configured social networks', async () => {
    // Arrange
    const allSocialNetworks = [
      SocialNetwork.createDefault(SocialNetworkType.INSTAGRAM)
        .updateUrl('https://instagram.com/test')
        .enable(),
      SocialNetwork.createDefault(SocialNetworkType.FACEBOOK).disable(), // Disabled
      SocialNetwork.createDefault(SocialNetworkType.LINKEDIN).enable(), // Enabled but no URL
      SocialNetwork.createDefault(SocialNetworkType.EMAIL)
        .updateUrl('mailto:test@example.com')
        .enable(),
    ];

    mockRepository.getAllSocialNetworks.mockResolvedValue(allSocialNetworks);

    // Act
    const result = await getConfiguredSocialNetworks.execute();

    // Assert
    expect(result).toHaveLength(2); // Only Instagram and Email are configured
    expect(result[0].type.value).toBe('instagram');
    expect(result[1].type.value).toBe('email');
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Getting configured social networks',
      { operation: 'GetConfiguredSocialNetworks.execute' }
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Retrieved configured social networks',
      {
        count: 2,
        totalCount: 4,
        operation: 'GetConfiguredSocialNetworks.execute',
      }
    );
  });

  it('should return empty array when no social networks are configured', async () => {
    // Arrange
    const allSocialNetworks = [
      SocialNetwork.createDefault(SocialNetworkType.FACEBOOK).disable(),
      SocialNetwork.createDefault(SocialNetworkType.LINKEDIN).enable(), // No URL
    ];

    mockRepository.getAllSocialNetworks.mockResolvedValue(allSocialNetworks);

    // Act
    const result = await getConfiguredSocialNetworks.execute();

    // Assert
    expect(result).toHaveLength(0);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Retrieved configured social networks',
      {
        count: 0,
        totalCount: 2,
        operation: 'GetConfiguredSocialNetworks.execute',
      }
    );
  });

  it('should handle repository errors', async () => {
    // Arrange
    const error = new Error('Database connection failed');
    mockRepository.getAllSocialNetworks.mockRejectedValue(error);

    // Act & Assert
    await expect(getConfiguredSocialNetworks.execute()).rejects.toThrow(
      'Database connection failed'
    );
    expect(mockLogger.logError).toHaveBeenCalledWith(
      error,
      'Failed to get configured social networks',
      { operation: 'GetConfiguredSocialNetworks.execute' }
    );
  });

  it('should handle empty repository result', async () => {
    // Arrange
    mockRepository.getAllSocialNetworks.mockResolvedValue([]);

    // Act
    const result = await getConfiguredSocialNetworks.execute();

    // Assert
    expect(result).toHaveLength(0);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Retrieved configured social networks',
      {
        count: 0,
        totalCount: 0,
        operation: 'GetConfiguredSocialNetworks.execute',
      }
    );
  });

  it('should include all types of configured social networks', async () => {
    // Arrange
    const allSocialNetworks = [
      SocialNetwork.createDefault(SocialNetworkType.INSTAGRAM)
        .updateUrl('https://instagram.com/test')
        .enable(),
      SocialNetwork.createDefault(SocialNetworkType.FACEBOOK)
        .updateUrl('https://facebook.com/test')
        .enable(),
      SocialNetwork.createDefault(SocialNetworkType.LINKEDIN)
        .updateUrl('https://linkedin.com/in/test')
        .enable(),
      SocialNetwork.createDefault(SocialNetworkType.EMAIL)
        .updateUrl('mailto:test@example.com')
        .enable(),
      SocialNetwork.createDefault(SocialNetworkType.PHONE)
        .updateUrl('tel:+1234567890')
        .enable(),
    ];

    mockRepository.getAllSocialNetworks.mockResolvedValue(allSocialNetworks);

    // Act
    const result = await getConfiguredSocialNetworks.execute();

    // Assert
    expect(result).toHaveLength(5);
    const types = result.map((network) => network.type.value);
    expect(types).toContain('instagram');
    expect(types).toContain('facebook');
    expect(types).toContain('linkedin');
    expect(types).toContain('email');
    expect(types).toContain('phone');
  });
});
