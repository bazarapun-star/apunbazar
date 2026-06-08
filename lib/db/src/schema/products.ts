/**
 * schema/products.ts — Products table with indexes
 *
 * Problems fixed vs original:
 * - No indexes on categoryId, featured, slug — added
 * - Missing updatedAt trigger — was present, kept
 */

import {
  pgTable,
  text,
  serial,
  integer,
  numeric,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
    categoryId: integer("category_id").notNull(),
    imageUrl: text("image_url").notNull(),
    slug: text("slug").notNull().default(""),
    images: text("images").array().notNull().default([]),
    stock: integer("stock").notNull().default(0),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("0"),
    reviewCount: integer("review_count").notNull().default(0),
    featured: boolean("featured").notNull().default(false),
    artisan: text("artisan"),
    origin: text("origin"),
    tags: text("tags").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // Critical for category page queries: GET /products?category=X
    categoryIdIdx: index("products_category_id_idx").on(table.categoryId),
    // Critical for featured products endpoint
    featuredIdx: index("products_featured_idx").on(table.featured),
    // Critical for product slug lookups
    slugIdx: index("products_slug_idx").on(table.slug),
    // Supports price range sorting
    priceIdx: index("products_price_idx").on(table.price),
    // Supports new arrivals / sort by date
    createdAtIdx: index("products_created_at_idx").on(table.createdAt),
  }),
);

export const insertProductSchema = createInsertSchema(productsTable)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    // Enforce search string max length at schema level
    name: z.string().min(1).max(200),
    description: z.string().min(1).max(5000),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal"),
  });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
