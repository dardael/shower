import { WebsiteName } from '../value-objects/WebsiteName';
import { WebsiteIcon } from '../value-objects/WebsiteIcon';

export class WebsiteSettings {
  private readonly _key: string;
  private _name: WebsiteName;
  private _icon: WebsiteIcon | null;

  constructor(key: string, name: WebsiteName, icon: WebsiteIcon | null = null) {
    this._key = key;
    this._name = name;
    this._icon = icon;
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

  set name(newName: WebsiteName) {
    this._name = newName;
  }

  set icon(newIcon: WebsiteIcon | null) {
    this._icon = newIcon;
  }

  updateName(newName: WebsiteName): void {
    this._name = newName;
  }

  updateIcon(newIcon: WebsiteIcon | null): void {
    this._icon = newIcon;
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
          this._icon.equals(other._icon)))
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
}
