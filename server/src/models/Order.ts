import { Schema, model } from 'mongoose';
const orderItemSchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: 'Product' }, name: String, image: String, quantity: Number, price: Number }, { _id: false });
const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, items: [orderItemSchema], shippingAddress: Object,
  paymentMethod: { type: String, enum: ['cod', 'stripe'], required: true }, paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' }, stripeSessionId: String,
  totalAmount: Number, taxAmount: Number, shippingAmount: Number, discountAmount: Number
}, { timestamps: true });
export default model('Order', orderSchema);
