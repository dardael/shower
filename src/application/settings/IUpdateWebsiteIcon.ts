import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';

export interface IUpdateWebsiteIcon {
  execute(icon: WebsiteIcon | null): Promise<void>;
}
