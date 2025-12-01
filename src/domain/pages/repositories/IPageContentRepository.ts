import type { PageContent } from '@/domain/pages/entities/PageContent';

export interface IPageContentRepository {
  findByMenuItemId(menuItemId: string): Promise<PageContent | null>;
  save(pageContent: PageContent): Promise<PageContent>;
  delete(menuItemId: string): Promise<void>;
}
