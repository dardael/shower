import { UpdateSocialNetworks } from '@/application/settings/UpdateSocialNetworks';
import { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';

describe('UpdateSocialNetworks', () => {
  let updateSocialNetworks: UpdateSocialNetworks;
  let mockRepository: jest.Mocked<SocialNetworkRepository>;

  beforeEach(() => {
    mockRepository = {
      getAllSocialNetworks: jest.fn(),
      updateSocialNetworks: jest.fn(),
      getSocialNetworkByType: jest.fn(),
    } as jest.Mocked<SocialNetworkRepository>;

    updateSocialNetworks = new UpdateSocialNetworks(mockRepository);
  });

  it('should update social networks through repository', async () => {
    const socialNetworks = [
      SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'Instagram'
      ),
    ];

    await updateSocialNetworks.execute(socialNetworks);

    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledWith(
      socialNetworks
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
    const socialNetwork = SocialNetwork.create(
      SocialNetworkType.INSTAGRAM,
      'https://instagram.com/test',
      'Instagram'
    );

    await updateSocialNetworks.execute([socialNetwork]);

    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledWith([
      socialNetwork,
    ]);
  });

  it('should pass social networks to repository without additional processing', async () => {
    const emailNetwork = SocialNetwork.create(
      SocialNetworkType.EMAIL,
      'mailto:test@example.com',
      'Email'
    );
    const phoneNetwork = SocialNetwork.create(
      SocialNetworkType.PHONE,
      'tel:0612345678',
      'Phone'
    );

    await updateSocialNetworks.execute([emailNetwork, phoneNetwork]);

    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateSocialNetworks).toHaveBeenCalledWith([
      emailNetwork,
      phoneNetwork,
    ]);
  });
});
