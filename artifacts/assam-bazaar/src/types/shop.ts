/**
 * types/shop.ts — Shared domain types for the frontend
 *
 * These types replace the scattered `any` usage throughout the codebase.
 * They mirror the API response shapes — ideally generated from the OpenAPI spec
 * via Orval (which is already configured in lib/api-spec/orval.config.ts).
 *
 * Until Orval generation is set up for all types, these serve as the source of truth.
 */

// ── Product ────────────────────────────────────────────────────────────────
export interface FormattedProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  imageUrl: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  artisan: string | null;
  origin: string | null;
  tags: string[];
  createdAt: string;
}

// ── Category ───────────────────────────────────────────────────────────────
export interface MainCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface MainCategoryWithCount extends MainCategory {
  productCount: number;
}

// ── Cart ───────────────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  sessionId: string;
  product: FormattedProduct | null;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// ── Order ──────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "cod" | "razorpay";

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Coupon ─────────────────────────────────────────────────────────────────
export interface Coupon {
  id: number;
  code: string;
  discountType: "percent" | "flat";
  discountValue: number;
  minimumOrderValue: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
}

// ── Shipping ───────────────────────────────────────────────────────────────
export interface ShippingConfig {
  shippingFee: number;
  freeShippingAbove: number;
  codFee: number;
  codEnabled: boolean;
  freeShippingEnabled: boolean;
}

// ── Pagination ─────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
