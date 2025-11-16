import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';

export interface IGetWebsiteIcon {
  execute(): Promise<WebsiteIcon | null>;
}
