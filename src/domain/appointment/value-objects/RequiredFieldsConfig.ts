import { REQUIRED_FIELDS } from '@/domain/appointment/constants';

type RequiredField = 'name' | 'email' | 'phone' | 'address' | 'custom';

interface RequiredFieldsConfigProps {
  fields: RequiredField[];
  customFieldLabel?: string;
}

export class RequiredFieldsConfig {
  private constructor(
    private readonly _fields: RequiredField[],
    private readonly _customFieldLabel?: string
  ) {}

  get fields(): readonly RequiredField[] {
    return this._fields;
  }

  get customFieldLabel(): string | undefined {
    return this._customFieldLabel;
  }

  static create(props: RequiredFieldsConfigProps): RequiredFieldsConfig {
    const fields = props.fields || [];

    const requiredFields = new Set<RequiredField>(
      REQUIRED_FIELDS.MANDATORY_FIELDS
    );
    fields.forEach((f) => requiredFields.add(f));

    const finalFields = Array.from(requiredFields) as RequiredField[];

    if (finalFields.includes('custom') && !props.customFieldLabel?.trim()) {
      throw new Error('Un libellé est requis pour le champ personnalisé');
    }

    return new RequiredFieldsConfig(
      finalFields,
      finalFields.includes('custom')
        ? props.customFieldLabel?.trim()
        : undefined
    );
  }

  static default(): RequiredFieldsConfig {
    return new RequiredFieldsConfig(['name', 'email']);
  }

  isFieldRequired(field: RequiredField): boolean {
    return this._fields.includes(field);
  }

  toObject(): RequiredFieldsConfigProps {
    return {
      fields: [...this._fields],
      customFieldLabel: this._customFieldLabel,
    };
  }

  equals(other: RequiredFieldsConfig): boolean {
    if (this._fields.length !== other._fields.length) {
      return false;
    }
    const sortedThis = [...this._fields].sort();
    const sortedOther = [...other._fields].sort();
    return (
      sortedThis.every((f, i) => f === sortedOther[i]) &&
      this._customFieldLabel === other._customFieldLabel
    );
  }
}
