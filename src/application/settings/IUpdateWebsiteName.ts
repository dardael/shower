import { UpdateWebsiteNameRequest } from './UpdateWebsiteName';

export interface IUpdateWebsiteName {
  execute(request: UpdateWebsiteNameRequest): Promise<void>;
}
