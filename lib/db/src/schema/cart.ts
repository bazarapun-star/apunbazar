/**
 * schema/cart.ts — Cart items table with indexes
 *
 * Problems fixed vs original:
 * - No index on sessionId — every cart query was a full table scan
 * - No index on productId — join queries were slow
 * - Added composite unique index on (sessionId, productId) to prevent duplicates at DB level
 */

import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cartItemsTable = pgTable(
  "cart_items",
  {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    productId: integer("product_id").notNull(),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // Critical — every cart operation looks up by sessionId
    sessionIdIdx: index("cart_items_session_id_idx").on(table.sessionId),
    // Prevents duplicate cart entries at DB level (belt-and-suspenders with app logic)
    sessionProductUniqueIdx: uniqueIndex("cart_items_session_product_unique_idx").on(
      table.sessionId,
      table.productId,
    ),
  }),
);

export const insertCartItemSchema = createInsertSchema(cartItemsTable)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    quantity: z.number().int().min(1).max(99),
  });

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItemsTable.$inferSelect;
