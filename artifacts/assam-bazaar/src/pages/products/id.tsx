import { useState, useEffect, useRef } from "react";
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
import { useSession } from "@/hooks/use-session";
import { useInvalidateCart, useInvalidateWishlist, useWishlist } from "@/hooks/use-shop-data";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/product-card";
import ReviewSystem from "@/components/reviews/ReviewSystem";
import { ProductWhatsAppButton } from "@/components/WhatsAppButtons";
import { ShareButtons } from "@/components/ShareButtons";
import { trackViewItem, trackAddToCart, trackAddToWishlist } from "@/lib/analytics";
import { NotifyMe } from "@/components/NotifyMe";

const G = "#1a5a32";
const GOLD = "#c9a84c";
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SIZE_CATEGORIES = ["handloom", "bags"];

// ─── TRUST BADGES ─────────────────────────────────────────────────────────────
function TrustBadges() {
  const badges = [
    { icon: "🚚", label: "Free Shipping", sub: "Above ₹499" },
    { icon: "🔒", label: "Secure Payments", sub: "" },
    { icon: "✅", label: "100% Authentic", sub: "Assam Product" },
    { icon: "↩️", label: "Easy Returns", sub: "& Refunds" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, padding: "14px", background: "#fff", borderTop: "1px solid #f0ece4", borderBottom: "1px solid #f0ece4" }}>
      {badges.map(b => (
        <div key={b.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>{b.icon}</div>
          <p style={{ fontSize: 9, fontWeight: 700, color: "#282c3f", margin: 0, lineHeight: 1.3, fontFamily: "'Nunito',sans-serif" }}>{b.label}</p>
          {b.sub && <p style={{ fontSize: 8.5, color: "#94969f", margin: 0, fontFamily: "'Nunito',sans-serif" }}>{b.sub}</p>}
        </div>
      ))}
    </div>
  );
}

// ─── ACCORDION ────────────────────────────────────────────────────────────────
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0ece4" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
        fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 700, color: "#282c3f",
      }}>
        {title}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94969f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 16px 14px", fontSize: 13, color: "#535766", fontFamily: "'Nunito',sans-serif", lineHeight: 1.65 }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── STORY STRIP ──────────────────────────────────────────────────────────────
