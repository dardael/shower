import {
  EncryptionType,
  ENCRYPTION_TYPES,
} from '../value-objects/EncryptionType';

export interface SmtpSettingsData {
  host: string;
  port: number;
  username: string;
  password: string;
  encryptionType: EncryptionType;
}

export class SmtpSettings {
  private constructor(private readonly data: SmtpSettingsData) {}

  static create(data: SmtpSettingsData): SmtpSettings {
    SmtpSettings.validate(data);
    return new SmtpSettings(data);
  }

  static createDefault(): SmtpSettings {
    return new SmtpSettings({
      host: '',
      port: 587,
      username: '',
      password: '',
      encryptionType: ENCRYPTION_TYPES.TLS,
    });
  }

  private static validate(data: SmtpSettingsData): void {
    if (data.host && !SmtpSettings.isValidHostname(data.host)) {
      throw new Error("Format de nom d'hôte invalide");
    }
    if (data.port < 1 || data.port > 65535) {
      throw new Error('Le port doit être compris entre 1 et 65535');
    }
    if (!Object.values(ENCRYPTION_TYPES).includes(data.encryptionType)) {
      throw new Error('Type de chiffrement invalide');
    }
  }

  private static isValidHostname(hostname: string): boolean {
    const hostnameRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
    return hostnameRegex.test(hostname);
  }

  get host(): string {
    return this.data.host;
  }

  get port(): number {
    return this.data.port;
  }

  get username(): string {
    return this.data.username;
  }

  get password(): string {
    return this.data.password;
  }

  get encryptionType(): EncryptionType {
    return this.data.encryptionType;
  }

  isConfigured(): boolean {
    return !!(this.data.host && this.data.username && this.data.password);
  }

  withHost(host: string): SmtpSettings {
    return SmtpSettings.create({ ...this.data, host });
  }

  withPort(port: number): SmtpSettings {
    return SmtpSettings.create({ ...this.data, port });
  }

  withUsername(username: string): SmtpSettings {
    return SmtpSettings.create({ ...this.data, username });
  }

  withPassword(password: string): SmtpSettings {
    return SmtpSettings.create({ ...this.data, password });
  }

  withEncryptionType(encryptionType: EncryptionType): SmtpSettings {
    return SmtpSettings.create({ ...this.data, encryptionType });
  }

  toJSON(): SmtpSettingsData & { isConfigured: boolean } {
    return {
      ...this.data,
      password: this.data.password ? '********' : '',
      isConfigured: this.isConfigured(),
    };
  }
}
