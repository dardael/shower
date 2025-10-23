import { UpdateSocialNetworks } from '@/application/settings/UpdateSocialNetworks';
import { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import type { ISocialNetworkUrlNormalizationService } from '@/domain/settings/services/ISocialNetworkUrlNormalizationService';

describe('UpdateSocialNetworks', () => {
  let updateSocialNetworks: UpdateSocialNetworks;
  let mockRepository: jest.Mocked<SocialNetworkRepository>;
  let mockNormalizationService: jest.Mocked<ISocialNetworkUrlNormalizationService>;

  beforeEach(() => {
    mockRepository = {
      getAllSocialNetworks: jest.fn().mockResolvedValue([]),
      updateSocialNetworks: jest.fn().mockResolvedValue(undefined),
      getSocialNetworkByType: jest.fn().mockResolvedValue(null),
    };

    mockNormalizationService = {
      normalizeUrl: jest.fn(),
      requiresNormalization: jest.fn(),
    };

    updateSocialNetworks = new UpdateSocialNetworks(
      mockRepository,
      mockNormalizationService
    );
  });

  it('should update social networks through repository', async () => {
    const socialNetworks = [
      SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'Instagram',
        true
      ),
      SocialNetwork.createDefault(SocialNetworkType.FACEBOOK),
    ];

    mockRepository.updateSocialNetworks.mockResolvedValue();
    mockNormalizationService.normalizeUrl.mockReturnValue(
      'https://instagram.com/test'
    );

    await updateSocialNetworks.execute(socialNetworks);

    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledTimes(1);
    expect(mockNormalizationService.normalizeUrl).toHaveBeenCalledWith(
      'https://instagram.com/test',
      SocialNetworkType.INSTAGRAM
    );
  });

  it('should handle repository errors', async () => {
    const socialNetworks = [
      SocialNetwork.createDefault(SocialNetworkType.INSTAGRAM),
    ];
    const error = new Error('Repository error');

    mockRepository.updateSocialNetworks.mockRejectedValue(error);

    await expect(updateSocialNetworks.execute(socialNetworks)).rejects.toThrow(
      'Repository error'
    );
    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledWith(
      socialNetworks
    );
  });

  it('should handle empty social networks array', async () => {
    mockRepository.updateSocialNetworks.mockResolvedValue();

    await updateSocialNetworks.execute([]);

    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledWith([]);
  });

  it('should handle single social network', async () => {
    const socialNetworks = [
      SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'Instagram',
        true
      ),
    ];
    mockRepository.updateSocialNetworks.mockResolvedValue();
    mockNormalizationService.normalizeUrl.mockReturnValue(
      'https://instagram.com/test'
    );

    await updateSocialNetworks.execute(socialNetworks);

    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledTimes(1);
    expect(mockNormalizationService.normalizeUrl).toHaveBeenCalledWith(
      'https://instagram.com/test',
      SocialNetworkType.INSTAGRAM
    );
  });

  it('should apply normalization to email and phone URLs', async () => {
    const emailNetwork = SocialNetwork.create(
      SocialNetworkType.EMAIL,
      'mailto:test@example.com',
      'Email',
      true
    );
    const phoneNetwork = SocialNetwork.create(
      SocialNetworkType.PHONE,
      'tel:+1234567890',
      'Phone',
      true
    );

    mockRepository.updateSocialNetworks.mockResolvedValue();
    mockNormalizationService.normalizeUrl
      .mockReturnValueOnce('mailto:test@example.com')
      .mockReturnValueOnce('tel:+1234567890');

    await updateSocialNetworks.execute([emailNetwork, phoneNetwork]);

    expect(mockNormalizationService.normalizeUrl).toHaveBeenCalledWith(
      'mailto:test@example.com',
      SocialNetworkType.EMAIL
    );
    expect(mockNormalizationService.normalizeUrl).toHaveBeenCalledWith(
      'tel:+1234567890',
      SocialNetworkType.PHONE
    );
    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledTimes(1);
  });
});
