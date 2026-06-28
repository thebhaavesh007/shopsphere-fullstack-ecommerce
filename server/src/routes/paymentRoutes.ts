import { Router } from 'express';
import { createCheckoutSession, verifyPayment, webhook } from '../controllers/paymentController';
import { protect } from '../middlewares/auth';
const router = Router(); router.post('/create-checkout-session', protect, createCheckoutSession); router.post('/webhook', webhook); router.get('/verify/:id', protect, verifyPayment); export default router;
