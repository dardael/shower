import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItemDocument {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface IOrderDocument extends Document {
  _id: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItemDocument[];
  totalPrice: number;
  status: 'NEW' | 'CONFIRMED' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItemDocument>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, max: 99 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    _id: { type: String, required: true },
    customerFirstName: { type: String, required: true },
    customerLastName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['NEW', 'CONFIRMED', 'COMPLETED'],
      default: 'NEW',
      required: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1 });

export const OrderModel: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
