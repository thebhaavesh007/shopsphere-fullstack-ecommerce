import { Schema, model } from 'mongoose';
const categorySchema = new Schema({ name: { type: String, required: true, unique: true }, slug: { type: String, required: true, unique: true }, image: String, description: String }, { timestamps: true });
export default model('Category', categorySchema);
