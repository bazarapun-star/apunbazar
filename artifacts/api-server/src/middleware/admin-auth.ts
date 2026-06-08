/**
 * middleware/admin-auth.ts — JWT-based admin authentication middleware
 *
 * Problems fixed vs original:
 * - Original: compared a static header token against env var → trivially bypassable
 * - Original: middleware was NEVER applied to admin routes (all admin endpoints were public)
 * - Original: no token expiry, no refresh mechanism
 *
 * New approach:
 * - Signs a short-lived JWT (2h) on login
 * - Verifies JWT signature on every protected request
 * - Returns 401 with consistent error shape on failure
 */

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../app";

export interface AdminJwtPayload {
  sub: string; // admin email
  iat: number;
  exp: number;
}

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_JWT_SECRET environment variable is not set. " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
    );
  }
  return secret;
}

export function signAdminToken(email: string): string {
  return jwt.sign({ sub: email }, getJwtSecret(), {
    expiresIn: "2h",
    issuer: "apunbazar-api",
  });
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "Admin authentication required", "AUTH_MISSING");
    }

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, getJwtSecret(), {
      issuer: "apunbazar-api",
    }) as AdminJwtPayload;

    // Attach admin info to request for downstream use
    (req as Request & { admin: AdminJwtPayload }).admin = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new AppError(401, "Session expired. Please log in again.", "AUTH_EXPIRED"));
    } else if (err instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, "Invalid authentication token.", "AUTH_INVALID"));
    } else {
      next(err);
    }
  }
}


// ── Re-exported rate limiter for admin login ──────────────────────────────
// Defined here to avoid circular import (app.ts → routes → middleware)
import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please wait 15 minutes." },
  skipSuccessfulRequests: true,
});
