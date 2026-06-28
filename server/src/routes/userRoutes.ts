import { Router } from 'express';
import { addWishlist, adminUsers, changePassword, deleteUser, getWishlist, profile, removeWishlist, updateProfile, updateUserRole } from '../controllers/userController';
import { adminOnly, protect } from '../middlewares/auth';
const router = Router();
router.get('/profile', protect, profile); router.put('/profile', protect, updateProfile); router.put('/change-password', protect, changePassword);
router.get('/wishlist', protect, getWishlist); router.post('/wishlist/add', protect, addWishlist); router.delete('/wishlist/remove/:id', protect, removeWishlist);
router.get('/admin/users', protect, adminOnly, adminUsers); router.put('/admin/users/:id/role', protect, adminOnly, updateUserRole); router.delete('/admin/users/:id', protect, adminOnly, deleteUser);
export default router;
