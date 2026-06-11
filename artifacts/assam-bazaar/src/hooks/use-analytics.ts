/**
 * hooks/use-analytics.ts — Wouter route change tracking hook
 *
 * Usage: call usePageTracking() once in App.tsx
 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackPageView } from "@/lib/analytics";

const PAGE_TITLES: Record<string, string> = {
  "/": "Home — ApunBazar",
  "/products": "Products — ApunBazar",
  "/cart": "Cart — ApunBazar",
  "/wishlist": "Wishlist — ApunBazar",
  "/checkout": "Checkout — ApunBazar",
  "/about": "About Us — ApunBazar",
  "/contact": "Contact — ApunBazar",
};

export function usePageTracking(): void {
  const [location] = useLocation();

  useEffect(() => {
    // Small delay so document.title updates first
    const timer = setTimeout(() => {
      const title =
        PAGE_TITLES[location] ||
        (location.startsWith("/products/")
          ? "Product Detail — ApunBazar"
          : location.startsWith("/orders/")
            ? "Order Detail — ApunBazar"
            : location.startsWith("/admin")
              ? undefined // Admin pages — skip tracking
              : document.title);

      if (title) {
        trackPageView(location, title);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);
}
