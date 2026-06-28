import { Schema, model } from 'mongoose';
const reviewSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, rating: { type: Number, min: 1, max: 5, required: true }, comment: { type: String, required: true } }, { timestamps: true });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
export default model('Review', reviewSchema);
