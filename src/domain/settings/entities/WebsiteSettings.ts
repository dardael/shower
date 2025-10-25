import { WebsiteName } from '@/domain/settings/value-objects/WebsiteName';
import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';
import { ThemeColor } from '@/domain/settings/value-objects/ThemeColor';
import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork';

export class WebsiteSettings {
  private readonly _key: string;
  private _name: WebsiteName;
  private _icon: WebsiteIcon | null;
  private _socialNetworks: SocialNetwork[];
  private _themeColor: ThemeColor;

  constructor(
    key: string,
    name: WebsiteName,
    icon: WebsiteIcon | null = null,
    socialNetworks: SocialNetwork[] = [],
    themeColor: ThemeColor | null = null
  ) {
    this._key = key;
    this._name = name;
    this._icon = icon;
    this._socialNetworks = socialNetworks;
    this._themeColor = themeColor || ThemeColor.createDefault();
  }

  get key(): string {
    return this._key;
  }

  get name(): WebsiteName {
    return this._name;
  }

  get icon(): WebsiteIcon | null {
    return this._icon;
  }

  get socialNetworks(): SocialNetwork[] {
    return [...this._socialNetworks];
  }

  get themeColor(): ThemeColor {
    return this._themeColor;
  }

  set name(newName: WebsiteName) {
    this._name = newName;
  }

  set icon(newIcon: WebsiteIcon | null) {
    this._icon = newIcon;
  }

  set socialNetworks(newSocialNetworks: SocialNetwork[]) {
    this._socialNetworks = [...newSocialNetworks];
  }

  set themeColor(newThemeColor: ThemeColor) {
    this._themeColor = newThemeColor;
  }

  updateName(newName: WebsiteName): void {
    this._name = newName;
  }

  updateIcon(newIcon: WebsiteIcon | null): void {
    this._icon = newIcon;
  }

  updateSocialNetworks(socialNetworks: SocialNetwork[]): void {
    this._socialNetworks = [...socialNetworks];
  }

  updateThemeColor(themeColor: ThemeColor): void {
    this._themeColor = themeColor;
  }

  addSocialNetwork(socialNetwork: SocialNetwork): void {
    this._socialNetworks.push(socialNetwork);
  }

  removeSocialNetwork(type: string): void {
    this._socialNetworks = this._socialNetworks.filter(
      (sn) => sn.type.value !== type
    );
  }

  getSocialNetworkByType(type: string): SocialNetwork | null {
    return this._socialNetworks.find((sn) => sn.type.value === type) || null;
  }

  hasIcon(): boolean {
    return this._icon !== null;
  }

  removeIcon(): void {
    this._icon = null;
  }

  isIconOptimalForFavicon(): boolean {
    return this._icon ? this._icon.isOptimalForFavicon() : false;
  }

  hasCustomThemeColor(): boolean {
    return !this._themeColor.equals(ThemeColor.createDefault());
  }

  equals(other: WebsiteSettings | null | undefined): boolean {
    if (!other) {
      return false;
    }

    return (
      this._key === other._key &&
      this._name.equals(other._name) &&
      ((this._icon === null && other._icon === null) ||
        (this._icon !== null &&
          other._icon !== null &&
          this._icon.equals(other._icon))) &&
      this._socialNetworks.length === other._socialNetworks.length &&
      this._socialNetworks.every((sn, index) =>
        sn.equals(other._socialNetworks[index])
      ) &&
      this._themeColor.equals(other._themeColor)
    );
  }

  static create(key: string, name: WebsiteName): WebsiteSettings {
    return new WebsiteSettings(key, name);
  }

  static createWithIcon(
    key: string,
    name: WebsiteName,
    icon: WebsiteIcon
  ): WebsiteSettings {
    return new WebsiteSettings(key, name, icon);
  }

  static createWithSocialNetworks(
    key: string,
    name: WebsiteName,
    socialNetworks: SocialNetwork[],
    icon: WebsiteIcon | null = null,
    themeColor: ThemeColor | null = null
  ): WebsiteSettings {
    return new WebsiteSettings(key, name, icon, socialNetworks, themeColor);
  }

  static createWithThemeColor(
    key: string,
    name: WebsiteName,
    themeColor: ThemeColor,
    icon: WebsiteIcon | null = null,
    socialNetworks: SocialNetwork[] = []
  ): WebsiteSettings {
    return new WebsiteSettings(key, name, icon, socialNetworks, themeColor);
  }
}
