Summary of changes applied by automated safety patch

1) Security fixes
- Sanitized HTML rendering for product descriptions to prevent XSS: app/products/[slug]/page.tsx
- Sanitized Algolia highlight HTML before inserting into DOM: components/products/algolia.tsx
- Replaced hardcoded Stripe return_url with dynamic origin: components/cart/payment-form.tsx
- Moved DB connection string usage to environment variable fallback: server/schema.ts

2) Authorization & integrity
- Added admin role checks to mutation actions: server/action/add-product.ts, server/action/delete-product.ts, server/action/add-variant.ts, server/action/delete-variant.ts
- Fixed delete-variant result check typo: server/action/delete-variant.ts

3) Inventory & payment hardening
- Added `stock` column to productVariants schema (server/schema.ts) and updated variant schema to accept stock (types/variantSchema.ts)
- Payment intent now validates available stock before creating Stripe payment intent (server/action/create-payment-intent.ts)
- Order creation now decrements stock inside a DB transaction and prevents overselling (server/action/create-order.ts)
- Added a simple in-memory rate limiter for payment intent creation (demo-only; replace with Redis for prod)

4) CI & tests
- Added a minimal smoke test and CI workflow: tests/run-format-test.js and .github/workflows/ci.yml

Notes and next recommended steps
- You must run database migrations to add the `stock` column (drizzle-kit migration or SQL) before relying on stock behavior in production.
- Replace the in-memory rate limiter with a distributed store (Redis/Upstash) for real deployments.
- Add integration tests for payment flows and authentication; current tests are a minimal smoke test to validate CI runs.
