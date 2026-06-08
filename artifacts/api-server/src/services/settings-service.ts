/**
 * services/settings-service.ts — Server-side settings management
 *
 * This service replaces the localStorage-based shipping config and coupons
 * with a proper database-backed implementation.
 *
 * Problems this fixes:
 * - Shipping config stored in localStorage could be manipulated by users
 * - Coupons stored in localStorage only existed in the admin's browser
 * - Shipping fee was hardcoded in orders.ts (999/49/30) — now reads from DB
 *
 * Setup required:
 * - Run the migration to create the `settings` table (see db/src/schema/settings.ts)
 * - Run the migration to create the `coupons` table (see db/src/schema/coupons.ts)
 */

import { db } from "@workspace/db";
import { settingsTable, couponsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// ── Shipping config types ──────────────────────────────────────────────────
export interface ShippingConfig {
  shippingFee: number;
  freeShippingAbove: number;
  codFee: number;
  codEnabled: boolean;
  freeShippingEnabled: boolean;
}

const DEFAULT_SHIPPING: ShippingConfig = {
  shippingFee: 49,
  freeShippingAbove: 999,
  codFee: 30,
  codEnabled: true,
  freeShippingEnabled: true,
};

// Simple in-memory cache — invalidated when settings are updated
let shippingConfigCache: ShippingConfig | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getShippingConfig(): Promise<ShippingConfig> {
  if (shippingConfigCache && Date.now() < cacheExpiresAt) {
    return shippingConfigCache;
  }

  try {
    const [row] = await db
      .select({ value: settingsTable.value })
      .from(settingsTable)
      .where(eq(settingsTable.key, "shipping_config"))
      .limit(1);

    if (row?.value) {
      const parsed = JSON.parse(row.value) as Partial<ShippingConfig>;
      shippingConfigCache = { ...DEFAULT_SHIPPING, ...parsed };
    } else {
      shippingConfigCache = { ...DEFAULT_SHIPPING };
    }
  } catch {
    shippingConfigCache = { ...DEFAULT_SHIPPING };
  }

  cacheExpiresAt = Date.now() + CACHE_TTL_MS;
  return shippingConfigCache;
}

export async function saveShippingConfig(config: ShippingConfig): Promise<void> {
  await db
    .insert(settingsTable)
    .values({ key: "shipping_config", value: JSON.stringify(config) })
    .onConflictDoUpdate({
      target: settingsTable.key,
      set: { value: JSON.stringify(config), updatedAt: new Date() },
    });

  // Invalidate cache
  shippingConfigCache = null;
  cacheExpiresAt = 0;
}

export function calculateShipping(
  cartTotal: number,
  paymentMethod: "cod" | "razorpay",
  config: ShippingConfig,
): { shipping: number; codFee: number; total: number; isFree: boolean } {
  const isFree = config.freeShippingEnabled && cartTotal >= config.freeShippingAbove;
  const shipping = isFree ? 0 : config.shippingFee;
  const codFee = paymentMethod === "cod" && config.codEnabled ? config.codFee : 0;
  return { shipping, codFee, total: shipping + codFee, isFree };
}
