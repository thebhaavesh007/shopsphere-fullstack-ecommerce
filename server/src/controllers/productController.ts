import { Request, Response } from 'express';
import slugify from 'slugify';
import Product from '../models/Product';
import Review from '../models/Review';

export async function getProducts(req: Request, res: Response) {
  const page = Number(req.query.page || 1), limit = Number(req.query.limit || 12);
  const filter: any = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.minPrice || req.query.maxPrice) filter.price = { $gte: Number(req.query.minPrice || 0), $lte: Number(req.query.maxPrice || 999999999) };
  if (req.query.rating) filter.ratings = { $gte: Number(req.query.rating) };
  if (req.query.q) filter.$text = { $search: String(req.query.q) };
  const sortMap: any = { newest: '-createdAt', priceAsc: 'price', priceDesc: '-price', popular: '-reviewsCount' };
  const products = await Product.find(filter).populate('category').sort(sortMap[String(req.query.sort)] || '-createdAt').skip((page - 1) * limit).limit(limit);
  const total = await Product.countDocuments(filter);
  res.json({ products, page, pages: Math.ceil(total / limit), total });
}
export async function getProduct(req: Request, res: Response) {
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4);
  res.json({ product, related });
}
export async function createProduct(req: Request, res: Response) {
  const slug = slugify(req.body.name, { lower: true, strict: true }) + '-' + Date.now();
  const product = await Product.create({ ...req.body, slug });
  res.status(201).json(product);
}
export async function updateProduct(req: Request, res: Response) {
  const update = { ...req.body };
  if (update.name) update.slug = slugify(update.name, { lower: true, strict: true });
  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}
export async function deleteProduct(req: Request, res: Response) { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Product deleted' }); }
export async function productsByCategory(req: Request, res: Response) { const products = await Product.find({ category: req.params.category }); res.json({ products }); }
export async function searchProducts(req: Request, res: Response) { const products = await Product.find({ $text: { $search: String(req.query.q || '') } }).limit(20); res.json({ products }); }
export async function addReview(req: Request, res: Response) {
  const review = await Review.create({ userId: req.user._id, productId: req.params.id, rating: req.body.rating, comment: req.body.comment });
  const stats = await Review.aggregate([{ $match: { productId: review.productId } }, { $group: { _id: '$productId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }]);
  if (stats[0]) await Product.findByIdAndUpdate(req.params.id, { ratings: stats[0].avg, reviewsCount: stats[0].count });
  res.status(201).json(review);
}
export async function getReviews(req: Request, res: Response) { res.json({ reviews: await Review.find({ productId: req.params.id }).populate('userId', 'name avatar') }); }
export async function deleteReview(req: Request, res: Response) { await Review.findOneAndDelete({ _id: req.params.id, $or: [{ userId: req.user._id }, ...(req.user.role === 'admin' ? [{}] : [])] }); res.json({ message: 'Review deleted' }); }
