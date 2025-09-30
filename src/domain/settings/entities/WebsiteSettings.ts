import { WebsiteName } from '../value-objects/WebsiteName';

export class WebsiteSettings {
  private readonly _key: string;
  private _name: WebsiteName;

  constructor(key: string, name: WebsiteName) {
    this._key = key;
    this._name = name;
  }

  get key(): string {
    return this._key;
  }

  get name(): WebsiteName {
    return this._name;
  }

  set name(newName: WebsiteName) {
    this._name = newName;
  }

  updateName(newName: WebsiteName): void {
    this._name = newName;
  }
}
