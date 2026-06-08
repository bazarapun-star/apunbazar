/**
 * hooks/use-shop-data.ts — Cart and wishlist data hooks
 *
 * Problems fixed vs original:
 * - query.data as any replaced with typed response
 * - useInvalidateCart / useInvalidateWishlist are stable via useCallback
 */

import { useCallback } from "react";
import { useSession } from "./use-session";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCart,
  getGetCartQueryKey,
  useGetWishlist,
  getGetWishlistQueryKey,
} from "@workspace/api-client-react";

// ── Cart ───────────────────────────────────────────────────────────────────
export function useCart() {
  const { sessionId } = useSession();

  const query = useGetCart(
    { sessionId },
    {
      query: {
        enabled: Boolean(sessionId),
        queryKey: getGetCartQueryKey({ sessionId }),
      },
    },
  );

  const cartData = query.data as {
    items: Array<{
      id: number;
      productId: number;
      quantity: number;
      sessionId: string;
      product: Record<string, unknown> | null;
    }>;
    total: number;
    itemCount: number;
  } | undefined;

  return {
    cart: cartData ?? null,
    items: cartData?.items ?? [],
    total: cartData?.total ?? 0,
    itemCount: cartData?.itemCount ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

// ── Wishlist ───────────────────────────────────────────────────────────────
export function useWishlist() {
  const { sessionId } = useSession();

  const query = useGetWishlist(
    { sessionId },
    {
      query: {
        enabled: Boolean(sessionId),
        queryKey: getGetWishlistQueryKey({ sessionId }),
      },
    },
  );

  return {
    wishlistItems: (query.data as unknown[]) ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

// ── Invalidation helpers ───────────────────────────────────────────────────
export function useInvalidateCart() {
  const queryClient = useQueryClient();
  const { sessionId } = useSession();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) }),
    [queryClient, sessionId],
  );
}

export function useInvalidateWishlist() {
  const queryClient = useQueryClient();
  const { sessionId } = useSession();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey({ sessionId }) }),
    [queryClient, sessionId],
  );
}
