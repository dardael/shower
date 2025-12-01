import type { PageContent } from '@/domain/pages/entities/PageContent';

export interface IGetPageContent {
  execute(menuItemId: string): Promise<PageContent | null>;
}
