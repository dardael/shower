import { EmailAddress } from '../value-objects/EmailAddress';

export interface EmailSettingsData {
  administratorEmail: string;
}

export class EmailSettings {
  private constructor(private readonly data: EmailSettingsData) {}

  static create(data: EmailSettingsData): EmailSettings {
    EmailSettings.validate(data);
    return new EmailSettings(data);
  }

  static createDefault(): EmailSettings {
    return new EmailSettings({
      administratorEmail: '',
    });
  }

  private static validate(data: EmailSettingsData): void {
    if (
      data.administratorEmail &&
      !EmailAddress.isValid(data.administratorEmail)
    ) {
      throw new Error("Format d'email invalide pour l'adresse administrateur");
    }
  }

  get administratorEmail(): string {
    return this.data.administratorEmail;
  }

  isConfigured(): boolean {
    return !!this.data.administratorEmail;
  }

  withAdministratorEmail(administratorEmail: string): EmailSettings {
    return EmailSettings.create({ ...this.data, administratorEmail });
  }

  toJSON(): EmailSettingsData {
    return { ...this.data };
  }
}
