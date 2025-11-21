import { GetSocialNetworks } from '@/application/settings/GetSocialNetworks';
import { SocialNetworkRepository } from '@/domain/settings/repositories/SocialNetworkRepository';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';
import { SocialNetworkType } from '@/domain/settings/value-objects/SocialNetworkType';
import { SocialNetworkFactory } from '@/application/settings/SocialNetworkFactory';

describe('GetSocialNetworks', () => {
  let getSocialNetworks: GetSocialNetworks;
  let mockRepository: jest.Mocked<SocialNetworkRepository>;
  let mockFactory: jest.Mocked<SocialNetworkFactory>;

  beforeEach(() => {
    mockRepository = {
      getAllSocialNetworks: jest.fn().mockResolvedValue([]),
      updateSocialNetworks: jest.fn().mockResolvedValue(undefined),
      getSocialNetworkByType: jest.fn().mockResolvedValue(null),
    };

    mockFactory = {
      createDefault: jest.fn(),
      createAllDefaults: jest.fn().mockReturnValue([]),
      create: jest.fn(),
      clearCache: jest.fn(),
    };

    getSocialNetworks = new GetSocialNetworks(mockRepository, mockFactory);
  });

  it('should return social networks from repository when all types exist', async () => {
    const existingSocialNetworks = [
      SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/test',
        'Test Instagram',
        true
      ),
      SocialNetwork.create(
        SocialNetworkType.FACEBOOK,
        'https://facebook.com/test',
        'Test Facebook',
        true
      ),
      SocialNetwork.createDefault(SocialNetworkType.LINKEDIN),
      SocialNetwork.createDefault(SocialNetworkType.EMAIL),
      SocialNetwork.createDefault(SocialNetworkType.PHONE),
    ];

    const allDefaults = [
      SocialNetwork.createDefault(SocialNetworkType.INSTAGRAM),
      SocialNetwork.createDefault(SocialNetworkType.FACEBOOK),
      SocialNetwork.createDefault(SocialNetworkType.LINKEDIN),
      SocialNetwork.createDefault(SocialNetworkType.EMAIL),
      SocialNetwork.createDefault(SocialNetworkType.PHONE),
    ];

    mockRepository.getAllSocialNetworks.mockResolvedValue(
      existingSocialNetworks
    );
    mockFactory.createAllDefaults.mockReturnValue(allDefaults);

    const result = await getSocialNetworks.execute();

    expect(mockRepository.getAllSocialNetworks).toHaveBeenCalledTimes(1);
    expect(mockFactory.createAllDefaults).toHaveBeenCalledTimes(1);

    // Should return all 5 social networks, preserving existing data
    expect(result).toHaveLength(5);

    // Should preserve existing Instagram data
    const instagramResult = result.find(
      (sn) => sn.type.value === SocialNetworkType.INSTAGRAM
    );
    expect(instagramResult?.url.value).toBe('https://instagram.com/test');
    expect(instagramResult?.label.value).toBe('Test Instagram');
    expect(instagramResult?.enabled).toBe(true);

    // Should preserve existing Facebook data
    const facebookResult = result.find(
      (sn) => sn.type.value === SocialNetworkType.FACEBOOK
    );
    expect(facebookResult?.url.value).toBe('https://facebook.com/test');
    expect(facebookResult?.label.value).toBe('Test Facebook');
    expect(facebookResult?.enabled).toBe(true);

    // Should include default LinkedIn
    const linkedinResult = result.find(
      (sn) => sn.type.value === SocialNetworkType.LINKEDIN
    );
    expect(linkedinResult?.url.value).toBe('');
    expect(linkedinResult?.label.value).toBe('LinkedIn');
    expect(linkedinResult?.enabled).toBe(false);
  });

  it('should handle repository errors', async () => {
    const error = new Error('Repository error');
    mockRepository.getAllSocialNetworks.mockRejectedValue(error);

    await expect(getSocialNetworks.execute()).rejects.toThrow(
      'Repository error'
    );
    expect(mockRepository.getAllSocialNetworks).toHaveBeenCalledTimes(1);
  });

  it('should return defaults when repository returns empty', async () => {
    const expectedDefaults = [
      SocialNetwork.createDefault(SocialNetworkType.INSTAGRAM),
      SocialNetwork.createDefault(SocialNetworkType.FACEBOOK),
    ];

    mockRepository.getAllSocialNetworks.mockResolvedValue([]);
    mockFactory.createAllDefaults.mockReturnValue(expectedDefaults);

    const result = await getSocialNetworks.execute();

    expect(result).toEqual(expectedDefaults);
    expect(mockRepository.getAllSocialNetworks).toHaveBeenCalledTimes(1);
    expect(mockFactory.createAllDefaults).toHaveBeenCalledTimes(1);
  });

  it('should merge existing networks with defaults to ensure all types are present', async () => {
    const existingNetworks = [
      SocialNetwork.create(
        SocialNetworkType.INSTAGRAM,
        'https://instagram.com/updated',
        'Updated Instagram',
        true
      ),
      SocialNetwork.create(
        SocialNetworkType.FACEBOOK,
        'https://facebook.com/updated',
        'Updated Facebook',
        true
      ),
    ];

    const allDefaults = [
      SocialNetwork.createDefault(SocialNetworkType.INSTAGRAM),
      SocialNetwork.createDefault(SocialNetworkType.FACEBOOK),
      SocialNetwork.createDefault(SocialNetworkType.LINKEDIN),
      SocialNetwork.createDefault(SocialNetworkType.EMAIL),
      SocialNetwork.createDefault(SocialNetworkType.PHONE),
    ];

    mockRepository.getAllSocialNetworks.mockResolvedValue(existingNetworks);
    mockFactory.createAllDefaults.mockReturnValue(allDefaults);

    const result = await getSocialNetworks.execute();

    // Should return all 5 social networks
    expect(result).toHaveLength(5);

    // Should preserve existing Instagram data
    expect(result[0].type.value).toBe(SocialNetworkType.INSTAGRAM);
    expect(result[0].url.value).toBe('https://instagram.com/updated');
    expect(result[0].label.value).toBe('Updated Instagram');
    expect(result[0].enabled).toBe(true);

    // Should preserve existing Facebook data
    expect(result[1].type.value).toBe(SocialNetworkType.FACEBOOK);
    expect(result[1].url.value).toBe('https://facebook.com/updated');
    expect(result[1].label.value).toBe('Updated Facebook');
    expect(result[1].enabled).toBe(true);

    // Should add missing LinkedIn with defaults
    expect(result[2].type.value).toBe(SocialNetworkType.LINKEDIN);
    expect(result[2].url.value).toBe('');
    expect(result[2].label.value).toBe('LinkedIn');
    expect(result[2].enabled).toBe(false);

    // Should add missing Email with defaults
    expect(result[3].type.value).toBe(SocialNetworkType.EMAIL);
    expect(result[3].url.value).toBe('');
    expect(result[3].label.value).toBe('Email');
    expect(result[3].enabled).toBe(false);

    // Should add missing Phone with defaults
    expect(result[4].type.value).toBe(SocialNetworkType.PHONE);
    expect(result[4].url.value).toBe('');
    expect(result[4].label.value).toBe('Phone');
    expect(result[4].enabled).toBe(false);

    expect(mockRepository.getAllSocialNetworks).toHaveBeenCalledTimes(1);
    expect(mockFactory.createAllDefaults).toHaveBeenCalledTimes(1);
  });

  it('should handle partial existing networks with different order', async () => {
    const existingNetworks = [
      SocialNetwork.create(
        SocialNetworkType.EMAIL,
        'mailto:test@example.com',
        'Contact Email',
        true
      ),
      SocialNetwork.create(
        SocialNetworkType.PHONE,
        'tel:+1234567890',
        'Contact Phone',
        true
      ),
    ];

    const allDefaults = [
      SocialNetwork.createDefault(SocialNetworkType.INSTAGRAM),
      SocialNetwork.createDefault(SocialNetworkType.FACEBOOK),
      SocialNetwork.createDefault(SocialNetworkType.LINKEDIN),
      SocialNetwork.createDefault(SocialNetworkType.EMAIL),
      SocialNetwork.createDefault(SocialNetworkType.PHONE),
    ];

    mockRepository.getAllSocialNetworks.mockResolvedValue(existingNetworks);
    mockFactory.createAllDefaults.mockReturnValue(allDefaults);

    const result = await getSocialNetworks.execute();

    expect(result).toHaveLength(5);

    // Should preserve existing Email data
    const emailResult = result.find(
      (sn) => sn.type.value === SocialNetworkType.EMAIL
    );
    expect(emailResult?.url.value).toBe('mailto:test@example.com');
    expect(emailResult?.label.value).toBe('Contact Email');
    expect(emailResult?.enabled).toBe(true);

    // Should preserve existing Phone data
    const phoneResult = result.find(
      (sn) => sn.type.value === SocialNetworkType.PHONE
    );
    expect(phoneResult?.url.value).toBe('tel:+1234567890');
    expect(phoneResult?.label.value).toBe('Contact Phone');
    expect(phoneResult?.enabled).toBe(true);

    // Should add missing Instagram with defaults
    const instagramResult = result.find(
      (sn) => sn.type.value === SocialNetworkType.INSTAGRAM
    );
    expect(instagramResult?.url.value).toBe('');
    expect(instagramResult?.label.value).toBe('Instagram');
    expect(instagramResult?.enabled).toBe(false);
  });
});
