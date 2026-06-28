import { Router } from 'express';
import { addReview, createProduct, deleteProduct, deleteReview, getProduct, getProducts, getReviews, productsByCategory, searchProducts, updateProduct } from '../controllers/productController';
import { adminOnly, protect } from '../middlewares/auth';
const router = Router();
router.get('/', getProducts); router.get('/search', searchProducts); router.get('/category/:category', productsByCategory); router.get('/:id', getProduct);
router.post('/', protect, adminOnly, createProduct); router.put('/:id', protect, adminOnly, updateProduct); router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, addReview); router.get('/:id/reviews', getReviews); router.delete('/reviews/:id', protect, deleteReview);
export default router;
