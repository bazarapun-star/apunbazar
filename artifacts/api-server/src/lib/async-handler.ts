/**
 * lib/async-handler.ts — Wraps async route handlers to forward errors to Express
 *
 * Eliminates the try-catch boilerplate repeated across every route handler.
 * Any thrown error (including AppError) is forwarded to the global error handler.
 *
 * Usage:
 *   router.get("/", asyncHandler(async (req, res) => {
 *     const data = await db.select()...;
 *     res.json(data);
 *   }));
 */

import type { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response>;

export function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
