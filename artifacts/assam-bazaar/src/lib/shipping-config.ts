/**
 * shipping-config.ts
 * Path: artifacts/assam-bazaar/src/lib/shipping-config.ts
 * 
 * Shipping settings — admin se manage hoti hain, localStorage mein save hoti hain
 */

export interface ShippingConfig {
  shippingFee: number;        // default: 49
  freeShippingAbove: number;  // default: 999
  codFee: number;             // default: 30
  codEnabled: boolean;
  freeShippingEnabled: boolean;
}

export const DEFAULT_SHIPPING: ShippingConfig = {
  shippingFee: 49,
  freeShippingAbove: 999,
  codFee: 30,
  codEnabled: true,
  freeShippingEnabled: true,
};

export function loadShippingConfig(): ShippingConfig {
  try {
    const saved = localStorage.getItem("apunbazar_shipping");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SHIPPING, ...parsed };
    }
  } catch {}
  return DEFAULT_SHIPPING;
}

export function saveShippingConfig(config: ShippingConfig): void {
  localStorage.setItem("apunbazar_shipping", JSON.stringify(config));
}

/** Cart total ke hisaab se shipping calculate karo */
export function calculateShipping(
  cartTotal: number,
  paymentMethod: "cod" | "razorpay" | "online",
  config?: ShippingConfig
): { shipping: number; cod: number; total: number; isFree: boolean } {
  const c = config ?? loadShippingConfig();
  const isFree = c.freeShippingEnabled && cartTotal >= c.freeShippingAbove;
  const shipping = isFree ? 0 : c.shippingFee;
  const cod = (paymentMethod === "cod" && c.codEnabled) ? c.codFee : 0;
  return { shipping, cod, total: shipping + cod, isFree };
}