function AssamStoryStrip({ categorySlug }: { categorySlug?: string }) {
  const configs: Record<string, { title: string; sub: string; img: string; btn: string }> = {
    tea: { title: "From Assam's Tea Gardens\nTo Your Cup 💛", sub: "Sourced directly from local farmers with care & passion.", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80", btn: "Know Our Story →" },
    handloom: { title: "Woven with Love\nFrom Assam 💛", sub: "Master weavers crafting heritage fabrics for generations.", img: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=800&q=80", btn: "Know Our Story →" },
    handicrafts: { title: "Crafted by Assam's\nArtisans 💛", sub: "Every piece tells a story of skill and tradition.", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80", btn: "Know Our Story →" },
    organic: { title: "Farm Fresh from\nAssam's Fields 💛", sub: "Pure, natural, chemical-free produce for your family.", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80", btn: "Know Our Story →" },
  };
  const cfg = configs[categorySlug ?? ""] ?? configs.tea;
  return (
    <div style={{ margin: "0 0 0", position: "relative", overflow: "hidden", minHeight: 160 }}>
      <img src={cfg.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,45,20,0.88) 50%, rgba(15,45,20,0.3) 100%)" }} />
      <div style={{ position: "relative", zIndex: 2, padding: "22px 20px" }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 8px", lineHeight: 1.3, whiteSpace: "pre-line" }}>{cfg.title}</h3>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", margin: "0 0 14px", maxWidth: 200, lineHeight: 1.6, fontFamily: "'Nunito',sans-serif" }}>{cfg.sub}</p>
        <Link href="/about" style={{ display: "inline-flex", alignItems: "center", background: GOLD, color: "#111", fontSize: 11, fontWeight: 700, padding: "7px 14px", borderRadius: 6, textDecoration: "none", fontFamily: "'Nunito',sans-serif" }}>
          {cfg.btn}
        </Link>
      </div>
    </div>
  );
}

// ─── HIGHLIGHTS ───────────────────────────────────────────────────────────────
function ProductHighlights({ categorySlug }: { categorySlug?: string }) {
  const highlights: Record<string, { icon: string; label: string }[]> = {
    tea: [
      { icon: "🌿", label: "100% Natural" },
      { icon: "🍵", label: "Rich Aroma & Taste" },
      { icon: "🌱", label: "Premium Tea Leaves" },
      { icon: "🏡", label: "From Assam With Pride" },
    ],
    handloom: [
      { icon: "🧵", label: "Handwoven" },
      { icon: "🪡", label: "GI Tagged" },
      { icon: "✨", label: "Premium Quality" },
      { icon: "🏡", label: "Assam Heritage" },
    ],
    handicrafts: [
      { icon: "🏺", label: "Handcrafted" },
      { icon: "🌿", label: "Eco Friendly" },
      { icon: "🎨", label: "Artisan Made" },
      { icon: "🏡", label: "From Assam" },
    ],
    organic: [
      { icon: "🌿", label: "100% Organic" },
      { icon: "🚫", label: "No Chemicals" },
      { icon: "🌾", label: "Farm Fresh" },
      { icon: "🏡", label: "Assam Grown" },
    ],
  };
  const items = highlights[categorySlug ?? ""] ?? highlights.tea;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, padding: "16px", background: "#fff" }}>
      {items.map(h => (
        <div key={h.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 5 }}>{h.icon}</div>
          <p style={{ fontSize: 9.5, fontWeight: 700, color: "#282c3f", margin: 0, lineHeight: 1.3, fontFamily: "'Nunito',sans-serif" }}>{h.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── FREQUENTLY BOUGHT TOGETHER ───────────────────────────────────────────────
function FrequentlyBought({ mainProduct, relatedList, onAddBundle }: { mainProduct: any; relatedList: any[]; onAddBundle: () => void }) {
  const bundleItems = [mainProduct, ...relatedList.slice(0, 2)].filter(Boolean);
  const bundlePrice = bundleItems.reduce((s, p) => s + Number(p.price), 0);
  const bundleOrig = bundleItems.reduce((s, p) => s + Number(p.originalPrice ?? p.price), 0);
  const bundleSaving = bundleOrig - bundlePrice;

  return (
    <div style={{ padding: "16px", background: "#fff", borderTop: "8px solid #f5f5f6" }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: "#282c3f", fontFamily: "'Nunito',sans-serif", margin: "0 0 14px" }}>
        Frequently Bought Together
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, overflowX: "auto" }}>
        {bundleItems.map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ textAlign: "center" }}>
              <img src={p.imageUrl} alt={p.name} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid #f0ece4" }} onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/72x72/f5f5f6/282c3f?text=P"; }} />
              <p style={{ fontSize: 9.5, color: "#282c3f", margin: "4px 0 0", fontFamily: "'Nunito',sans-serif", fontWeight: 600, maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: G, margin: 0, fontFamily: "'Nunito',sans-serif" }}>₹{Number(p.price).toLocaleString("en-IN")}</p>
            </div>
            {i < bundleItems.length - 1 && <span style={{ fontSize: 18, color: "#94969f", fontWeight: 700 }}>+</span>}
          </div>
        ))}
      </div>
      <div style={{ background: "#f5f9f5", borderRadius: 10, padding: "10px 12px", marginBottom: 12, border: "1px solid #d4ebd4" }}>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "#535766", margin: "0 0 2px" }}>Bundle Price</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#282c3f", fontFamily: "'Nunito',sans-serif" }}>₹{bundlePrice.toLocaleString("en-IN")}</span>
          {bundleSaving > 0 && <span style={{ fontSize: 12, color: "#94969f", textDecoration: "line-through", fontFamily: "'Nunito',sans-serif" }}>₹{bundleOrig.toLocaleString("en-IN")}</span>}
        </div>
        {bundleSaving > 0 && (
          <span style={{ display: "inline-block", background: GOLD, color: "#111", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 4, fontFamily: "'Nunito',sans-serif", marginTop: 4 }}>
            Save ₹{bundleSaving.toLocaleString("en-IN")}
          </span>
        )}
      </div>
      <button onClick={onAddBundle} style={{
        width: "100%", height: 46, background: G, color: "#fff", border: "none", borderRadius: 8,
        fontSize: 13, fontWeight: 800, fontFamily: "'Nunito',sans-serif", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        🛍️ Add Bundle to Cart
      </button>
    </div>
  );
}

