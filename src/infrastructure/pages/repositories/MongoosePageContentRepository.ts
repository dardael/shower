import { injectable, inject } from 'tsyringe';
import mongoose from 'mongoose';
import type { IPageContentRepository } from '@/domain/pages/repositories/IPageContentRepository';
import { PageContent } from '@/domain/pages/entities/PageContent';
import { PageContentBody } from '@/domain/pages/value-objects/PageContentBody';
import { PageContentModel } from '@/infrastructure/pages/models/PageContentModel';
import { Logger } from '@/application/shared/Logger';

@injectable()
export class MongoosePageContentRepository implements IPageContentRepository {
  constructor(@inject('Logger') private readonly logger: Logger) {}

  async findByMenuItemId(menuItemId: string): Promise<PageContent | null> {
    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
      this.logger.warn('Invalid menuItemId format', { menuItemId });
      return null;
    }

    const document = await PageContentModel.findOne({ menuItemId });

    if (!document) {
      return null;
    }

    return this.mapToDomain(document);
  }

  async save(pageContent: PageContent): Promise<PageContent> {
    if (!mongoose.Types.ObjectId.isValid(pageContent.menuItemId)) {
      throw new Error('Invalid menuItemId format');
    }

    const existingDocument = await PageContentModel.findOne({
      menuItemId: pageContent.menuItemId,
    });

    if (existingDocument) {
      existingDocument.content = pageContent.content.value;
      await existingDocument.save();
      return pageContent.hasId
        ? pageContent
        : pageContent.withId(String(existingDocument._id));
    }

    const createdDoc = await PageContentModel.create({
      menuItemId: pageContent.menuItemId,
      content: pageContent.content.value,
    });

    return pageContent.withId(String(createdDoc._id));
  }

  async delete(menuItemId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
      this.logger.warn('Invalid menuItemId format for delete', { menuItemId });
      return;
    }

    await PageContentModel.deleteOne({ menuItemId });
  }

  private mapToDomain(doc: {
    _id: unknown;
    menuItemId: unknown;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }): PageContent {
    try {
      const content = PageContentBody.create(doc.content);
      return PageContent.reconstitute(
        String(doc._id),
        String(doc.menuItemId),
        content,
        doc.createdAt,
        doc.updatedAt
      );
    } catch (error) {
      this.logger.logErrorWithObject(
        error,
        'Invalid page content data found in database',
        {
          id: String(doc._id),
          menuItemId: String(doc.menuItemId),
          contentLength: doc.content?.length ?? 0,
        }
      );

      throw new Error(
        `Invalid page content data: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
