import { Schema, model, Types } from "mongoose";

/**
 * Order interface
 */
export interface Order {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
}

/**
 * Order schema
 */
const orderSchema = new Schema<Order>({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

/**
 * Order model
 */
export default model<Order>("Order", orderSchema);