// ─── RELATED PRODUCTS ROW ─────────────────────────────────────────────────────
function YouMayAlsoLike({ products, onNavigate }: { products: any[]; onNavigate: (id: number) => void }) {
  return (
    <div style={{ padding: "16px 0 16px", background: "#fff", borderTop: "8px solid #f5f5f6" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#282c3f", fontFamily: "'Nunito',sans-serif", margin: 0 }}>You May Also Like</h3>
        <Link href="/products" style={{ fontSize: 11, fontWeight: 700, color: G, textDecoration: "none", fontFamily: "'Nunito',sans-serif" }}>View All →</Link>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 16px 4px", scrollbarWidth: "none" }}>
        {products.map(p => {
          const disc = p.originalPrice && Number(p.originalPrice) > Number(p.price)
            ? Math.round((1 - Number(p.price) / Number(p.originalPrice)) * 100) : 0;
          return (
            <div key={p.id} onClick={() => onNavigate(p.id)} style={{ flexShrink: 0, width: 120, cursor: "pointer" }}>
              <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", marginBottom: 6 }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: 120, height: 150, objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/120x150/f5f5f6/282c3f?text=P"; }} />
                {disc >= 5 && (
                  <div style={{ position: "absolute", bottom: 6, right: 6, background: G, color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, fontFamily: "'Nunito',sans-serif" }}>
                    -{disc}%
                  </div>
                )}
                <button onClick={e => { e.stopPropagation(); }} style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "#fff", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12 }}>🤍</button>
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#282c3f", margin: "0 0 2px", fontFamily: "'Nunito',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#282c3f", fontFamily: "'Nunito',sans-serif" }}>₹{Number(p.price).toLocaleString("en-IN")}</span>
                <button style={{ width: 22, height: 22, borderRadius: "50%", background: G, border: "none", color: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto" }}>+</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── RECENTLY VIEWED ROW ──────────────────────────────────────────────────────
function RecentlyViewed({ currentId, onNavigate }: { currentId: number; onNavigate: (id: number) => void }) {
  const [ids, setIds] = useState<number[]>([]);
  const { data } = useListProducts({ limit: 20 });

  useEffect(() => {
    try {
      const stored: number[] = JSON.parse(localStorage.getItem("apunbazar_recently_viewed") ?? "[]");
      setIds(stored.filter(i => i !== currentId).slice(0, 6));
    } catch {}
  }, [currentId]);

  const products = (data?.products ?? []).filter(p => ids.includes(p.id)).slice(0, 4);
  if (!products.length) return null;

  return (
    <div style={{ padding: "16px 0", background: "#fff", borderTop: "8px solid #f5f5f6" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#282c3f", fontFamily: "'Nunito',sans-serif", margin: 0 }}>Recently Viewed</h3>
        <Link href="/products" style={{ fontSize: 11, fontWeight: 700, color: G, textDecoration: "none", fontFamily: "'Nunito',sans-serif" }}>View All →</Link>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 16px 4px", scrollbarWidth: "none" }}>
        {products.map(p => (
          <div key={p.id} onClick={() => onNavigate(p.id)} style={{ flexShrink: 0, width: 120, cursor: "pointer" }}>
            <img src={p.imageUrl} alt={p.name} style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10, display: "block", marginBottom: 6 }} onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/120x120/f5f5f6/282c3f?text=P"; }} />
            <p style={{ fontSize: 11, fontWeight: 700, color: "#282c3f", margin: "0 0 2px", fontFamily: "'Nunito',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#282c3f", margin: 0, fontFamily: "'Nunito',sans-serif" }}>₹{Number(p.price).toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STICKY BOTTOM BAR ────────────────────────────────────────────────────────
function StickyBar({ product, cartCount, onCart, onBuyNow, loading }: { product: any; cartCount: number; onCart: () => void; onBuyNow: () => void; loading: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "#1a1a1a", padding: "10px 14px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
    }}>
      {/* Cart info */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ position: "relative" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.66a2 2 0 001.98-1.71L23 6H6"/>
          </svg>
          {cartCount > 0 && (
            <div style={{ position: "absolute", top: -6, right: -6, width: 16, height: 16, borderRadius: "50%", background: GOLD, color: "#111", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif" }}>
              {cartCount}
            </div>
          )}
        </div>
        <div>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", margin: 0, fontFamily: "'Nunito',sans-serif" }}>
            {cartCount > 0 ? `${cartCount} Item in Cart` : "Your cart"}
          </p>
          <p style={{ fontSize: 12, fontWeight: 800, color: GOLD, margin: 0, fontFamily: "'Nunito',sans-serif" }}>
            {cartCount > 0 ? (
              <Link href="/cart" style={{ color: GOLD, textDecoration: "none" }}>View Cart →</Link>
            ) : (
              `Total ₹${Number(product?.price ?? 0).toLocaleString("en-IN")}`
            )}
          </p>
        </div>
        {cartCount > 0 && (
          <p style={{ fontSize: 12, fontWeight: 800, color: "#fff", margin: "0 0 0 4px", fontFamily: "'Nunito',sans-serif" }}>
            ₹{Number(product?.price ?? 0).toLocaleString("en-IN")}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* WhatsApp */}
        <a href={`https://wa.me/919876543210?text=Hi! I want to order: ${encodeURIComponent(product?.name ?? "")} (₹${product?.price})`}
          target="_blank" rel="noopener noreferrer"
          style={{ width: 42, height: 42, borderRadius: 8, background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        {/* Buy Now */}
        <button onClick={onBuyNow} disabled={loading} style={{
          height: 42, padding: "0 20px", background: GOLD, color: "#111", border: "none",
          borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: "pointer",
          fontFamily: "'Nunito',sans-serif", display: "flex", alignItems: "center", gap: 6,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#111">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          Buy Now
        </button>
      </div>
    </div>
  );
}

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ background: "#fff" }}>
      <div style={{ width: "100%", aspectRatio: "3/4", background: "linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.3s infinite" }} />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {[["40%",10],["85%",18],["55%",12],["30%",12],["45%",24]].map(([w,h],i) => (
          <div key={i} style={{ height: h as number, width: w as string, background: "linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.3s infinite", borderRadius: 4 }} />
        ))}
      </div>
      <style>{`@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}`}</style>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
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
  const [cartCount, setCartCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const imgScrollRef = useRef<HTMLDivElement>(null);

  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const { data: relatedByCat } = useListProducts({ category: product?.categorySlug, limit: 8 });
  const { data: allProducts } = useListProducts({ limit: 8 });

  const relatedList = (() => {
    const catItems = (relatedByCat?.products ?? []).filter(p => p.id !== product?.id);
    if (catItems.length >= 2) return catItems.slice(0, 6);
    return (allProducts?.products ?? []).filter(p => p.id !== product?.id).slice(0, 6);
  })();

  const isInWishlist = wishlist?.some(w => w.productId === product?.id) ?? false;
  const showSizes = product?.categorySlug ? SIZE_CATEGORIES.includes(product.categorySlug) : false;
  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const images = product ? [product.imageUrl, ...(product.images ?? [])].filter(Boolean) : [];

  function handleAddToCart(then?: () => void) {
    if (!sessionId || !product) return;
    if (showSizes && !selectedSize) { toast({ title: "Size select karo pehle", variant: "destructive" }); return; }
    addToCart.mutate(
      { data: { sessionId, productId: product.id, quantity } },
      {
        onSuccess: () => {
          invalidateCart();
          setCartCount(c => c + quantity);
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
    const date = new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    setPincodeMsg(`✓ Delivery available by ${date}`);
  }

  useEffect(() => {
    if (!product?.id) return;
    trackViewItem({ id: product.id, name: product.name, price: product.price, category: product.categoryName });
    try {
      const key = "apunbazar_recently_viewed";
      const prev: number[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      localStorage.setItem(key, JSON.stringify([product.id, ...prev.filter(i => i !== product.id)].slice(0, 8)));
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
        * { box-sizing: border-box; }

        .pd-topbar { position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid #f0ece4;display:flex;align-items:center;justify-content:space-between;padding:0 14px;height:52px; }
        .pd-back { display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#282c3f;font-family:'Nunito',sans-serif;background:none;border:none;cursor:pointer;padding:0; }
        .pd-logo { font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#1a3a22;letter-spacing:.5px; }
        .pd-logo span { color:${GOLD}; }

        .pd-img-scroll { display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none; }
        .pd-img-scroll::-webkit-scrollbar { display:none; }
        .pd-img-slide { flex-shrink:0;width:100%;scroll-snap-align:start;position:relative; }
        .pd-main-img { width:100%;aspect-ratio:3/4;object-fit:cover;display:block; }

        .pd-dot { height:6px;border-radius:3px;cursor:pointer;border:none;padding:0;transition:all .3s; }

        .pd-info { background:#fff;padding:16px 14px 12px; }
        .pd-cat { font-size:11px;font-weight:700;color:${G};font-family:'Nunito',sans-serif;letter-spacing:.8px;margin-bottom:5px;text-transform:uppercase;display:flex;align-items:center;gap:5px; }
        .pd-name { font-size:18px;font-weight:800;color:#282c3f;font-family:'Nunito',sans-serif;line-height:1.3;margin-bottom:5px; }
        .pd-artisan { font-size:12px;color:#535766;font-family:'Nunito',sans-serif;margin-bottom:10px; }

        .pd-rating-row { display:flex;align-items:center;gap:8px;margin-bottom:10px; }
        .pd-rating-pill { display:flex;align-items:center;gap:4px;background:${G};color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;font-family:'Nunito',sans-serif; }
        .pd-stock-pill { font-size:10px;font-weight:700;color:#03a685;font-family:'Nunito',sans-serif;display:flex;align-items:center;gap:4px; }

        .pd-price-block { padding:12px 14px;background:#fff;border-top:1px solid #f5f5f6; }
        .pd-price-main { font-size:26px;font-weight:800;color:#282c3f;font-family:'Nunito',sans-serif; }
        .pd-price-orig { font-size:15px;color:#94969f;text-decoration:line-through;font-family:'Nunito',sans-serif;margin-left:8px; }
        .pd-disc-badge { background:#ff905a;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;font-family:'Nunito',sans-serif;margin-left:6px; }
        .pd-saving { font-size:11px;color:#03a685;font-weight:600;font-family:'Nunito',sans-serif;margin-top:4px; }

        .pd-qty-ctrl { display:flex;align-items:center;border:1.5px solid #d4d5d9;border-radius:6px;overflow:hidden;width:fit-content; }
        .pd-qty-btn { width:36px;height:36px;background:#f5f5f6;border:none;font-size:18px;color:#282c3f;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:'Nunito',sans-serif; }
        .pd-qty-btn:disabled { opacity:.3;cursor:default; }
        .pd-qty-num { width:42px;height:36px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif;border-left:1px solid #d4d5d9;border-right:1px solid #d4d5d9; }

        .pd-cta-section { padding:12px 14px;background:#fff;border-top:1px solid #f0ece4;display:flex;flex-direction:column;gap:10px; }
        .pd-btn-cart { height:50px;background:#fff;border:2px solid #282c3f;border-radius:8px;font-size:14px;font-weight:800;color:#282c3f;font-family:'Nunito',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s; }
        .pd-btn-cart:hover { background:#f5f5f6; }
        .pd-btn-buynow { height:50px;background:${GOLD};border:none;border-radius:8px;font-size:14px;font-weight:800;color:#111;font-family:'Nunito',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 4px 14px rgba(201,168,76,.4); }
        .pd-btn-buynow:hover { background:#d4a830; }
        .pd-btn-wa { height:50px;background:#25d366;border:none;border-radius:8px;font-size:13px;font-weight:800;color:#fff;font-family:'Nunito',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none; }

        .pd-size-btn { width:46px;height:46px;border-radius:50%;border:1.5px solid #d4d5d9;background:#fff;font-size:12px;font-weight:700;color:#282c3f;cursor:pointer;font-family:'Nunito',sans-serif;transition:all .15s;display:flex;align-items:center;justify-content:center; }
        .pd-size-btn.active { border-color:${G};background:#e8f5ee;color:${G}; }

        .pd-tabs { display:flex;background:#fff;border-bottom:1px solid #eee;position:sticky;top:52px;z-index:40; }
        .pd-tab { flex:1;padding:13px 0;text-align:center;font-size:12px;font-weight:700;font-family:'Nunito',sans-serif;color:#94969f;cursor:pointer;border:none;background:none;position:relative;letter-spacing:.4px; }
        .pd-tab.active { color:#282c3f; }
        .pd-tab.active::after { content:'';position:absolute;bottom:0;left:15%;right:15%;height:2.5px;background:${G};border-radius:2px 2px 0 0; }

        .pd-pincode { border:none;border-bottom:1.5px solid #d4d5d9;padding:6px 0;font-size:14px;color:#282c3f;font-family:'Nunito',sans-serif;outline:none;background:transparent;flex:1; }
        .pd-pincode:focus { border-bottom-color:${G}; }

        .pd-spec-row { display:flex;padding:8px 0;border-bottom:1px solid #f5f5f5; }
        .pd-spec-key { width:120px;font-size:12px;color:#94969f;font-family:'Nunito',sans-serif;flex-shrink:0; }
        .pd-spec-val { font-size:12px;color:#282c3f;font-family:'Nunito',sans-serif;font-weight:600; }

        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .pd-fadein { animation:fadeIn .3s ease; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div className="pd-topbar">
        <button className="pd-back" onClick={() => navigate("/products")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="pd-logo">Apun<span>Bazar</span></span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ShareButtons productName={product?.name ?? ""} price={product?.price ?? 0} />
          <Link href="/cart" style={{ position: "relative", color: "#282c3f" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.66a2 2 0 001.98-1.71L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <div style={{ position: "absolute", top: -6, right: -6, width: 16, height: 16, borderRadius: "50%", background: GOLD, color: "#111", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif" }}>
                {cartCount}
              </div>
            )}
          </Link>
        </div>
      </div>

      {isLoading ? <LoadingSkeleton /> : !product ? (
        <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#282c3f", fontFamily: "'Nunito',sans-serif", marginBottom: 8 }}>Product nahi mila</p>
          <button onClick={() => navigate("/products")} style={{ padding: "10px 24px", background: G, color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
            Browse Karo
          </button>
        </div>
      ) : (
        <div className="pd-fadein" style={{ paddingBottom: 80 }}>

          {/* ── IMAGE GALLERY (swipeable) ── */}
          <div style={{ position: "relative", background: "#f8f6f0" }}>
            <div ref={imgScrollRef} className="pd-img-scroll"
              onScroll={e => {
                const el = e.currentTarget;
                setCurrentSlide(Math.round(el.scrollLeft / el.offsetWidth));
              }}>
              {images.length > 0 ? images.map((img, i) => (
                <div key={i} className="pd-img-slide">
                  <img src={img} alt={`${product.name} ${i + 1}`} className="pd-main-img"
                    onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x530/f5f5f6/282c3f?text=${encodeURIComponent(product.name.slice(0, 8))}`; }} />
                </div>
              )) : (
                <div className="pd-img-slide">
                  <img src={product.imageUrl} alt={product.name} className="pd-main-img"
                    onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x530/f5f5f6/282c3f?text=${encodeURIComponent(product.name.slice(0, 8))}`; }} />
                </div>
              )}
            </div>

            {/* Discount badge */}
            {discount >= 5 && (
              <div style={{ position: "absolute", top: 12, left: 0, background: "#ff3f6c", color: "#fff", fontSize: 11, fontWeight: 800, padding: "5px 12px", fontFamily: "'Nunito',sans-serif", letterSpacing: .5 }}>
                -{discount}%
              </div>
            )}

            {/* Wishlist */}
            <button onClick={handleAddToWishlist} style={{ position: "absolute", top: 12, right: 12, width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}>
              {isInWishlist ? "❤️" : "🤍"}
            </button>

            {/* Zoom icon */}
            <button onClick={() => setImgZoom(z => !z)} style={{ position: "absolute", bottom: 48, right: 12, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282c3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
              </svg>
            </button>

            {/* Dots */}
            {images.length > 1 && (
              <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
                {images.map((_, i) => (
                  <button key={i} className="pd-dot"
                    style={{ width: i === currentSlide ? 20 : 6, background: i === currentSlide ? GOLD : "rgba(0,0,0,0.25)" }}
                    onClick={() => {
                      imgScrollRef.current?.scrollTo({ left: i * (imgScrollRef.current?.offsetWidth ?? 0), behavior: "smooth" });
                      setCurrentSlide(i);
                    }} />
                ))}
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="pd-info">
            <div className="pd-cat">
              <svg width="12" height="12" viewBox="0 0 24 24" fill={G}><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/></svg>
              {product.categoryName}
            </div>
            <h1 className="pd-name">{product.name}</h1>
            {product.artisan && (
              <p className="pd-artisan">By <strong>{product.artisan}</strong>{product.origin && ` · ${product.origin}`}</p>
            )}
            <div className="pd-rating-row">
              <div className="pd-rating-pill">
                {(product.rating ?? 4.2).toFixed(1)}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <span style={{ fontSize: 12, color: "#535766", fontFamily: "'Nunito',sans-serif" }}>
                {product.reviewCount ?? 0} Ratings
              </span>
              {product.featured && (
                <span style={{ fontSize: 9, background: "#fff3d6", color: "#b07a0d", padding: "2px 8px", borderRadius: 4, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>TOP PICK</span>
              )}
              {product.stock > 0 && (
                <span className="pd-stock-pill">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#03a685", display: "inline-block" }} />
                  In Stock
                </span>
              )}
            </div>
          </div>

          {/* ── PRICE ── */}
          <div className="pd-price-block">
            <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
              <span className="pd-price-main">₹{Number(product.price).toLocaleString("en-IN")}</span>
              {product.originalPrice && <span className="pd-price-orig">₹{Number(product.originalPrice).toLocaleString("en-IN")}</span>}
              {discount > 0 && <span className="pd-disc-badge">-{discount}%</span>}
            </div>
            {discount > 0 && (
              <p className="pd-saving">You save ₹{(Number(product.originalPrice) - Number(product.price)).toLocaleString("en-IN")}</p>
            )}
          </div>

          {/* ── QUANTITY ── */}
          {product.stock > 0 && (
            <div style={{ padding: "12px 14px", background: "#fff", borderTop: "1px solid #f5f5f6", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#282c3f", fontFamily: "'Nunito',sans-serif" }}>Quantity</span>
              <div className="pd-qty-ctrl">
                <button className="pd-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                <div className="pd-qty-num">{quantity}</div>
                <button className="pd-qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
              </div>
              {product.stock <= 5 && (
                <span style={{ fontSize: 11, color: "#ff3f6c", fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>⚡ Only {product.stock} left!</span>
              )}
            </div>
          )}

          {/* ── CTA BUTTONS ── */}
          {product.stock > 0 ? (
            <div className="pd-cta-section">
              <div style={{ display: "flex", gap: 10 }}>
                <button className="pd-btn-cart" style={{ flex: 1 }} onClick={() => handleAddToCart()} disabled={addToCart.isPending}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.66a2 2 0 001.98-1.71L23 6H6"/>
                  </svg>
                  {addToCart.isPending ? "Adding..." : "Add to Cart"}
                </button>
                <button className="pd-btn-buynow" style={{ flex: 1 }} onClick={handleBuyNow} disabled={addToCart.isPending}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#111"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Buy Now
                </button>
              </div>
              {/* WhatsApp CTA */}
              <a href={`https://wa.me/919876543210?text=Hi! I want to order: ${encodeURIComponent(product.name)} (₹${product.price})`}
                target="_blank" rel="noopener noreferrer" className="pd-btn-wa">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order on WhatsApp · 
              </a>
            </div>
          ) : (
            <div style={{ padding: 14, background: "#fff", borderTop: "8px solid #f5f5f6" }}>
              <NotifyMe productId={product.id} productName={product.name} />
            </div>
          )}

          {/* ── TRUST BADGES ── */}
          <TrustBadges />

          {/* ── SIZE SELECTOR ── */}
          {showSizes && (
            <div style={{ padding: "14px", background: "#fff", borderTop: "8px solid #f5f5f6" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#282c3f", fontFamily: "'Nunito',sans-serif" }}>SELECT SIZE</span>
                <span style={{ fontSize: 11, color: G, fontWeight: 600, fontFamily: "'Nunito',sans-serif", cursor: "pointer" }}>SIZE GUIDE ›</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {SIZES.map(size => (
                  <button key={size} className={`pd-size-btn${selectedSize === size ? " active" : ""}`}
                    onClick={() => setSelectedSize(size === selectedSize ? null : size)}>
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && <p style={{ fontSize: 11, color: "#94969f", fontFamily: "'Nunito',sans-serif", margin: "8px 0 0" }}>Please select a size</p>}
            </div>
          )}

          {/* ── DELIVERY ── */}
          <div style={{ padding: "14px", background: "#fff", borderTop: "8px solid #f5f5f6" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#282c3f", fontFamily: "'Nunito',sans-serif", margin: "0 0 10px" }}>DELIVERY OPTIONS</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input className="pd-pincode" placeholder="Enter delivery pincode"
                maxLength={6} value={pincode}
                onChange={e => { setPincode(e.target.value.replace(/\D/g, "")); setPincodeMsg(""); }}
                onKeyDown={e => e.key === "Enter" && checkPincode()} />
              <button onClick={checkPincode} style={{ fontSize: 12, fontWeight: 700, color: G, background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif", flexShrink: 0 }}>CHECK</button>
            </div>
            {pincodeMsg && <p style={{ fontSize: 11, color: "#03a685", fontWeight: 600, fontFamily: "'Nunito',sans-serif", margin: "6px 0 0" }}>{pincodeMsg}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {[
                { icon: "🚚", text: "Free Delivery", sub: "On orders above ₹499" },
                { icon: "↩️", text: "7 Days Return", sub: "Easy hassle-free returns" },
                { icon: "✅", text: "100% Authentic", sub: "Direct from Assam artisans" },
                { icon: "🔒", text: "Secure Payment", sub: "UPI, Cards, COD accepted" },
              ].map(item => (
                <div key={item.text} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0faf5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontSize: 12, color: "#282c3f", fontFamily: "'Nunito',sans-serif", margin: 0, fontWeight: 600 }}>{item.text}</p>
                    <p style={{ fontSize: 11, color: "#94969f", fontFamily: "'Nunito',sans-serif", margin: 0 }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── ACCORDION DETAILS ── */}
          <div style={{ background: "#fff", borderTop: "8px solid #f5f5f6" }}>
            <Accordion title="Description">
              <p style={{ margin: 0 }}>{product.description}</p>
            </Accordion>
            <Accordion title="Ingredients / Materials">
              <p style={{ margin: 0 }}>100% pure and natural {product.categoryName?.toLowerCase() ?? "product"} from Assam. No artificial additives or preservatives.</p>
            </Accordion>
            <Accordion title="Benefits">
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                <li>Authentic and handcrafted from Assam</li>
                <li>Supports local artisans and farmers</li>
                <li>Premium quality guaranteed</li>
                <li>Eco-friendly and sustainable</li>
              </ul>
            </Accordion>
            <Accordion title="How to Use">
              <p style={{ margin: 0 }}>Follow the instructions on the packaging. Store in a cool, dry place away from direct sunlight.</p>
            </Accordion>
          </div>

          {/* ── ASSAM STORY STRIP ── */}
          <AssamStoryStrip categorySlug={product.categorySlug} />

          {/* ── PRODUCT HIGHLIGHTS ── */}
          <ProductHighlights categorySlug={product.categorySlug} />

          {/* ── TABS: SPECS + REVIEWS ── */}
          <div className="pd-tabs">
            <button className={`pd-tab${activeTab === "details" ? " active" : ""}`} onClick={() => setActiveTab("details")}>PRODUCT DETAILS</button>
            <button className={`pd-tab${activeTab === "reviews" ? " active" : ""}`} onClick={() => setActiveTab("reviews")}>RATINGS & REVIEWS</button>
          </div>

          {activeTab === "details" ? (
            <div style={{ background: "#fff", padding: "14px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#282c3f", fontFamily: "'Nunito',sans-serif", margin: "0 0 10px" }}>Specifications</p>
              {[
                ["Category", product.categoryName],
                product.artisan ? ["Artisan", product.artisan] : null,
                product.origin  ? ["Origin",  product.origin]  : null,
                ["Stock", product.stock > 0 ? `${product.stock} units` : "Out of Stock"],
                ...(product.tags ?? []).map((t: string) => ["Tag", t]),
              ].filter(Boolean).map(([k, v]) => (
                <div key={String(k)} className="pd-spec-row">
                  <span className="pd-spec-key">{k}</span>
                  <span className="pd-spec-val">{v}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "#fff", padding: "14px", borderTop: "8px solid #f5f5f6" }}>
              <ReviewSystem productId={product.id} productName={product.name} />
            </div>
          )}

          {/* ── FREQUENTLY BOUGHT TOGETHER ── */}
          {relatedList.length >= 2 && (
            <FrequentlyBought
              mainProduct={product}
              relatedList={relatedList}
              onAddBundle={() => { handleAddToCart(); toast({ title: "Bundle cart mein add ho gaya! 🛍️" }); }}
            />
          )}

          {/* ── YOU MAY ALSO LIKE ── */}
          {relatedList.length > 0 && (
            <YouMayAlsoLike products={relatedList.slice(0, 8)} onNavigate={id => navigate(`/products/${id}`)} />
          )}

          {/* ── RECENTLY VIEWED ── */}
          <RecentlyViewed currentId={product.id} onNavigate={id => navigate(`/products/${id}`)} />

        </div>
      )}

      {/* ── STICKY BOTTOM BAR ── */}
      {product && product.stock > 0 && (
        <StickyBar
          product={product}
          cartCount={cartCount}
          onCart={() => handleAddToCart()}
          onBuyNow={handleBuyNow}
          loading={addToCart.isPending}
        />
      )}
    </>
  );
}
