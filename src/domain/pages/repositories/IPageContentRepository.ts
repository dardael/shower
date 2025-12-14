import type { PageContent } from '@/domain/pages/entities/PageContent';

export interface IPageContentRepository {
  findAll(): Promise<PageContent[]>;
  findByMenuItemId(menuItemId: string): Promise<PageContent | null>;
  save(pageContent: PageContent): Promise<PageContent>;
  delete(menuItemId: string): Promise<void>;
}
