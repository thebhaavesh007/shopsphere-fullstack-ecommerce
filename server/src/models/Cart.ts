import { Schema, model } from 'mongoose';
const cartItemSchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, quantity: { type: Number, default: 1, min: 1 }, price: { type: Number, required: true } }, { _id: false });
const cartSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, items: [cartItemSchema] }, { timestamps: true });
export default model('Cart', cartSchema);
