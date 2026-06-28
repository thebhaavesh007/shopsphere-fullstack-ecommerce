import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

const addressSchema = new Schema({
  fullName: String, phone: String, line1: String, line2: String, city: String, state: String, postalCode: String, country: { type: String, default: 'India' }, isDefault: Boolean
}, { _id: true });

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: String,
  avatar: String,
  addresses: [addressSchema],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  isBlocked: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password as string, 12);
  next();
});
userSchema.methods.comparePassword = function(candidate: string) { return bcrypt.compare(candidate, this.password); };
export default model('User', userSchema);
