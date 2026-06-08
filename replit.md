# ApunBazar — E-Commerce Platform

A mobile-first e-commerce web application celebrating Assamese culture and local products. Built with React + Vite frontend, Express API server, and PostgreSQL + Drizzle ORM.

## Architecture

**Monorepo (pnpm workspaces)**

```
artifacts/
  assam-bazaar/        # React + Vite frontend (previewPath: /)
  api-server/          # Express API server (previewPath: /api)
lib/
  db/                  # Drizzle ORM schema + migrations
  api-spec/            # OpenAPI specification
  api-zod/             # Generated Zod validators (from codegen)
  api-client-react/    # Generated React Query hooks (from codegen)
```

## Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, shadcn/ui, wouter (routing), TanStack Query
- **Backend**: Express.js, Drizzle ORM, PostgreSQL
- **Design**: Assamese cultural palette — forest green primary, terracotta secondary, golden gamosa accent
- **Fonts**: Playfair Display (serif headings), Inter (body)

## Features

### Customer-facing
- **Home**: Hero section, category grid, featured products, artisan stats, testimonials
- **Products**: Browse with category filter sidebar, search, price range slider, sort, pagination
- **Product Detail**: Image gallery, quantity picker, add to cart/wishlist, related products
- **Cart**: Session-based cart (localStorage sessionId), quantity management, order summary
- **Wishlist**: Save products, move to cart
- **Checkout**: Full form (contact, shipping, payment), COD and online payment, order confirmation
- **Order Tracking**: Search by email, order detail with status timeline

### Admin Panel (`/admin`)
- **Dashboard**: Revenue stats, orders, products, customers; sales-by-category chart; top products; recent orders table
- **Products**: CRUD — create/edit/delete with dialog form, search, pagination
- **Orders**: Status management with inline dropdowns, filters, pagination

## Database Schema

- `categories` — product categories with slugs
- `products` — full product info (price, images, artisan, origin, tags, featured flag)
- `cart_items` — session-based cart (anonymous users via localStorage sessionId)
- `wishlist_items` — session-based wishlist
- `orders` — customer orders with embedded JSON items array

## Key Patterns

- **Session management**: Anonymous users identified by UUID in `localStorage("assam-bazaar-session-id")`
- **API contracts**: OpenAPI spec → Orval codegen → Zod validators + React Query hooks
- **Routing**: wouter with `useLocation()`-based admin/customer layout splitting
- **Drizzle queries**: Use `inArray()` not raw SQL `ANY()` for array membership
- **Decimal columns**: Stored as `numeric` strings in DB, converted to `Number()` in response

## Running

Workflows auto-start both services. The proxy routes:
- `/` → assam-bazaar Vite dev server (port varies)
- `/api` → Express API server (port 8080)

## Codegen

After modifying OpenAPI spec:
```bash
pnpm --filter @workspace/api-spec run codegen
# Then fix: lib/api-zod/src/index.ts must ONLY contain:
# export * from "./generated/api";
```

## Seeded Data

- 5 categories: Handloom & Textiles, Assam Tea, Handicrafts, Organic Food, Traditional Bags
- 15 products with real Unsplash images, artisan names, origins, ratings
