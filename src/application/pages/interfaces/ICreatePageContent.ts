import type { PageContent } from '@/domain/pages/entities/PageContent';

export interface ICreatePageContent {
  execute(
    menuItemId: string,
    content: string,
    heroText?: string | null
  ): Promise<PageContent>;
}
