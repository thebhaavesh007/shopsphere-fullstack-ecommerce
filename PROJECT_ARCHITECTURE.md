# Project Architecture

```txt
shopsphere/
  client/
    src/
      components/      Navbar, Footer, ProductCard, Layout, Protected route
      pages/           Home, Products, Product Details, Cart, Checkout, Orders, Wishlist, Profile, Admin
      services/        Axios API client
      store/           Zustand auth and cart stores
      types/           Shared frontend TypeScript types
      utils/           Utility helpers
  server/
    src/
      config/          MongoDB connection
      controllers/     API logic for auth, products, cart, users, orders, payments, categories
      middlewares/     Auth, admin protection, validation, errors
      models/          User, Product, Category, Cart, Order, Review
      routes/          REST route definitions
      utils/           JWT helpers
    scripts/           Seed script
```

## Data Flow

1. Frontend calls API through `client/src/services/api.ts`.
2. JWT access token is attached in Authorization header.
3. Express validates protected/admin routes using middleware.
4. Controllers perform business logic.
5. Mongoose models persist data in MongoDB.
6. Stripe checkout creates hosted payment session.
7. Stripe webhook updates order payment status.

## Security Notes

- Passwords are hashed with bcrypt.
- Admin routes require role-based authorization.
- Login endpoint is rate-limited.
- Helmet sets secure HTTP headers.
- Secrets are read only from environment variables.
- Stripe webhook validates signature.
```
