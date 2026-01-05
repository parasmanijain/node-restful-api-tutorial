import { Schema, model, Types } from "mongoose";

export interface Product {
  _id: Types.ObjectId;
  name: string;
  price: number;
  productImage: string;
}

const productSchema = new Schema<Product>({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
});

export default model<Product>("Product", productSchema);
