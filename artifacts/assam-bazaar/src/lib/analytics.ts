/**
 * lib/analytics.ts — Google Analytics 4 + Microsoft Clarity
 *
 * - Production-only loading
 * - Non-blocking script injection
 * - Wouter router integration
 * - Full e-commerce event tracking
 */

// ── Types ──────────────────────────────────────────────────────────────────
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    clarity: (method: string, ...args: unknown[]) => void;
  }
}

export interface AnalyticsProduct {
  id: string | number;
  name: string;
  price: number;
  category?: string;
  quantity?: number;
  coupon?: string;
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;
const isProd = import.meta.env.PROD;

// ── Script Loaders ─────────────────────────────────────────────────────────
function loadGoogleAnalytics(measurementId: string): void {
  if (document.getElementById("ga-script")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false, // We send manually on route change
    cookie_flags: "SameSite=None;Secure",
  });

  const script = document.createElement("script");
  script.id = "ga-script";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);
}

function loadMicrosoftClarity(projectId: string): void {
  if (document.getElementById("clarity-script")) return;

  // Clarity inline init (from official snippet)
  (function (c: Window, l: Document, a: string, r: string, i: string) {
    (c as unknown as Record<string, unknown>)[a] =
      (c as unknown as Record<string, unknown>)[a] ||
      function (...args: unknown[]) {
        ((c as unknown as Record<string, unknown[]>)[a + "q"] =
          (c as unknown as Record<string, unknown[]>)[a + "q"] || []).push(args);
      };
    const t = l.createElement(r) as HTMLScriptElement;
    t.id = "clarity-script";
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y?.parentNode?.insertBefore(t, y);
  })(window, document, "clarity", "script", projectId);
}

// ── Initialize ─────────────────────────────────────────────────────────────
export function initAnalytics(): void {
  if (!isProd) return; // Dev mein load mat karo

  if (GA_ID) loadGoogleAnalytics(GA_ID);
  if (CLARITY_ID) loadMicrosoftClarity(CLARITY_ID);
}

// ── Page View ──────────────────────────────────────────────────────────────
export function trackPageView(path: string, title?: string): void {
  if (!isProd || !GA_ID) return;

  window.gtag?.("event", "page_view", {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

// ── E-Commerce Events ──────────────────────────────────────────────────────

/** Product detail page view */
export function trackViewItem(product: AnalyticsProduct): void {
  if (!isProd || !GA_ID) return;

  window.gtag?.("event", "view_item", {
    currency: "INR",
    value: product.price,
    items: [formatItem(product)],
  });
}

/** Add to cart */
export function trackAddToCart(product: AnalyticsProduct): void {
  if (!isProd || !GA_ID) return;

  window.gtag?.("event", "add_to_cart", {
    currency: "INR",
    value: product.price * (product.quantity || 1),
    items: [formatItem(product)],
  });
}

/** Remove from cart */
export function trackRemoveFromCart(product: AnalyticsProduct): void {
  if (!isProd || !GA_ID) return;

  window.gtag?.("event", "remove_from_cart", {
    currency: "INR",
    value: product.price * (product.quantity || 1),
    items: [formatItem(product)],
  });
}

/** Add to wishlist */
export function trackAddToWishlist(product: AnalyticsProduct): void {
  if (!isProd || !GA_ID) return;

  window.gtag?.("event", "add_to_wishlist", {
    currency: "INR",
    value: product.price,
    items: [formatItem(product)],
  });
}

/** Checkout begin */
export function trackBeginCheckout(
  products: AnalyticsProduct[],
  value: number,
  coupon?: string,
): void {
  if (!isProd || !GA_ID) return;

  window.gtag?.("event", "begin_checkout", {
    currency: "INR",
    value,
    coupon,
    items: products.map(formatItem),
  });
}

/** Purchase complete */
export function trackPurchase(
  orderId: string,
  products: AnalyticsProduct[],
  value: number,
  shipping: number,
  coupon?: string,
): void {
  if (!isProd || !GA_ID) return;

  window.gtag?.("event", "purchase", {
    transaction_id: orderId,
    currency: "INR",
    value,
    shipping,
    coupon,
    items: products.map(formatItem),
  });
}

/** Search */
export function trackSearch(searchTerm: string): void {
  if (!isProd || !GA_ID) return;
  window.gtag?.("event", "search", { search_term: searchTerm });
}

/** Coupon applied */
export function trackCouponApplied(couponCode: string, discount: number): void {
  if (!isProd || !GA_ID) return;

  window.gtag?.("event", "select_promotion", {
    promotion_id: couponCode,
    promotion_name: couponCode,
    creative_slot: "checkout",
    discount,
  });
}

// ── Microsoft Clarity Custom Tags ─────────────────────────────────────────
export function clarityTag(key: string, value: string): void {
  if (!isProd || !CLARITY_ID) return;
  window.clarity?.("set", key, value);
}

export function clarityEvent(name: string): void {
  if (!isProd || !CLARITY_ID) return;
  window.clarity?.("event", name);
}

// ── Helper ─────────────────────────────────────────────────────────────────
function formatItem(p: AnalyticsProduct) {
  return {
    item_id: String(p.id),
    item_name: p.name,
    item_category: p.category || "General",
    price: p.price,
    quantity: p.quantity || 1,
    currency: "INR",
    coupon: p.coupon,
  };
}
