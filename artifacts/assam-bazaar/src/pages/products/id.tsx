import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Link } from "wouter";
import {
  useGetProduct,
  useAddToCart,
  useAddToWishlist,
  useListProducts,
  getGetProductQueryKey,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ArrowLeft,
  Package,
  MapPin,
  Zap,
  Share2,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Lock,
  Headphones,
} from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { useInvalidateCart, useInvalidateWishlist, useWishlist } from "@/hooks/use-shop-data";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/product-card";
import ReviewSystem from "@/components/reviews/ReviewSystem";
import { motion, AnimatePresence } from "framer-motion";
import { ProductWhatsAppButton } from "@/components/WhatsAppButtons";
import { ShareButtons } from "@/components/ShareButtons";
import { NotifyMe } from "@/components/NotifyMe";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const SIZE_CATEGORIES = ["handloom", "bags"];

const TRUST_ITEMS = [
  { icon: Truck, label: "Free shipping ₹499+" },
  { icon: ShieldCheck, label: "100% authentic" },
  { icon: RefreshCw, label: "7-day easy returns" },
  { icon: Lock, label: "Secure payment" },
  { icon: Headphones, label: "24/7 WhatsApp & email support", full: true },
];

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0", 10);
  const [, navigate] = useLocation();
  const { sessionId } = useSession();
  const { toast } = useToast();
  const invalidateCart = useInvalidateCart();
  const invalidateWishlist = useInvalidateWishlist();
  const { wishlist } = useWishlist();

  const { data: product, isLoading } = useGetProduct(id, {
    query: { enabled: !!id, queryKey: getGetProductQueryKey(id) },
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  // Try same category first; fallback to all products so section always renders
  const { data: relatedByCat } = useListProducts({
    category: product?.categorySlug,
    limit: 8,
  });
  const { data: allProducts } = useListProducts({ limit: 8 });

  const relatedList = (() => {
    const catItems = (relatedByCat?.products ?? []).filter((p) => p.id !== product?.id);
    if (catItems.length >= 2) return catItems.slice(0, 4);
    // fallback: use all products, exclude current
    return (allProducts?.products ?? []).filter((p) => p.id !== product?.id).slice(0, 4);
  })();

  const related = { products: relatedList };

  const isInWishlist = wishlist?.some((w) => w.productId === product?.id) ?? false;
  const showSizes = product?.categorySlug ? SIZE_CATEGORIES.includes(product.categorySlug) : false;

  function handleAddToCart(then?: () => void) {
    if (!sessionId || !product) return;
    if (showSizes && !selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    addToCart.mutate(
      { data: { sessionId, productId: product.id, quantity } },
      {
        onSuccess: () => {
          invalidateCart();
          toast({
            title: "Cart mein add ho gaya! 🛍️",
            description: `${quantity}× ${product.name}${selectedSize ? ` (${selectedSize})` : ""}`,
          });
          then?.();
        },
      }
    );
  }

  function handleBuyNow() {
    handleAddToCart(() => navigate("/checkout"));
  }

  function handleAddToWishlist() {
    if (!sessionId || !product) return;
    addToWishlist.mutate(
      { data: { sessionId, productId: product.id } },
      {
        onSuccess: () => {
          invalidateWishlist();
          toast({ title: "Wishlist mein add kar diya! ❤️" });
        },
      }
    );
  }

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = product ? [product.imageUrl, ...(product.images ?? [])] : [];

  useEffect(() => {
    if (!product?.id) return;
    try {
      const key = "apunbazar_recently_viewed";
      const prev: number[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      const updated = [product.id, ...prev.filter((i) => i !== product.id)].slice(0, 4);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {}
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | ApunBazar`;
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      `${product.description.slice(0, 155)}...`
    );
  }, [product]);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* ── TOP NAV ── */}
      <div className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/products">
            <button className="flex items-center gap-1.5 text-[#1A6B3C] text-sm font-medium">
              <ArrowLeft className="h-4 w-4" />
              Products
            </button>
          </Link>
          <span className="text-sm font-semibold tracking-tight">ApunBazar</span>
          <div className="flex items-center gap-3 text-gray-700">
            <ShareButtons productName={product?.name ?? ""} price={product?.price ?? 0} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : !product ? (
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <Link href="/products">
            <button className="px-6 py-2.5 bg-[#1A6B3C] text-white rounded-xl text-sm font-medium">
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 pb-12 max-w-5xl">

          {/* ── MAIN GRID ── */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 pt-6">

            {/* ── LEFT: IMAGE GALLERY ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Main image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#EAF5EE] cursor-zoom-in group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage] ?? product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    data-testid="img-product-main"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://placehold.co/600x600/EAF5EE/1A6B3C?text=${encodeURIComponent(product.name.slice(0, 12))}`;
                    }}
                  />
                </AnimatePresence>

                {/* Discount badge */}
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-[#E5432A] text-white text-xs font-bold px-3 py-1 rounded-full">
                    −{discount}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i
                          ? "border-[#1A6B3C] scale-105"
                          : "border-transparent hover:border-gray-200"
                      }`}
                      data-testid={`button-image-${i}`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://placehold.co/72x72/EAF5EE/1A6B3C?text=${i + 1}`;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── RIGHT: PRODUCT INFO ── */}
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
            >
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#DFF0E5] text-[#1A6B3C]">
                  {product.categoryName}
                </span>
                {product.featured && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#FFF3D6] text-[#B07A0D]">
                    Featured
                  </span>
                )}
                {(product.tags ?? []).map((tag) => (
                  <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Name */}
              <h1
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-2"
              >
                {product.name}
              </h1>

              {/* Artisan */}
              {product.artisan && (
                <p className="text-sm text-gray-500 mb-3">
                  Crafted by{" "}
                  <span className="font-semibold text-gray-700">{product.artisan}</span>
                  {product.origin && (
                    <>
                      {" "}·{" "}
                      <span className="font-semibold text-gray-700">{product.origin}</span>
                    </>
                  )}
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.rating)
                          ? "fill-[#F5A623] text-[#F5A623]"
                          : "text-gray-200 fill-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-800">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-4xl font-bold text-[#1A6B3C]"
                >
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-semibold text-[#1A6B3C] bg-[#E8F7EE] px-2.5 py-1 rounded-full">
                    Save ₹{(product.originalPrice! - product.price).toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{product.description}</p>

              {/* Size selector */}
              {showSizes && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Size</span>
                    {selectedSize && (
                      <span className="text-xs text-gray-400">
                        Selected: <strong className="text-gray-700">{selectedSize}</strong>
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                        className={`min-w-[48px] h-11 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                          selectedSize === size
                            ? "border-[#1A6B3C] bg-[#1A6B3C] text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-[#1A6B3C]/40"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {showSizes && !selectedSize && (
                    <p className="text-xs text-gray-400 mt-1.5">Size select karo</p>
                  )}
                </div>
              )}

              {/* Out of stock */}
              {product.stock === 0 ? (
                <div className="mb-5">
                  <NotifyMe productId={product.id} productName={product.name} />
                </div>
              ) : (
                <>
                  {/* Quantity + low stock */}
                  <div className="flex items-center gap-4 mb-5">
                    <span className="text-sm font-semibold text-gray-700">Quantity</span>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-xl font-light text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40"
                        disabled={quantity <= 1}
                        data-testid="button-qty-decrease"
                      >
                        −
                      </button>
                      <span
                        className="w-10 text-center text-sm font-semibold text-gray-800"
                        data-testid="text-quantity"
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        className="w-10 h-10 flex items-center justify-center text-xl font-light text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40"
                        disabled={quantity >= product.stock}
                        data-testid="button-qty-increase"
                      >
                        +
                      </button>
                    </div>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="text-xs font-semibold text-[#C8600A] bg-[#FFF2E3] px-2.5 py-1 rounded-full animate-pulse">
                        ⚡ Sirf {product.stock} bacha!
                      </span>
                    )}
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col gap-2.5 mb-5">
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => handleAddToCart()}
                        disabled={addToCart.isPending}
                        className="flex-1 h-12 border-2 border-[#1A6B3C] text-[#1A6B3C] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1A6B3C] hover:text-white transition-all disabled:opacity-60"
                        data-testid="button-add-to-cart"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {addToCart.isPending ? "Adding..." : "Add to Cart"}
                      </button>
                      <button
                        onClick={handleAddToWishlist}
                        disabled={addToWishlist.isPending || isInWishlist}
                        className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                          isInWishlist
                            ? "border-rose-200 bg-rose-50"
                            : "border-gray-200 hover:border-rose-300"
                        }`}
                        data-testid="button-add-to-wishlist"
                        aria-label={isInWishlist ? "In your wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isInWishlist ? "fill-rose-500 text-rose-500" : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      onClick={handleBuyNow}
                      disabled={addToCart.isPending}
                      className="w-full h-12 bg-[#1A6B3C] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#155C33] transition-colors disabled:opacity-60 shadow-sm"
                      data-testid="button-buy-now"
                    >
                      <Zap className="h-6 w-6" />
                      Buy It Now
                    </button>

                    <ProductWhatsAppButton productName={product.name} price={product.price} />
                  </div>
                </>
              )}

              {/* Shipping info */}
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100">
                <ShipItem icon={Truck} text="Free shipping above ₹499" />
                <ShipItem icon={Package} text="3–7 business days" />
                {product.origin ? (
                  <ShipItem icon={MapPin} text={`Origin: ${product.origin}`} />
                ) : (
                  <ShipItem icon={ShieldCheck} text="Genuine product" />
                )}
              </div>
            </motion.div>
          </div>

          {/* ── TRUST BADGES ── */}
          <motion.div
            className="mt-8 bg-white rounded-2xl border border-gray-100 p-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-medium text-gray-400 text-center mb-4 uppercase tracking-wider">
              Why shop with us
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRUST_ITEMS.filter((t) => !t.full).map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-[#1A6B3C]" />
                  </div>
                  <span className="text-xs leading-snug">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-gray-50 text-sm text-gray-600 justify-center">
              <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] flex items-center justify-center flex-shrink-0">
                <Headphones className="h-4 w-4 text-[#1A6B3C]" />
              </div>
              <span className="text-xs">24/7 WhatsApp &amp; email support</span>
            </div>
          </motion.div>

          {/* ── RELATED PRODUCTS ── */}
          {relatedList.length > 0 && (
            <div className="mt-14">
              <div className="flex items-center justify-between mb-5">
                <h2
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-2xl font-bold text-gray-900"
                >
                  You Might Also Like
                </h2>
                <Link href="/products">
                  <button className="flex items-center gap-1 text-sm text-[#1A6B3C] font-medium hover:underline">
                    View All <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedList.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ── REVIEWS ── */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <ReviewSystem productId={product.id} productName={product.name} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function ShipItem({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5">
      <div className="w-9 h-9 rounded-xl bg-[#EAF5EE] flex items-center justify-center">
        <Icon className="h-4 w-4 text-[#1A6B3C]" />
      </div>
      <span className="text-[10px] text-gray-500 leading-snug">{text}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
          <Skeleton className="h-4 w-1/3 rounded-lg" />
          <Skeleton className="h-10 w-1/3 rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}