# NextBuy

NextBuy is a full-stack Next.js e-commerce demo with product browsing, search, auth, reviews, Stripe checkout, admin product management, and inventory-aware transactions.

## What it shows
- App Router architecture with Server Components and Server Actions
- Stripe checkout with webhook-driven order updates
- Auth with credentials and OAuth
- Algolia product search and tag filtering
- Inventory tracked at the variant level
- Admin dashboard for product management and analytics
- Review and rating system
- CI smoke test and production-oriented checks

## Tech Stack
- Next.js 15
- React 19
- TypeScript
- Drizzle ORM
- PostgreSQL
- Stripe
- NextAuth v5
- Algolia
- Zustand
- Tailwind CSS
- Radix UI

## Features
- Searchable product catalog
- Product variants with images, tags, and color options
- Cart and checkout flow
- Stripe payment intent + webhook flow
- Order creation with transactional stock updates
- User authentication and social login
- Admin dashboard for products, orders, analytics, and settings
- Review system with ratings and comments
- Home page showcase with a more polished storefront layout

## Environment Variables
Create a `.env.local` file with the values your app needs:

```bash
AUTH_SECRET=
AUTH_URL=
POSTGRES_URL=
NEXT_PUBLIC_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_ALGOLIA_ID=
ALGOLIA_ADMIN=
NEXT_PUBLIC_UPLOADTHING_APP_ID=
UPLOADTHING_SECRET=
```

## Getting Started

```bash
npm install
npm run db:push
npm run dev
```

Open `http://localhost:3000` after the dev server starts.

## Scripts
- `npm run dev` - start the development server
- `npm run build` - build the app for production
- `npm run start` - run the production server
- `npm run lint` - lint the project
- `npm test` - run the smoke test
- `npm run db:generate` - generate Drizzle migrations
- `npm run db:push` - push the schema to the database

## Inventory and Transactions
Inventory is stored on each product variant through the `stock` field. Checkout validates available stock before creating a payment intent, and order creation decrements stock inside a database transaction so overselling is prevented.

## CI
GitHub Actions runs a simple smoke test plus a build on every push and pull request. It is intentionally lightweight right now, but it proves the project can compile and run in CI.

## Deployment
If you deploy on Vercel, connect the GitHub repo and add all environment variables in the Vercel dashboard. The deployment will fail without the required Stripe, auth, Algolia, and database values.

## Notes
This repository is intended to show full-stack product work: auth, checkout, transactions, dashboard flows, and safer server-side handling.
