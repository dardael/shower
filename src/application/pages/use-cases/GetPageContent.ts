import { injectable, inject } from 'tsyringe';
import type { IGetPageContent } from '@/application/pages/interfaces/IGetPageContent';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';
import { PageContent } from '@/domain/pages/entities/PageContent';

@injectable()
export class GetPageContent implements IGetPageContent {
  constructor(
    @inject('PageContentRepository')
    private readonly pageContentRepository: IPageContentRepository
  ) {}

  async execute(menuItemId: string): Promise<PageContent | null> {
    return this.pageContentRepository.findByMenuItemId(menuItemId);
  }
}
