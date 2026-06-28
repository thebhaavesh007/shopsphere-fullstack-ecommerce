import { Schema, model } from 'mongoose';
const variantSchema = new Schema({ name: String, value: String, stock: Number, price: Number }, { _id: false });
const productSchema = new Schema({
  name: { type: String, required: true }, slug: { type: String, required: true, unique: true }, description: { type: String, required: true },
  price: { type: Number, required: true }, discountPrice: Number, category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: String, images: [String], stock: { type: Number, default: 0 }, ratings: { type: Number, default: 0 }, reviewsCount: { type: Number, default: 0 },
  variants: [variantSchema], isFeatured: { type: Boolean, default: false }
}, { timestamps: true });
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
export default model('Product', productSchema);
