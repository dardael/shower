import type { PageContent } from '@/domain/pages/entities/PageContent';

export interface IUpdatePageContent {
  execute(
    menuItemId: string,
    content: string,
    heroText?: string | null
  ): Promise<PageContent>;
}
