# ShopSphere Deployment Guide

## Recommended Production Stack

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas
- Payments: Stripe

## Backend Deployment

1. Push project to GitHub.
2. Create a MongoDB Atlas database and copy connection string.
3. Create a new Render/Railway service from `/server`.
4. Set build command: `npm install && npm run build`.
5. Set start command: `npm start`.
6. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=your_mongodb_atlas_uri`
   - `CLIENT_URL=https://your-vercel-app.vercel.app`
   - `JWT_ACCESS_SECRET=long_random_secret`
   - `JWT_REFRESH_SECRET=another_long_random_secret`
   - `STRIPE_SECRET_KEY=your_stripe_secret_key`
   - `STRIPE_WEBHOOK_SECRET=your_webhook_secret`

## Frontend Deployment

1. Import GitHub repo into Vercel.
2. Select `/client` as root directory.
3. Add environment variable:
   - `VITE_API_URL=https://your-backend-url.com/api`
4. Deploy.

## Stripe Webhook

Add webhook endpoint in Stripe dashboard:

`https://your-backend-url.com/api/payments/webhook`

Events:
- `checkout.session.completed`

## Production Checklist

- Replace default JWT secrets.
- Use real MongoDB Atlas URI.
- Use Stripe live keys only after testing.
- Set correct CORS frontend URL.
- Create admin user using seed script or database console.
- Test login, cart, COD order, Stripe payment, and admin routes.
