import {
  SocialNetworkTypeValueObject,
  SocialNetworkType,
} from '@/domain/settings/value-objects/SocialNetworkType';
import { SocialNetworkUrl } from '@/domain/settings/value-objects/SocialNetworkUrl';
import { SocialNetworkLabel } from '@/domain/settings/value-objects/SocialNetworkLabel';

export class SocialNetwork {
  private readonly _type: SocialNetworkTypeValueObject;
  private readonly _url: SocialNetworkUrl;
  private readonly _label: SocialNetworkLabel;
  private readonly _enabled: boolean;

  constructor(
    type: SocialNetworkTypeValueObject,
    url: SocialNetworkUrl,
    label: SocialNetworkLabel,
    enabled: boolean = true
  ) {
    this._type = type;
    this._url = url;
    this._label = label;
    this._enabled = enabled;
  }

  get type(): SocialNetworkTypeValueObject {
    return this._type;
  }

  get url(): SocialNetworkUrl {
    return this._url;
  }

  get label(): SocialNetworkLabel {
    return this._label;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  withUrl(newUrl: SocialNetworkUrl): SocialNetwork {
    return new SocialNetwork(this._type, newUrl, this._label, this._enabled);
  }

  withLabel(newLabel: SocialNetworkLabel): SocialNetwork {
    return new SocialNetwork(this._type, this._url, newLabel, this._enabled);
  }

  withEnabled(enabled: boolean): SocialNetwork {
    return new SocialNetwork(this._type, this._url, this._label, enabled);
  }

  enable(): SocialNetwork {
    return new SocialNetwork(this._type, this._url, this._label, true);
  }

  disable(): SocialNetwork {
    return new SocialNetwork(this._type, this._url, this._label, false);
  }

  toggle(): SocialNetwork {
    return new SocialNetwork(
      this._type,
      this._url,
      this._label,
      !this._enabled
    );
  }

  updateUrl(url: string): SocialNetwork {
    const newUrl = SocialNetworkUrl.fromString(url, this._type.value);
    return new SocialNetwork(this._type, newUrl, this._label, this._enabled);
  }

  updateLabel(label: string): SocialNetwork {
    const newLabel = SocialNetworkLabel.fromString(label);
    return new SocialNetwork(this._type, this._url, newLabel, this._enabled);
  }

  isConfigured(): boolean {
    return this._enabled && !this._url.isEmpty;
  }

  getDisplayLabel(): string {
    return this._label.value || this._type.getDefaultLabel();
  }

  getIconComponent(): string {
    return this._type.getIconComponent();
  }

  getUrlPlaceholder(): string {
    return this._type.getUrlPlaceholder();
  }

  equals(other: SocialNetwork | null | undefined): boolean {
    if (!other) {
      return false;
    }

    return (
      this._type.equals(other._type) &&
      this._url.equals(other._url) &&
      this._label.equals(other._label) &&
      this._enabled === other._enabled
    );
  }

  static create(
    type: SocialNetworkType,
    url: string,
    label: string,
    enabled: boolean = true
  ): SocialNetwork {
    const typeValueObject = new SocialNetworkTypeValueObject(type);
    const urlValueObject = SocialNetworkUrl.fromString(url, type);

    // Use default label if empty string is provided
    const finalLabel =
      label.trim() === '' ? typeValueObject.getDefaultLabel() : label;
    const labelValueObject = SocialNetworkLabel.fromString(finalLabel);

    return new SocialNetwork(
      typeValueObject,
      urlValueObject,
      labelValueObject,
      enabled
    );
  }

  static createDefault(type: SocialNetworkType): SocialNetwork {
    const typeValueObject = new SocialNetworkTypeValueObject(type);
    const urlValueObject = SocialNetworkUrl.createEmpty();
    const labelValueObject = SocialNetworkLabel.createDefault(
      typeValueObject.getDefaultLabel()
    );

    return new SocialNetwork(
      typeValueObject,
      urlValueObject,
      labelValueObject,
      false
    );
  }

  static createAllDefaults(): SocialNetwork[] {
    return Object.values(SocialNetworkType).map((type) =>
      SocialNetwork.createDefault(type)
    );
  }

  toJSON() {
    return {
      type: this._type.value,
      url: this._url.value,
      label: this._label.value,
      enabled: this._enabled,
    };
  }

  static fromJSON(data: {
    type: SocialNetworkType;
    url: string;
    label: string;
    enabled: boolean;
  }): SocialNetwork {
    return SocialNetwork.create(data.type, data.url, data.label, data.enabled);
  }
}
