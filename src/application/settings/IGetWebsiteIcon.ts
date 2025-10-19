import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';

export interface IGetWebsiteIcon {
  execute(key: string): Promise<WebsiteIcon | null>;
}
