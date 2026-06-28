import { Router } from 'express';
import { adminOrders, createOrder, dashboard, myOrders, orderById, updateStatus } from '../controllers/orderController';
import { adminOnly, protect } from '../middlewares/auth';
const router = Router();
router.post('/', protect, createOrder); router.get('/my-orders', protect, myOrders); router.get('/:id', protect, orderById);
router.get('/admin/orders/all', protect, adminOnly, adminOrders); router.put('/admin/orders/:id/status', protect, adminOnly, updateStatus); router.get('/admin/dashboard/summary', protect, adminOnly, dashboard);
export default router;
