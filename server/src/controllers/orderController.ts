import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Order from '../models/Order';
import Product from '../models/Product';

const totals = (items: any[]) => { const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0); const taxAmount = Math.round(subtotal * 0.18); const shippingAmount = subtotal > 1999 ? 0 : 99; return { taxAmount, shippingAmount, discountAmount: 0, totalAmount: subtotal + taxAmount + shippingAmount }; };
export async function createOrder(req: Request, res: Response) {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
  if (!cart?.items.length) return res.status(400).json({ message: 'Cart is empty' });
  const items = cart.items.map((i: any) => ({ productId: i.productId._id, name: i.productId.name, image: i.productId.images?.[0], quantity: i.quantity, price: i.price }));
  const order = await Order.create({ userId: req.user._id, items, shippingAddress: req.body.shippingAddress, paymentMethod: req.body.paymentMethod, paymentStatus: req.body.paymentMethod === 'cod' ? 'pending' : 'pending', ...totals(items) });
  for (const item of items) await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
  cart.items = [] as any; await cart.save(); res.status(201).json(order);
}
export async function myOrders(req: Request, res: Response) { res.json({ orders: await Order.find({ userId: req.user._id }).sort('-createdAt') }); }
export async function orderById(req: Request, res: Response) { const order = await Order.findById(req.params.id); if (!order || (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin')) return res.status(404).json({ message: 'Order not found' }); res.json(order); }
export async function adminOrders(_req: Request, res: Response) { res.json({ orders: await Order.find().populate('userId', 'name email').sort('-createdAt') }); }
export async function updateStatus(req: Request, res: Response) { const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true }); res.json(order); }
export async function dashboard(_req: Request, res: Response) { const orders = await Order.find(); const revenue = orders.filter(o => o.paymentStatus === 'paid' || o.paymentMethod === 'cod').reduce((s, o: any) => s + (o.totalAmount || 0), 0); res.json({ revenue, totalOrders: orders.length, recentOrders: orders.slice(-5).reverse() }); }
