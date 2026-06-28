import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';

export async function getCart(req: Request, res: Response) { const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId'); res.json({ cart: cart || { items: [] } }); }
export async function addToCart(req: Request, res: Response) {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || product.stock < quantity) return res.status(400).json({ message: 'Product unavailable' });
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });
  const item = cart.items.find((i: any) => i.productId.toString() === productId);
  if (item) item.quantity += quantity;
  else cart.items.push({ productId, quantity, price: product.discountPrice || product.price } as any);
  await cart.save(); res.status(201).json(cart);
}
export async function updateCart(req: Request, res: Response) {
  const cart = await Cart.findOne({ userId: req.user._id }); if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const item = cart.items.find((i: any) => i.productId.toString() === req.body.productId); if (!item) return res.status(404).json({ message: 'Item not found' });
  item.quantity = Math.max(1, Number(req.body.quantity)); await cart.save(); res.json(cart);
}
export async function removeFromCart(req: Request, res: Response) { const cart = await Cart.findOne({ userId: req.user._id }); if (cart) { cart.items = cart.items.filter((i: any) => i.productId.toString() !== req.params.id) as any; await cart.save(); } res.json(cart || { items: [] }); }
export async function clearCart(req: Request, res: Response) { await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] }); res.json({ message: 'Cart cleared' }); }
