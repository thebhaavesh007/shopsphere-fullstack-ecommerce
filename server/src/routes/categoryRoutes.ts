import { Router } from 'express';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../controllers/categoryController';
import { adminOnly, protect } from '../middlewares/auth';
const router = Router(); router.get('/', listCategories); router.post('/', protect, adminOnly, createCategory); router.put('/:id', protect, adminOnly, updateCategory); router.delete('/:id', protect, adminOnly, deleteCategory); export default router;
