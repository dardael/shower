import {
  SocialNetworkTypeValueObject,
  SocialNetworkType,
} from '@/domain/settings/value-objects/SocialNetworkType';
import { SocialNetworkUrl } from '@/domain/settings/value-objects/SocialNetworkUrl';
import { SocialNetworkLabel } from '@/domain/settings/value-objects/SocialNetworkLabel';

export class SocialNetwork {
  private readonly _type: SocialNetworkTypeValueObject;
  private _url: SocialNetworkUrl;
  private _label: SocialNetworkLabel;
  private _enabled: boolean;

  // Cache for default social networks to improve performance
  private static defaultNetworksCache: SocialNetwork[] | null = null;

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

  set url(newUrl: SocialNetworkUrl) {
    this._url = newUrl;
  }

  set label(newLabel: SocialNetworkLabel) {
    this._label = newLabel;
  }

  set enabled(enabled: boolean) {
    this._enabled = enabled;
  }

  enable(): void {
    this._enabled = true;
  }

  disable(): void {
    this._enabled = false;
  }

  toggle(): void {
    this._enabled = !this._enabled;
  }

  updateUrl(url: string): void {
    this._url = SocialNetworkUrl.fromString(url, this._type.value);
  }

  updateLabel(label: string): void {
    this._label = SocialNetworkLabel.fromString(label);
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
    // Cache default social networks to avoid recreating them on every call
    if (!SocialNetwork.defaultNetworksCache) {
      SocialNetwork.defaultNetworksCache = Object.values(SocialNetworkType).map(
        (type) => SocialNetwork.createDefault(type)
      );
    }
    // Return a copy to prevent accidental modifications of the cached array
    return [...SocialNetwork.defaultNetworksCache];
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
