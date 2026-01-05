import { Schema, model, Types } from "mongoose";

/**
 * User interface
 */
export interface User {
  _id: Types.ObjectId;
  email: string;
  password: string;
}

/**
 * User schema
 */
const userSchema = new Schema<User>({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String,
    required: true,
  },
});

/**
 * User model
 */
export default model<User>("User", userSchema);
