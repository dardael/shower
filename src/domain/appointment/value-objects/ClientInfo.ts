interface ClientInfoProps {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  customField?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ClientInfo {
  private constructor(
    private readonly _name: string,
    private readonly _email: string,
    private readonly _phone?: string,
    private readonly _address?: string,
    private readonly _customField?: string
  ) {}

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string | undefined {
    return this._phone;
  }

  get address(): string | undefined {
    return this._address;
  }

  get customField(): string | undefined {
    return this._customField;
  }

  static create(props: ClientInfoProps): ClientInfo {
    const trimmedName = props.name?.trim();
    if (!trimmedName) {
      throw new Error('Le nom du client est requis');
    }

    const trimmedEmail = props.email?.trim();
    if (!trimmedEmail) {
      throw new Error("L'adresse email est requise");
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error("Format d'adresse email invalide");
    }

    return new ClientInfo(
      trimmedName,
      trimmedEmail,
      props.phone?.trim() || undefined,
      props.address?.trim() || undefined,
      props.customField?.trim() || undefined
    );
  }

  toObject(): ClientInfoProps {
    return {
      name: this._name,
      email: this._email,
      phone: this._phone,
      address: this._address,
      customField: this._customField,
    };
  }

  equals(other: ClientInfo): boolean {
    return (
      this._name === other._name &&
      this._email === other._email &&
      this._phone === other._phone &&
      this._address === other._address &&
      this._customField === other._customField
    );
  }
}
