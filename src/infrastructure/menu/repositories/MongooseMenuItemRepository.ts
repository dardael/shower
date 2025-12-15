import { injectable, inject } from 'tsyringe';
import type { MenuItemRepository } from '@/domain/menu/repositories/MenuItemRepository';
import { MenuItem } from '@/domain/menu/entities/MenuItem';
import { MenuItemText } from '@/domain/menu/value-objects/MenuItemText';
import { MenuItemUrl } from '@/domain/menu/value-objects/MenuItemUrl';
import { MenuItemModel } from '@/infrastructure/menu/models/MenuItemModel';
import { Logger } from '@/application/shared/Logger';

@injectable()
export class MongooseMenuItemRepository implements MenuItemRepository {
  constructor(@inject('Logger') private readonly logger: Logger) {}

  async findAll(): Promise<MenuItem[]> {
    const documents = await MenuItemModel.find().sort({ position: 1 });

    return documents.map((doc) => this.mapToDomain(doc));
  }

  async findById(id: string): Promise<MenuItem | null> {
    const document = await MenuItemModel.findById(id);

    if (!document) {
      return null;
    }

    return this.mapToDomain(document);
  }

  async save(menuItem: MenuItem): Promise<MenuItem> {
    if (menuItem.hasId) {
      // Update existing document
      const existingDocument = await MenuItemModel.findById(menuItem.id);

      if (existingDocument) {
        existingDocument.text = menuItem.text.value;
        existingDocument.url = menuItem.url.value;
        existingDocument.position = menuItem.position;
        await existingDocument.save();
        return menuItem;
      }

      // Document doesn't exist but entity has ID (import scenario)
      // Create with the specified ID to preserve references
      await MenuItemModel.create({
        _id: menuItem.id,
        text: menuItem.text.value,
        url: menuItem.url.value,
        position: menuItem.position,
      });
      return menuItem;
    }

    // Create new document - let MongoDB generate the _id
    const createdDoc = await MenuItemModel.create({
      text: menuItem.text.value,
      url: menuItem.url.value,
      position: menuItem.position,
    });

    // Return entity with the MongoDB-generated ID
    return menuItem.withId(String(createdDoc._id));
  }

  async delete(id: string): Promise<void> {
    await MenuItemModel.findByIdAndDelete(id);
  }

  async updatePositions(
    items: Array<{ id: string; position: number }>
  ): Promise<void> {
    const bulkOperations = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { position: item.position } },
      },
    }));

    await MenuItemModel.bulkWrite(bulkOperations);
  }

  async getNextPosition(): Promise<number> {
    const lastItem = await MenuItemModel.findOne().sort({ position: -1 });

    if (!lastItem) {
      return 0;
    }

    return lastItem.position + 1;
  }

  private mapToDomain(doc: {
    _id: unknown;
    text: string;
    url: string;
    position: number;
    createdAt: Date;
    updatedAt: Date;
  }): MenuItem {
    try {
      const text = MenuItemText.create(doc.text);
      const url = MenuItemUrl.create(doc.url);
      return MenuItem.reconstitute(
        String(doc._id),
        text,
        url,
        doc.position,
        doc.createdAt,
        doc.updatedAt
      );
    } catch (error) {
      this.logger.logErrorWithObject(
        error,
        'Invalid menu item data found in database',
        {
          id: String(doc._id),
          text: doc.text,
          url: doc.url,
          position: doc.position,
        }
      );

      throw new Error(
        `Invalid menu item data: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
