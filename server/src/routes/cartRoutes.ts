import { Router } from 'express';
import { addToCart, clearCart, getCart, removeFromCart, updateCart } from '../controllers/cartController';
import { protect } from '../middlewares/auth';
const router = Router(); router.use(protect); router.get('/', getCart); router.post('/add', addToCart); router.put('/update', updateCart); router.delete('/remove/:id', removeFromCart); router.delete('/clear', clearCart); export default router;
