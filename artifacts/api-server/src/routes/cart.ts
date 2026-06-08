import { Router, type IRouter } from "express";
import { eq, and, inArray } from "drizzle-orm";
import { db, cartItemsTable, productsTable, categoriesTable } from "@workspace/db";
import {
  GetCartQueryParams,
  AddToCartBody,
  UpdateCartItemParams,
  UpdateCartItemBody,
  RemoveFromCartParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function buildCart(sessionId: string) {
  const items = await db.select().from(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

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

  const cartItems = items.map((item) => {
    const p = productMap.get(item.productId);
    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      sessionId: item.sessionId,
      product: p
        ? {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: Number(p.price),
            originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
            categoryId: p.categoryId,
            categoryName: catMap.get(p.categoryId) ?? "",
            imageUrl: p.imageUrl,
            images: p.images ?? [],
            stock: p.stock,
            rating: Number(p.rating),
            reviewCount: p.reviewCount,
            featured: p.featured,
            artisan: p.artisan ?? null,
            origin: p.origin ?? null,
            tags: p.tags ?? [],
            createdAt: p.createdAt.toISOString(),
          }
        : null,
    };
  });

  const total = cartItems.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0);
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return { items: cartItems, total, itemCount };
}

router.get("/", async (req, res): Promise<void> => {
  try {
    const parsed = GetCartQueryParams.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
    const cart = await buildCart(parsed.data.sessionId);
    res.json(cart);
  } catch (err) {
    console.error("GET /cart error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

router.post("/", async (req, res): Promise<void> => {
  try {
    const parsed = AddToCartBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

    const { sessionId, productId, quantity } = parsed.data;

    // Validate product exists and has stock
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }
    if (product.stock < quantity) { res.status(400).json({ error: "Insufficient stock" }); return; }

    const [existing] = await db
      .select()
      .from(cartItemsTable)
      .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty) { res.status(400).json({ error: "Insufficient stock" }); return; }
      await db.update(cartItemsTable).set({ quantity: newQty }).where(eq(cartItemsTable.id, existing.id));
    } else {
      await db.insert(cartItemsTable).values({ sessionId, productId, quantity });
    }

    const cart = await buildCart(sessionId);
    res.json(cart);
  } catch (err) {
    console.error("POST /cart error:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

router.put("/:itemId", async (req, res): Promise<void> => {
  try {
    const rawId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
    const params = UpdateCartItemParams.safeParse({ itemId: rawId });
    if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

    const parsed = UpdateCartItemBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

    const [item] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, params.data.itemId));
    if (!item) { res.status(404).json({ error: "Cart item not found" }); return; }

    if (parsed.data.quantity <= 0) {
      await db.delete(cartItemsTable).where(eq(cartItemsTable.id, params.data.itemId));
    } else {
      await db.update(cartItemsTable).set({ quantity: parsed.data.quantity }).where(eq(cartItemsTable.id, params.data.itemId));
    }

    const cart = await buildCart(item.sessionId);
    res.json(cart);
  } catch (err) {
    console.error("PUT /cart/:itemId error:", err);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

router.delete("/:itemId", async (req, res): Promise<void> => {
  try {
    const rawId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
    const params = RemoveFromCartParams.safeParse({ itemId: rawId });
    if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

    const [item] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, params.data.itemId));
    if (!item) { res.status(404).json({ error: "Cart item not found" }); return; }

    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, params.data.itemId));
    const cart = await buildCart(item.sessionId);
    res.json(cart);
  } catch (err) {
    console.error("DELETE /cart/:itemId error:", err);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
});

export default router;
