/**
 * schema/settings.ts — Application settings and coupons tables
 *
 * These tables replace the localStorage-based approach used in the original
 * codebase for shipping config and coupons — which meant:
 * 1. Settings only existed in the admin's browser (no cross-device persistence)
 * 2. Coupons could be fabricated by any user via DevTools
 * 3. Shipping fees could be manipulated client-side
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
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ── Settings — key/value store for admin-configurable options ──────────────
export const settingsTable = pgTable(
  "settings",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull().unique(),
    value: text("value").notNull(), // JSON-encoded value
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    keyIdx: uniqueIndex("settings_key_idx").on(table.key),
  }),
);

// ── Coupons ────────────────────────────────────────────────────────────────
export const couponsTable = pgTable(
  "coupons",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(),
    discountType: text("discount_type", { enum: ["percent", "flat"] }).notNull(),
    discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
    minimumOrderValue: numeric("minimum_order_value", {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .default("0"),
    maxUses: integer("max_uses"), // null = unlimited
    usedCount: integer("used_count").notNull().default(0),
    active: boolean("active").notNull().default(true),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    codeIdx: uniqueIndex("coupons_code_idx").on(table.code),
    activeIdx: index("coupons_active_idx").on(table.active),
  }),
);

export const insertCouponSchema = createInsertSchema(couponsTable)
  .omit({ id: true, usedCount: true, createdAt: true, updatedAt: true })
  .extend({
    code: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[A-Z0-9_-]+$/, "Coupon code must be uppercase alphanumeric"),
    discountValue: z.string().regex(/^\d+(\.\d{1,2})?$/, "Must be a valid decimal"),
  });

export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof couponsTable.$inferSelect;
export type Setting = typeof settingsTable.$inferSelect;
