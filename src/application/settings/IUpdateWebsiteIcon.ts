import { WebsiteIcon } from '@/domain/settings/value-objects/WebsiteIcon';

export interface IUpdateWebsiteIcon {
  execute(key: string, icon: WebsiteIcon | null): Promise<void>;
}
