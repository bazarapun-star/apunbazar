/**
 * routes/payments.ts — Razorpay payment integration
 *
 * Problems fixed vs original:
 * - CRITICAL: Added /verify endpoint with HMAC signature validation
 *   (without this, anyone can spoof a successful payment)
 * - Razorpay SDK instantiated once at module load, not per-request
 * - Amount validation strengthened (min/max bounds)
 * - Order creation and DB update wrapped in asyncHandler
 * - Payment success marks the corresponding order as paid in DB
 */

import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { z } from "zod";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { asyncHandler } from "../lib/async-handler";
import { AppError } from "../app";
import { logger } from "../lib/logger";

const router = Router();

// ── Razorpay singleton — initialized once, validated at startup ────────────
function createRazorpayInstance(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

let razorpayInstance: Razorpay | null = createRazorpayInstance();

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    throw new AppError(
      503,
      "Payment gateway is not configured. Please contact support.",
      "PAYMENT_NOT_CONFIGURED",
    );
  }
  return razorpayInstance;
}

// ── Validation schemas ─────────────────────────────────────────────────────
const CreateOrderSchema = z.object({
  amount: z
    .number({ required_error: "Amount is required" })
    .positive("Amount must be positive")
    .max(500_000, "Amount exceeds maximum order value"),
});

const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  orderId: z.number().int().positive(), // Our internal order ID
});

// ── POST /api/payments/razorpay-order ─────────────────────────────────────
// Creates a Razorpay order for the given amount (in INR rupees)
router.post(
  "/razorpay-order",
  asyncHandler(async (req, res) => {
    const parsed = CreateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0].message, "VALIDATION_ERROR");
    }

    const rz = getRazorpay();
    const amountPaise = Math.round(parsed.data.amount * 100); // Convert ₹ to paise

    const order = await rz.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `ab_${Date.now()}`,
    });

    res.json({
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
    });
  }),
);

// ── POST /api/payments/verify ──────────────────────────────────────────────
// Verifies Razorpay payment signature and marks order as paid.
// MUST be called after Razorpay checkout succeeds on the frontend.
//
// Razorpay signature = HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id)
// using the Razorpay key secret.
router.post(
  "/verify",
  asyncHandler(async (req, res) => {
    const parsed = VerifyPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0].message, "VALIDATION_ERROR");
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = parsed.data;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new AppError(503, "Payment gateway not configured.", "PAYMENT_NOT_CONFIGURED");
    }

    // Compute expected signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    // Timing-safe comparison prevents timing attacks
    const sigBuffer = Buffer.from(razorpay_signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    const isValid =
      sigBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(sigBuffer, expectedBuffer);

    if (!isValid) {
      logger.warn(
        { razorpay_order_id, orderId },
        "Razorpay signature verification failed",
      );
      throw new AppError(400, "Payment verification failed. Invalid signature.", "PAYMENT_INVALID");
    }

    // Update order status in DB
    const [order] = await db
      .update(ordersTable)
      .set({ paymentStatus: "paid", status: "confirmed" })
      .where(eq(ordersTable.id, orderId))
      .returning({ id: ordersTable.id, orderNumber: ordersTable.orderNumber });

    if (!order) {
      throw new AppError(404, "Order not found for payment verification.", "NOT_FOUND");
    }

    logger.info(
      { orderId, orderNumber: order.orderNumber, razorpay_payment_id },
      "Payment verified successfully",
    );

    res.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentId: razorpay_payment_id,
    });
  }),
);

export default router;
