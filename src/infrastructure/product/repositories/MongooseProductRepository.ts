import { injectable } from 'tsyringe';
import { IProductRepository } from '@/domain/product/repositories/IProductRepository';
import { Product } from '@/domain/product/entities/Product';
import {
  ProductModel,
  IProductDocument,
} from '@/infrastructure/product/models/ProductModel';

@injectable()
export class MongooseProductRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    const documents = await ProductModel.find()
      .sort({ displayOrder: 1 })
      .exec();
    return documents.map((doc) => this.mapToDomain(doc));
  }

  async getById(id: string): Promise<Product | null> {
    const document = await ProductModel.findById(id).exec();
    return document ? this.mapToDomain(document) : null;
  }

  async getByCategory(categoryId: string): Promise<Product[]> {
    const documents = await ProductModel.find({ categoryIds: categoryId })
      .sort({ displayOrder: 1 })
      .exec();
    return documents.map((doc) => this.mapToDomain(doc));
  }

  async create(product: Product): Promise<Product> {
    const document = await ProductModel.create(this.mapToDatabase(product));
    return this.mapToDomain(document);
  }

  async update(product: Product): Promise<Product> {
    const document = await ProductModel.findByIdAndUpdate(
      product.id,
      this.mapToDatabase(product),
      { new: true }
    ).exec();
    if (!document) {
      throw new Error(`Product with id ${product.id} not found`);
    }
    return this.mapToDomain(document);
  }

  async delete(id: string): Promise<void> {
    await ProductModel.findByIdAndDelete(id).exec();
  }

  async reorder(orderedIds: string[]): Promise<void> {
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { displayOrder: index } },
      },
    }));
    await ProductModel.bulkWrite(bulkOps);
  }

  async getMaxDisplayOrder(): Promise<number> {
    const result = await ProductModel.findOne()
      .sort({ displayOrder: -1 })
      .select('displayOrder')
      .exec();
    return result?.displayOrder ?? -1;
  }

  async removeCategoryFromAll(categoryId: string): Promise<void> {
    await ProductModel.updateMany(
      { categoryIds: categoryId },
      { $pull: { categoryIds: categoryId } }
    ).exec();
  }

  private mapToDomain(document: IProductDocument): Product {
    return Product.fromJSON({
      id: document._id,
      name: document.name,
      description: document.description,
      price: document.price,
      imageUrl: document.imageUrl,
      displayOrder: document.displayOrder,
      categoryIds: document.categoryIds,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  private mapToDatabase(product: Product): {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    displayOrder: number;
    categoryIds: string[];
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      _id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      displayOrder: product.displayOrder,
      categoryIds: product.categoryIds,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
