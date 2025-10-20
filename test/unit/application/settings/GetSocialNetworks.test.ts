import { GetSocialNetworks } from '@/application/settings/GetSocialNetworks';
import { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';

describe('GetSocialNetworks', () => {
  let getSocialNetworks: GetSocialNetworks;
  let mockRepository: jest.Mocked<SocialNetworkRepository>;

  beforeEach(() => {
    mockRepository = {
      getAllSocialNetworks: jest.fn().mockResolvedValue([]),
      updateSocialNetworks: jest.fn().mockResolvedValue(undefined),
      getSocialNetworkByType: jest.fn().mockResolvedValue(null),
    };

    getSocialNetworks = new GetSocialNetworks(mockRepository);
  });

  it('should return social networks from repository', async () => {
    const expectedSocialNetworks = [
      SocialNetwork.createDefault(SocialNetworkType.INSTAGRAM),
      SocialNetwork.createDefault(SocialNetworkType.FACEBOOK),
    ];

    mockRepository.getAllSocialNetworks.mockResolvedValue(
      expectedSocialNetworks
    );

    const result = await getSocialNetworks.execute();

    expect(mockRepository.getAllSocialNetworks).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedSocialNetworks);
  });

  it('should handle repository errors', async () => {
    const error = new Error('Repository error');
    mockRepository.getAllSocialNetworks.mockRejectedValue(error);

    await expect(getSocialNetworks.execute()).rejects.toThrow(
      'Repository error'
    );
    expect(mockRepository.getAllSocialNetworks).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when repository returns empty', async () => {
    mockRepository.getAllSocialNetworks.mockResolvedValue([]);

    const result = await getSocialNetworks.execute();

    expect(result).toEqual([]);
    expect(mockRepository.getAllSocialNetworks).toHaveBeenCalledTimes(1);
  });
});
