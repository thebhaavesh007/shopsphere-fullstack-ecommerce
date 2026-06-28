import { Request, Response } from 'express';
import Stripe from 'stripe';
import Order from '../models/Order';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_replace', { apiVersion: '2023-10-16' });

export async function createCheckoutSession(req: Request, res: Response) {
  const order = await Order.findById(req.body.orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment/failure`,
    line_items: order.items.map((i: any) => ({ price_data: { currency: 'inr', product_data: { name: i.name }, unit_amount: Math.round(i.price * 100) }, quantity: i.quantity })),
    metadata: { orderId: order._id.toString() }
  });
  order.stripeSessionId = session.id; await order.save(); res.json({ url: session.url, sessionId: session.id });
}
export async function webhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET || '');
    if (event.type === 'checkout.session.completed') {
      const session: any = event.data.object;
      await Order.findByIdAndUpdate(session.metadata.orderId, { paymentStatus: 'paid', orderStatus: 'Processing' });
    }
    res.json({ received: true });
  } catch (err: any) { res.status(400).send(`Webhook Error: ${err.message}`); }
}
export async function verifyPayment(req: Request, res: Response) { const order = await Order.findOne({ stripeSessionId: req.params.id }); res.json({ paid: order?.paymentStatus === 'paid', order }); }
