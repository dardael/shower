import { injectable } from 'tsyringe';
import { ICategoryRepository } from '@/domain/product/repositories/ICategoryRepository';
import { Category } from '@/domain/product/entities/Category';
import {
  CategoryModel,
  ICategoryDocument,
} from '@/infrastructure/product/models/CategoryModel';
import { ProductModel } from '@/infrastructure/product/models/ProductModel';

@injectable()
export class MongooseCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> {
    const documents = await CategoryModel.find()
      .sort({ displayOrder: 1, name: 1 })
      .exec();
    return documents.map((doc) => this.mapToDomain(doc));
  }

  async getById(id: string): Promise<Category | null> {
    const document = await CategoryModel.findById(id).exec();
    return document ? this.mapToDomain(document) : null;
  }

  async create(category: Category): Promise<Category> {
    const document = await CategoryModel.create(this.mapToDatabase(category));
    return this.mapToDomain(document);
  }

  async update(category: Category): Promise<Category> {
    const document = await CategoryModel.findByIdAndUpdate(
      category.id,
      this.mapToDatabase(category),
      { new: true }
    ).exec();
    if (!document) {
      throw new Error(`Category with id ${category.id} not found`);
    }
    return this.mapToDomain(document);
  }

  async delete(id: string): Promise<void> {
    await CategoryModel.findByIdAndDelete(id).exec();
  }

  async getProductCount(categoryId: string): Promise<number> {
    return ProductModel.countDocuments({ categoryIds: categoryId }).exec();
  }

  async reorder(orderedIds: string[]): Promise<void> {
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder: index } },
      },
    }));
    await CategoryModel.bulkWrite(bulkOps);
  }

  private mapToDomain(document: ICategoryDocument): Category {
    return Category.fromJSON({
      id: document._id,
      name: document.name,
      description: document.description,
      displayOrder: document.displayOrder ?? 0,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  private mapToDatabase(category: Category): {
    _id: string;
    name: string;
    description: string;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      _id: category.id,
      name: category.name,
      description: category.description,
      displayOrder: category.displayOrder,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
