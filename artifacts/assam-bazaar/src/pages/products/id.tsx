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
  Heart, ShoppingCart, Star, Truck, ArrowLeft,
  Package, MapPin, Zap, ChevronRight,
  ShieldCheck, RefreshCw, Lock, Headphones, Share2,
} from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { useInvalidateCart, useInvalidateWishlist, useWishlist } from "@/hooks/use-shop-data";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/product-card";
import ReviewSystem from "@/components/reviews/ReviewSystem";
import { ProductWhatsAppButton } from "@/components/WhatsAppButtons";
import { ShareButtons } from "@/components/ShareButtons";
import { trackViewItem, trackAddToCart, trackAddToWishlist } from "@/lib/analytics";
import { NotifyMe } from "@/components/NotifyMe";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SIZE_CATEGORIES = ["handloom", "bags"];

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
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [imgZoom, setImgZoom] = useState(false);

  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const { data: relatedByCat } = useListProducts({ category: product?.categorySlug, limit: 8 });
  const { data: allProducts } = useListProducts({ limit: 8 });

  const relatedList = (() => {
    const catItems = (relatedByCat?.products ?? []).filter((p) => p.id !== product?.id);
    if (catItems.length >= 2) return catItems.slice(0, 6);
    return (allProducts?.products ?? []).filter((p) => p.id !== product?.id).slice(0, 6);
  })();

  const isInWishlist = wishlist?.some((w) => w.productId === product?.id) ?? false;
  const showSizes = product?.categorySlug ? SIZE_CATEGORIES.includes(product.categorySlug) : false;

  function handleAddToCart(then?: () => void) {
    if (!sessionId || !product) return;
    if (showSizes && !selectedSize) {
      toast({ title: "Size select karo pehle", variant: "destructive" });
      return;
    }
    addToCart.mutate(
      { data: { sessionId, productId: product.id, quantity } },
      {
        onSuccess: () => {
          invalidateCart();
          trackAddToCart({ id: product.id, name: product.name, price: product.price, category: product.categoryName, quantity });
          toast({ title: "Bag mein add ho gaya! 🛍️", description: `${quantity}× ${product.name}` });
          then?.();
        },
      }
    );
  }

  function handleBuyNow() { handleAddToCart(() => navigate("/checkout")); }

  function handleAddToWishlist() {
    if (!sessionId || !product) return;
    addToWishlist.mutate(
      { data: { sessionId, productId: product.id } },
      {
        onSuccess: () => {
          invalidateWishlist();
          trackAddToWishlist({ id: product.id, name: product.name, price: product.price, category: product.categoryName });
          toast({ title: "Wishlist mein add! ❤️" });
        },
      }
    );
  }

  function checkPincode() {
    if (pincode.length !== 6) return;
    setPincodeMsg("✓ Delivery available by " + new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }));
  }

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = product ? [product.imageUrl, ...(product.images ?? [])] : [];

  useEffect(() => {
    if (!product?.id) return;
    trackViewItem({ id: product.id, name: product.name, price: product.price, category: product.categoryName });
    try {
      const key = "apunbazar_recently_viewed";
      const prev: number[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      localStorage.setItem(key, JSON.stringify([product.id, ...prev.filter(i => i !== product.id)].slice(0, 4)));
    } catch {}
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | ApunBazar`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", `${product.description?.slice(0, 155)}...`);
  }, [product]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}

        /* TOP BAR */
        .mn-topbar{position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;padding:0 14px;height:48px}
        .mn-back-btn{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#282c3f;font-family:'Nunito',sans-serif;background:none;border:none;cursor:pointer;padding:0}
        .mn-logo{font-size:15px;font-weight:800;color:#282c3f;font-family:'Nunito',sans-serif;letter-spacing:.5px}
        .mn-top-actions{display:flex;align-items:center;gap:14px}
        .mn-icon-btn{background:none;border:none;cursor:pointer;color:#282c3f;display:flex;align-items:center;padding:0}

        /* IMAGE AREA */
        .mn-img-area{position:relative;background:#f5f5f6;overflow:hidden}
        .mn-main-img{width:100%;aspect-ratio:3/4;object-fit:cover;display:block;transition:transform .4s ease;cursor:zoom-in}
        .mn-main-img.zoomed{transform:scale(1.5);cursor:zoom-out}
        .mn-disc-badge{position:absolute;top:12px;left:0;background:#ff3f6c;color:#fff;font-size:10px;font-weight:800;padding:4px 10px;font-family:'Nunito',sans-serif;letter-spacing:.5px}
        .mn-feat-badge{position:absolute;top:12px;left:0;background:#1a5a32;color:#fff;font-size:10px;font-weight:800;padding:4px 10px;font-family:'Nunito',sans-serif;letter-spacing:.5px}
        .mn-wish-fab{position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;background:#fff;border:1px solid #eee;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,.12)}
        .mn-thumb-strip{display:flex;gap:6px;padding:8px 14px;overflow-x:auto;scrollbar-width:none;background:#fff;border-bottom:1px solid #f0f0f0}
        .mn-thumb-strip::-webkit-scrollbar{display:none}
        .mn-thumb{width:56px;height:56px;object-fit:cover;border:1.5px solid transparent;cursor:pointer;flex-shrink:0;transition:border-color .15s}
        .mn-thumb.active{border-color:#ff3f6c}

        /* PRODUCT INFO */
        .mn-info{background:#fff;padding:14px}
        .mn-cat-tag{display:inline-block;font-size:10px;font-weight:700;color:#ff3f6c;font-family:'Nunito',sans-serif;letter-spacing:.8px;margin-bottom:4px;text-transform:uppercase}
        .mn-pname{font-size:16px;font-weight:800;color:#282c3f;font-family:'Nunito',sans-serif;line-height:1.3;margin-bottom:4px}
        .mn-artisan{font-size:12px;color:#535766;font-family:'Nunito',sans-serif;margin-bottom:10px}
        .mn-rating-row{display:flex;align-items:center;gap:8px;margin-bottom:12px}
        .mn-rating-pill{display:flex;align-items:center;gap:4px;background:#14958f;color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:3px;font-family:'Nunito',sans-serif}
        .mn-rating-count{font-size:12px;color:#535766;font-family:'Nunito',sans-serif}

        /* PRICE */
        .mn-price-section{background:#fff;padding:12px 14px;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0}
        .mn-price-label{font-size:10px;color:#ff3f6c;font-weight:700;font-family:'Nunito',sans-serif;letter-spacing:.5px;margin-bottom:4px}
        .mn-price-row{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
        .mn-price{font-size:22px;font-weight:800;color:#282c3f;font-family:'Nunito',sans-serif}
        .mn-orig{font-size:14px;color:#94969f;text-decoration:line-through;font-family:'Nunito',sans-serif}
        .mn-disc-pct{font-size:14px;font-weight:700;color:#ff905a;font-family:'Nunito',sans-serif}
        .mn-offer-note{font-size:11px;color:#03a685;font-weight:600;font-family:'Nunito',sans-serif;margin-top:4px}

        /* SIZE */
        .mn-size-section{background:#fff;padding:14px;border-top:8px solid #f5f5f6}
        .mn-size-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .mn-size-label{font-size:13px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif}
        .mn-size-guide{font-size:11px;color:#ff3f6c;font-weight:600;font-family:'Nunito',sans-serif;cursor:pointer}
        .mn-size-grid{display:flex;gap:8px;flex-wrap:wrap}
        .mn-size-btn{width:48px;height:48px;border-radius:50%;border:1.5px solid #d4d5d9;background:#fff;font-size:12px;font-weight:700;color:#282c3f;cursor:pointer;font-family:'Nunito',sans-serif;transition:all .15s;display:flex;align-items:center;justify-content:center}
        .mn-size-btn:hover{border-color:#282c3f}
        .mn-size-btn.active{border-color:#ff3f6c;background:#fff0f3;color:#ff3f6c}
        .mn-size-hint{font-size:11px;color:#94969f;font-family:'Nunito',sans-serif;margin-top:8px}

        /* QUANTITY */
        .mn-qty-section{background:#fff;padding:12px 14px;border-top:1px solid #f0f0f0}
        .mn-qty-label{font-size:12px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif;margin-bottom:8px}
        .mn-qty-ctrl{display:flex;align-items:center;gap:0;border:1.5px solid #d4d5d9;border-radius:4px;width:fit-content;overflow:hidden}
        .mn-qty-btn{width:36px;height:36px;border:none;background:#f5f5f6;font-size:18px;color:#282c3f;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:'Nunito',sans-serif;transition:background .15s}
        .mn-qty-btn:hover{background:#eee}
        .mn-qty-btn:disabled{opacity:.35;cursor:default}
        .mn-qty-num{width:40px;height:36px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif;border-left:1px solid #d4d5d9;border-right:1px solid #d4d5d9}
        .mn-low-stock{font-size:11px;color:#ff3f6c;font-weight:700;font-family:'Nunito',sans-serif;margin-left:10px}

        /* DELIVERY */
        .mn-delivery-section{background:#fff;padding:14px;border-top:8px solid #f5f5f6}
        .mn-delivery-title{font-size:12px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif;margin-bottom:10px}
        .mn-pincode-row{display:flex;align-items:center;gap:8px}
        .mn-pincode-input{flex:1;border:none;border-bottom:1.5px solid #d4d5d9;padding:6px 0;font-size:14px;color:#282c3f;font-family:'Nunito',sans-serif;outline:none;background:transparent}
        .mn-pincode-input:focus{border-bottom-color:#282c3f}
        .mn-pincode-btn{font-size:12px;font-weight:700;color:#ff3f6c;font-family:'Nunito',sans-serif;background:none;border:none;cursor:pointer}
        .mn-pincode-msg{font-size:11px;color:#03a685;font-weight:600;font-family:'Nunito',sans-serif;margin-top:6px}
        .mn-delivery-items{display:flex;flex-direction:column;gap:10px;margin-top:12px}
        .mn-delivery-item{display:flex;align-items:flex-start;gap:10px}
        .mn-delivery-icon{width:32px;height:32px;border-radius:50%;background:#f0faf5;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .mn-delivery-text{font-size:12px;color:#282c3f;font-family:'Nunito',sans-serif;line-height:1.4}
        .mn-delivery-sub{font-size:11px;color:#94969f;font-family:'Nunito',sans-serif}

        /* DESCRIPTION */
        .mn-desc-section{background:#fff;padding:14px;border-top:8px solid #f5f5f6}
        .mn-desc-title{font-size:13px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif;margin-bottom:8px}
        .mn-desc-text{font-size:13px;color:#535766;font-family:'Nunito',sans-serif;line-height:1.6}
        .mn-spec-row{display:flex;padding:8px 0;border-bottom:1px solid #f5f5f5}
        .mn-spec-key{width:120px;font-size:12px;color:#94969f;font-family:'Nunito',sans-serif;flex-shrink:0}
        .mn-spec-val{font-size:12px;color:#282c3f;font-family:'Nunito',sans-serif;font-weight:600}

        /* TABS */
        .mn-tabs{display:flex;border-bottom:1px solid #eee;background:#fff;position:sticky;top:48px;z-index:40}
        .mn-tab{flex:1;padding:12px 0;text-align:center;font-size:12px;font-weight:700;font-family:'Nunito',sans-serif;color:#94969f;cursor:pointer;border:none;background:none;position:relative;letter-spacing:.3px}
        .mn-tab.active{color:#282c3f}
        .mn-tab.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#ff3f6c;border-radius:2px 2px 0 0}

        /* CTA FOOTER */
        .mn-cta-bar{position:fixed;bottom:0;left:0;right:0;z-index:60;display:flex;gap:0;box-shadow:0 -2px 12px rgba(0,0,0,.1)}
        .mn-wishlist-cta{flex:1;height:48px;background:#fff;border:none;border-top:2px solid #ff3f6c;font-size:13px;font-weight:700;color:#ff3f6c;font-family:'Nunito',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background .2s}
        .mn-wishlist-cta:hover{background:#fff0f3}
        .mn-wishlist-cta.wishlisted{background:#fff0f3;color:#ff3f6c}
        .mn-bag-cta{flex:1;height:48px;background:#ff3f6c;border:none;font-size:13px;font-weight:800;color:#fff;font-family:'Nunito',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;letter-spacing:.3px;transition:background .2s}
        .mn-bag-cta:hover{background:#e8365d}
        .mn-bag-cta:disabled{opacity:.6}
        .mn-buynow-cta{flex:1;height:48px;background:#ff905a;border:none;font-size:13px;font-weight:800;color:#fff;font-family:'Nunito',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;letter-spacing:.3px;transition:background .2s}
        .mn-buynow-cta:hover{background:#e07840}

        /* RELATED */
        .mn-related{background:#fff;padding:14px;border-top:8px solid #f5f5f6;padding-bottom:80px}
        .mn-related-title{font-size:14px;font-weight:800;color:#282c3f;font-family:'Nunito',sans-serif;margin-bottom:12px;letter-spacing:.2px}
        .mn-related-scroll{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#f0f0f0}
        .mn-rcard{background:#fff;overflow:hidden;cursor:pointer}
        .mn-rimg{width:100%;aspect-ratio:3/4;object-fit:cover;display:block}
        .mn-rinfo{padding:8px 10px 10px}
        .mn-rbrand{font-size:11px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .mn-rname{font-size:10px;color:#535766;font-family:'Nunito',sans-serif;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.3}
        .mn-rprice{font-size:13px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif}
        .mn-rdisc{font-size:10px;font-weight:700;color:#ff905a;font-family:'Nunito',sans-serif;margin-left:4px}

        /* SKELETON */
        .mn-skel{background:linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%);background-size:200% 100%;animation:shimmer 1.3s infinite;border-radius:4px}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes fadeIn{0%{opacity:0}100%{opacity:1}}
        .mn-fadein{animation:fadeIn .3s ease}
      `}</style>

      {/* ── TOP BAR ── */}
      <div className="mn-topbar">
        <button className="mn-back-btn" onClick={() => navigate("/products")}>
          ← Products
        </button>
        <span className="mn-logo">ApunBazar</span>
        <div className="mn-top-actions">
          <ShareButtons productName={product?.name ?? ""} price={product?.price ?? 0} />
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : !product ? (
        <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#282c3f", fontFamily: "'Nunito',sans-serif", marginBottom: 8 }}>Product nahi mila</div>
          <button onClick={() => navigate("/products")} style={{ padding: "10px 24px", background: "#ff3f6c", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
            Products Browse Karo
          </button>
        </div>
      ) : (
        <div className="mn-fadein" style={{ paddingBottom: 0 }}>

          {/* ── IMAGE ── */}
          <div className="mn-img-area">
            <img
              src={images[selectedImage] ?? product.imageUrl}
              alt={product.name}
              className={`mn-main-img${imgZoom ? " zoomed" : ""}`}
              onClick={() => setImgZoom(z => !z)}
              onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x500/f5f5f6/282c3f?text=${encodeURIComponent(product.name.slice(0, 10))}`; }}
            />
            {product.featured && <div className="mn-feat-badge">FEATURED</div>}
            {discount >= 5 && !product.featured && <div className="mn-disc-badge">{discount}% OFF</div>}
            <button className={`mn-wish-fab${isInWishlist ? " wishlisted" : ""}`} onClick={handleAddToWishlist}>
              {isInWishlist ? "❤️" : "🤍"}
            </button>
          </div>

          {/* THUMBNAIL STRIP */}
          {images.length > 1 && (
            <div className="mn-thumb-strip">
              {images.map((img, i) => (
                <img key={i} src={img} alt={`view ${i + 1}`} className={`mn-thumb${selectedImage === i ? " active" : ""}`}
                  onClick={() => setSelectedImage(i)}
                  onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/56x56/f5f5f6/282c3f?text=${i + 1}`; }}
                />
              ))}
            </div>
          )}

          {/* ── PRODUCT INFO ── */}
          <div className="mn-info">
            <div className="mn-cat-tag">{product.categoryName}</div>
            <div className="mn-pname">{product.name}</div>
            {product.artisan && (
              <div className="mn-artisan">
                By <strong>{product.artisan}</strong>
                {product.origin && <> · {product.origin}</>}
              </div>
            )}
            <div className="mn-rating-row">
              <div className="mn-rating-pill">
                {product.rating?.toFixed(1)} ★
              </div>
              <span className="mn-rating-count">{product.reviewCount ?? 0} Ratings</span>
              {product.featured && (
                <span style={{ fontSize: 10, background: "#fff3d6", color: "#b07a0d", padding: "2px 8px", borderRadius: 3, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>
                  TOP PICK
                </span>
              )}
            </div>
          </div>

          {/* ── PRICE ── */}
          <div className="mn-price-section">
            <div className="mn-price-label">BEST PRICE</div>
            <div className="mn-price-row">
              <span className="mn-price">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && <span className="mn-orig">₹{product.originalPrice.toLocaleString("en-IN")}</span>}
              {discount > 0 && <span className="mn-disc-pct">({discount}% OFF)</span>}
            </div>
            {discount > 0 && (
              <div className="mn-offer-note">
                ✓ You save ₹{((product.originalPrice ?? 0) - product.price).toLocaleString("en-IN")}
              </div>
            )}
          </div>

          {/* ── SIZE SELECTOR ── */}
          {showSizes && (
            <div className="mn-size-section">
              <div className="mn-size-header">
                <span className="mn-size-label">SELECT SIZE</span>
                <span className="mn-size-guide">SIZE GUIDE ›</span>
              </div>
              <div className="mn-size-grid">
                {SIZES.map(size => (
                  <button key={size} className={`mn-size-btn${selectedSize === size ? " active" : ""}`}
                    onClick={() => setSelectedSize(size === selectedSize ? null : size)}>
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && <div className="mn-size-hint">Please select a size</div>}
            </div>
          )}

          {/* ── QUANTITY ── */}
          {product.stock > 0 && (
            <div className="mn-qty-section">
              <div className="mn-qty-label">QUANTITY</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="mn-qty-ctrl">
                  <button className="mn-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                  <div className="mn-qty-num">{quantity}</div>
                  <button className="mn-qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
                </div>
                {product.stock <= 5 && (
                  <span className="mn-low-stock">⚡ Only {product.stock} left!</span>
                )}
              </div>
            </div>
          )}

          {/* OUT OF STOCK */}
          {product.stock === 0 && (
            <div style={{ padding: "14px", background: "#fff", borderTop: "8px solid #f5f5f6" }}>
              <NotifyMe productId={product.id} productName={product.name} />
            </div>
          )}

          {/* ── DELIVERY ── */}
          <div className="mn-delivery-section">
            <div className="mn-delivery-title">DELIVERY OPTIONS</div>
            <div className="mn-pincode-row">
              <input className="mn-pincode-input" placeholder="Enter pincode" maxLength={6}
                value={pincode} onChange={e => { setPincode(e.target.value.replace(/\D/g, "")); setPincodeMsg(""); }}
                onKeyDown={e => e.key === "Enter" && checkPincode()} />
              <button className="mn-pincode-btn" onClick={checkPincode}>CHECK</button>
            </div>
            {pincodeMsg && <div className="mn-pincode-msg">{pincodeMsg}</div>}
            <div className="mn-delivery-items">
              {[
                { icon: "🚚", text: "Free Delivery", sub: "On orders above ₹499" },
                { icon: "↩️", text: "7 Days Return", sub: "Easy hassle-free returns" },
                { icon: "✅", text: "100% Authentic", sub: "Direct from Assam artisans" },
                { icon: "🔒", text: "Secure Payment", sub: "UPI, Cards, COD accepted" },
              ].map(item => (
                <div key={item.text} className="mn-delivery-item">
                  <div className="mn-delivery-icon">{item.icon}</div>
                  <div>
                    <div className="mn-delivery-text">{item.text}</div>
                    <div className="mn-delivery-sub">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── TABS ── */}
          <div className="mn-tabs">
            <button className={`mn-tab${activeTab === "details" ? " active" : ""}`} onClick={() => setActiveTab("details")}>
              PRODUCT DETAILS
            </button>
            <button className={`mn-tab${activeTab === "reviews" ? " active" : ""}`} onClick={() => setActiveTab("reviews")}>
              RATINGS & REVIEWS
            </button>
          </div>

          {/* ── DETAILS TAB ── */}
          {activeTab === "details" && (
            <div className="mn-desc-section">
              <div className="mn-desc-title">Description</div>
              <div className="mn-desc-text">{product.description}</div>

              <div style={{ marginTop: 16 }}>
                <div className="mn-desc-title">Product Specifications</div>
                {[
                  ["Category", product.categoryName],
                  product.artisan ? ["Artisan", product.artisan] : null,
                  product.origin  ? ["Origin",  product.origin]  : null,
                  ["In Stock", product.stock > 0 ? `${product.stock} units` : "Out of Stock"],
                  ...(product.tags ?? []).map((t: string) => ["Tag", t]),
                ].filter(Boolean).map(([k, v]) => (
                  <div key={String(k)} className="mn-spec-row">
                    <span className="mn-spec-key">{k}</span>
                    <span className="mn-spec-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── REVIEWS TAB ── */}
          {activeTab === "reviews" && (
            <div style={{ background: "#fff", padding: "14px", borderTop: "8px solid #f5f5f6" }}>
              <ReviewSystem productId={product.id} productName={product.name} />
            </div>
          )}

          {/* ── RELATED ── */}
          {relatedList.length > 0 && (
            <div className="mn-related">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div className="mn-related-title">SIMILAR PRODUCTS</div>
                <button onClick={() => navigate("/products")} style={{ fontSize: 11, fontWeight: 700, color: "#ff3f6c", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
                  VIEW ALL ›
                </button>
              </div>
              <div className="mn-related-scroll">
                {relatedList.map(p => (
                  <div key={p.id} className="mn-rcard" onClick={() => navigate(`/products/${p.id}`)}>
                    <img src={p.imageUrl} alt={p.name} className="mn-rimg"
                      onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/200x260/f5f5f6/282c3f?text=Product"; }} />
                    <div className="mn-rinfo">
                      <div className="mn-rbrand">{p.artisan ?? "ApunBazar"}</div>
                      <div className="mn-rname">{p.name}</div>
                      <div>
                        <span className="mn-rprice">₹{Number(p.price).toLocaleString("en-IN")}</span>
                        {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                          <span className="mn-rdisc">
                            ({Math.round((1 - Number(p.price) / Number(p.originalPrice)) * 100)}% OFF)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WHATSAPP */}
          <div style={{ padding: "0 14px 80px", background: "#fff" }}>
            <ProductWhatsAppButton productName={product.name} price={product.price} />
          </div>

        </div>
      )}

      {/* ── STICKY CTA BAR ── */}
      {product && product.stock > 0 && (
        <div className="mn-cta-bar">
          <button className={`mn-wishlist-cta${isInWishlist ? " wishlisted" : ""}`} onClick={handleAddToWishlist} disabled={addToWishlist.isPending}>
            {isInWishlist ? "❤️ WISHLISTED" : "🤍 WISHLIST"}
          </button>
          <button className="mn-bag-cta" onClick={() => handleAddToCart()} disabled={addToCart.isPending}>
            🛍️ {addToCart.isPending ? "ADDING..." : "ADD TO BAG"}
          </button>
          <button className="mn-buynow-cta" onClick={handleBuyNow} disabled={addToCart.isPending}>
            ⚡ BUY NOW
          </button>
        </div>
      )}
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ background: "#fff" }}>
      <div className="mn-skel" style={{ width: "100%", aspectRatio: "3/4", borderRadius: 0 }} />
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="mn-skel" style={{ height: 10, width: "40%" }} />
        <div className="mn-skel" style={{ height: 18, width: "85%" }} />
        <div className="mn-skel" style={{ height: 12, width: "55%" }} />
        <div className="mn-skel" style={{ height: 12, width: "30%" }} />
        <div className="mn-skel" style={{ height: 24, width: "45%" }} />
        <div className="mn-skel" style={{ height: 12, width: "60%" }} />
      </div>
      <div style={{ height: 8, background: "#f5f5f6" }} />
      <div style={{ padding: "14px", display: "flex", gap: 10 }}>
        {[...Array(5)].map((_, i) => <div key={i} className="mn-skel" style={{ width: 48, height: 48, borderRadius: "50%" }} />)}
      </div>
      <div style={{ height: 8, background: "#f5f5f6" }} />
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="mn-skel" style={{ height: 11, width: "50%" }} />
        <div className="mn-skel" style={{ height: 11, width: "80%" }} />
        <div className="mn-skel" style={{ height: 11, width: "65%" }} />
      </div>
    </div>
  );
}
