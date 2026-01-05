import { Schema, model } from 'mongoose';

const productSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    price: Number
});

export default model('Product', productSchema);