import { Router, type IRouter } from "express";
import { eq, and, sql, inArray } from "drizzle-orm";
import { db, wishlistItemsTable, productsTable, categoriesTable } from "@workspace/db";
import {
  GetWishlistQueryParams,
  AddToWishlistBody,
  RemoveFromWishlistParams,
} from "@workspace/api-zod";


function asyncHandler(fn: (req: any, res: any, next: any) => Promise<void>) {
  return (req: any, res: any, next: any) => fn(req, res, next).catch(next);
}

const router: IRouter = Router();

async function buildWishlist(sessionId: string) {
  const items = await db.select().from(wishlistItemsTable).where(eq(wishlistItemsTable.sessionId, sessionId));

  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = productIds.length
    ? await db.select().from(productsTable).where(inArray(productsTable.id, productIds))
    : [];
  const categoryIds = [...new Set(products.map((p) => p.categoryId))];
  const categories = categoryIds.length
    ? await db.select().from(categoriesTable).where(inArray(categoriesTable.id, categoryIds))
    : [];

  const productMap = new Map(products.map((p) => [p.id, p]));
  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  return items.map((item) => {
    const p = productMap.get(item.productId)!;
    return {
      id: item.id,
      productId: item.productId,
      sessionId: item.sessionId,
      addedAt: item.addedAt.toISOString(),
      product: p
        ? {
            id: p.id,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
            categoryId: p.categoryId,
            categoryName: catMap.get(p.categoryId) ?? "",
            imageUrl: p.imageUrl,
            images: p.images,
            stock: p.stock,
            rating: Number(p.rating),
            reviewCount: p.reviewCount,
            featured: p.featured,
            artisan: p.artisan,
            origin: p.origin,
            tags: p.tags,
            createdAt: p.createdAt.toISOString(),
          }
        : null,
    };
  });
}

router.get("/", async (req, res): Promise<void> => {
  const parsed = GetWishlistQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const wishlist = await buildWishlist(parsed.data.sessionId);
  res.json(wishlist);
});

router.post("/", async (req, res): Promise<void> => {
  const parsed = AddToWishlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { sessionId, productId } = parsed.data;
  const [existing] = await db
    .select()
    .from(wishlistItemsTable)
    .where(and(eq(wishlistItemsTable.sessionId, sessionId), eq(wishlistItemsTable.productId, productId)));

  if (!existing) {
    await db.insert(wishlistItemsTable).values({ sessionId, productId });
  }

  const wishlist = await buildWishlist(sessionId);
  res.json(wishlist);
});

router.delete("/:productId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
  const parsed = RemoveFromWishlistParams.safeParse({ productId: rawId });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    res.status(400).json({ error: "sessionId is required" });
    return;
  }

  await db
    .delete(wishlistItemsTable)
    .where(
      and(
        eq(wishlistItemsTable.sessionId, sessionId),
        eq(wishlistItemsTable.productId, parsed.data.productId)
      )
    );

  const wishlist = await buildWishlist(sessionId);
  res.json(wishlist);
});

export default router;
