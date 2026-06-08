import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams } from "wouter";

interface Category { id: number; name: string; slug: string; description?: string; imageUrl?: string; }
interface Product {
  id: number; name: string; slug?: string; description?: string;
  price: string | number; originalPrice?: string | number;
  imageUrl?: string; image_url?: string;
  categoryId?: number; category_id?: number;
  stock?: number; featured?: boolean;
  artisan?: string; origin?: string; rating?: string | number;
  images?: string[];
}

// Category-specific config
const CAT_CONFIG: Record<string, {
  emoji: string; color: string; accent: string;
  banners: { title: string; sub: string; tag: string }[];
  subCategories: { name: string; slug: string; emoji: string; childCategories?: { name: string; slug: string }[] }[];
}> = {
  "handloom": {
    emoji: "🧵", color: "#1a3a2e", accent: "#c9a84c",
    banners: [
      { tag: "GI TAGGED AUTHENTIC", title: "Muga & Pat Silk", sub: "Woven by master artisans of Sualkuchi" },
      { tag: "HERITAGE COLLECTION", title: "Mekhela Chador", sub: "Traditional Assamese women's attire" },
      { tag: "GAMOSA SPECIAL", title: "Symbol of Assam", sub: "Gifted with love across generations" },
    ],
    subCategories: [
      { name: "Silk Fabrics", slug: "silk", emoji: "✨", childCategories: [{ name: "Muga Silk", slug: "muga" }, { name: "Pat Silk", slug: "pat" }, { name: "Eri Silk", slug: "eri" }] },
      { name: "Mekhela Chador", slug: "mekhela", emoji: "👘", childCategories: [{ name: "Bridal", slug: "bridal" }, { name: "Casual", slug: "casual" }] },
      { name: "Gamosa", slug: "gamosa", emoji: "🎀", childCategories: [{ name: "Traditional", slug: "traditional" }, { name: "Modern", slug: "modern" }] },
      { name: "Sarees", slug: "sarees", emoji: "🪡" },
      { name: "Fabric Rolls", slug: "fabric", emoji: "🧶" },
    ],
  },
  "tea": {
    emoji: "🍵", color: "#1a2e1a", accent: "#7ab648",
    banners: [
      { tag: "AWARD WINNING", title: "Assam Orthodox", sub: "Bold, malty, world-famous black tea" },
      { tag: "GARDEN FRESH", title: "First Flush 2026", sub: "Limited seasonal harvest — just arrived" },
      { tag: "WELLNESS BLEND", title: "Green & Herbal", sub: "Pure Assam herbs for mind & body" },
    ],
    subCategories: [
      { name: "Black Tea", slug: "black", emoji: "⬛", childCategories: [{ name: "Orthodox", slug: "orthodox" }, { name: "CTC", slug: "ctc" }, { name: "Tippy Golden", slug: "tgfop" }] },
      { name: "Green Tea", slug: "green", emoji: "🍃", childCategories: [{ name: "Organic", slug: "organic-green" }, { name: "Jasmine", slug: "jasmine" }] },
      { name: "White Tea", slug: "white", emoji: "🤍" },
      { name: "Herbal Blend", slug: "herbal", emoji: "🌿" },
      { name: "Gift Sets", slug: "gift-sets", emoji: "🎁" },
    ],
  },
  "handicrafts": {
    emoji: "🏺", color: "#2e1a0e", accent: "#c97a3a",
    banners: [
      { tag: "MASTER CRAFTSMEN", title: "Bamboo & Cane", sub: "Eco-friendly art from the forests of Assam" },
      { tag: "TRIBAL HERITAGE", title: "Masks & Pottery", sub: "Traditional Assamese folk art forms" },
      { tag: "HOME DÉCOR", title: "Handcrafted Wonders", sub: "Unique pieces for your living space" },
    ],
    subCategories: [
      { name: "Bamboo Craft", slug: "bamboo", emoji: "🪵", childCategories: [{ name: "Furniture", slug: "furniture" }, { name: "Baskets", slug: "baskets" }, { name: "Decor", slug: "decor" }] },
      { name: "Pottery", slug: "pottery", emoji: "🏺" },
      { name: "Masks", slug: "masks", emoji: "🎭" },
      { name: "Paintings", slug: "paintings", emoji: "🎨" },
      { name: "Jewelry", slug: "jewelry", emoji: "💎" },
    ],
  },
  "organic": {
    emoji: "🌿", color: "#1e2e10", accent: "#82c341",
    banners: [
      { tag: "100% NATURAL", title: "Joha Rice", sub: "Fragrant heirloom rice from Assam's fields" },
      { tag: "COLD PRESSED", title: "Mustard Oil", sub: "Kachi ghani — traditional extraction method" },
      { tag: "FOREST HARVEST", title: "Wild Honey", sub: "Raw, unprocessed, straight from the hive" },
    ],
    subCategories: [
      { name: "Rice & Grains", slug: "rice", emoji: "🌾", childCategories: [{ name: "Joha Rice", slug: "joha" }, { name: "Red Rice", slug: "red-rice" }, { name: "Black Rice", slug: "black-rice" }] },
      { name: "Oils & Ghee", slug: "oils", emoji: "🫙" },
      { name: "Honey", slug: "honey", emoji: "🍯" },
      { name: "Spices", slug: "spices", emoji: "🌶️" },
      { name: "Pickles", slug: "pickles", emoji: "🥒" },
    ],
  },
  "bags": {
    emoji: "👜", color: "#2e1a2e", accent: "#c97ac9",
    banners: [
      { tag: "SUSTAINABLE FASHION", title: "Jute & Cane Bags", sub: "Eco-chic accessories from Assam" },
      { tag: "HANDWOVEN", title: "Tribal Totes", sub: "Bold patterns, zero plastic" },
      { tag: "GIFTING SPECIAL", title: "Gift Hampers", sub: "Curated Assamese luxury gift sets" },
    ],
    subCategories: [
      { name: "Jute Bags", slug: "jute", emoji: "🎒", childCategories: [{ name: "Tote", slug: "tote" }, { name: "Sling", slug: "sling" }] },
      { name: "Cane Baskets", slug: "cane", emoji: "🧺" },
      { name: "Clutches", slug: "clutches", emoji: "👛" },
      { name: "Travel Bags", slug: "travel", emoji: "🧳" },
      { name: "Gift Hampers", slug: "hampers", emoji: "🎁" },
    ],
  },
};

const DEFAULT_CONFIG = {
  emoji: "🏪", color: "#1a3a2e", accent: "#c9a84c",
  banners: [
    { tag: "CELEBRATING ASSAM", title: "Artisan Collection", sub: "Handpicked from 500+ master artisans" },
    { tag: "PREMIUM QUALITY", title: "Authentic Products", sub: "Straight from the heart of Northeast India" },
  ],
  subCategories: [],
};

const FALLBACK = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=70";

function toNum(v: string | number | undefined): number {
  if (!v) return 0;
  return typeof v === "number" ? v : parseFloat(v) || 0;
}
function discPct(p: number, o: number) { return (!o || o <= p) ? 0 : Math.round((1 - p / o) * 100); }

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const slug = params.slug ?? "all";
  const cfg = CAT_CONFIG[slug] ?? DEFAULT_CONFIG;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [activeChild, setActiveChild] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [cartAnim, setCartAnim] = useState<Set<number>>(new Set());
  const [bannerIdx, setBannerIdx] = useState(0);
  const [bannerAnim, setBannerAnim] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 10;

  // Load category info
  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then((cats: Category[]) => {
      const found = (Array.isArray(cats) ? cats : []).find(c => c.slug === slug);
      setCategory(found ?? null);
    }).catch(() => {});
  }, [slug]);

  // Load products
  useEffect(() => {
    setLoading(true); setPage(1); setProducts([]); setAllProducts([]);
    const p = new URLSearchParams();
    p.set("category", slug); p.set("limit", "100");
    fetch(`/api/products?${p}`).then(r => r.json()).then(d => {
      const arr: Product[] = Array.isArray(d) ? d : (d?.products ?? []);
      setAllProducts(arr);
      setProducts(arr.slice(0, PAGE_SIZE));
      setHasMore(arr.length > PAGE_SIZE);
      setLoading(false);
    }).catch(() => { setLoading(false); });
  }, [slug]);

  // Auto-rotate banner
  useEffect(() => {
    const t = setInterval(() => {
      setBannerAnim(false);
      setTimeout(() => { setBannerIdx(i => (i + 1) % cfg.banners.length); setBannerAnim(true); }, 300);
    }, 4000);
    return () => clearInterval(t);
  }, [cfg.banners.length]);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasMore && !loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setPage(prev => {
          const next = prev + 1;
          const filtered = getFiltered();
          const nextSlice = filtered.slice(0, next * PAGE_SIZE);
          setProducts(nextSlice);
          setHasMore(nextSlice.length < filtered.length);
          setLoadingMore(false);
          return next;
        });
      }, 600);
    }
  }, [hasMore, loadingMore]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  function getFiltered(): Product[] {
    let arr = [...allProducts];
    if (search) arr = arr.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "price_asc") arr.sort((a, b) => toNum(a.price) - toNum(b.price));
    else if (sort === "price_desc") arr.sort((a, b) => toNum(b.price) - toNum(a.price));
    else if (sort === "rating") arr.sort((a, b) => toNum(b.rating) - toNum(a.rating));
    else arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return arr;
  }

  // Re-filter when search/sort changes
  useEffect(() => {
    const filtered = getFiltered();
    setProducts(filtered.slice(0, page * PAGE_SIZE));
    setHasMore(filtered.length > page * PAGE_SIZE);
  }, [search, sort, allProducts]);

  function addCart(id: number) {
    setCartAnim(p => new Set([...p, id]));
    setTimeout(() => setCartAnim(p => { const n = new Set(p); n.delete(id); return n; }), 1500);
  }

  const banner = cfg.banners[bannerIdx];
  const activeSub_ = cfg.subCategories.find(s => s.slug === activeSub);
  const displayedProducts = products;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Nunito:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;600&display=swap');
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        @keyframes scan{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}  }
        @keyframes bounce{0%,100%{transform:scale(1)}40%{transform:scale(.88)}70%{transform:scale(1.07)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes dotPulse{0%,100%{opacity:.4;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
        .cp-banner-content{animation:fadeIn .4s ease}
        .cp-card{animation:slideUp .4s ease both;transition:transform .3s,box-shadow .3s}
        .cp-card:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,.15)!important}
        .cp-img{transition:transform .5s ease}
        .cp-card:hover .cp-img{transform:scale(1.1)}
        .cp-sub{transition:all .22s;cursor:pointer;flex-shrink:0}
        .cp-sub:hover{transform:translateY(-3px)}
        .cp-sub.active{transform:translateY(-2px)}
        .cp-add{transition:all .22s;cursor:pointer;border:none;font-family:'Nunito',sans-serif}
        .cp-add:hover{filter:brightness(1.08);transform:scale(1.02)}
        .cp-add.done{animation:bounce .4s ease}
        .cp-wish{transition:all .2s;cursor:pointer;border:none;background:transparent;font-size:16px}
        .cp-wish:hover{transform:scale(1.2)}
        .shimmer{background:linear-gradient(90deg,#f0ede4 0%,#e4e0d4 50%,#f0ede4 100%);background-size:800px 100%;animation:shimmer 1.6s infinite}
        .sort-select{background:#fff;border:1.5px solid #e0d8c0;border-radius:10px;padding:7px 12px;font-family:'Nunito',sans-serif;font-size:12px;color:#333;cursor:pointer;outline:none}
        .sort-select:focus{border-color:${cfg.accent}}
        ::-webkit-scrollbar{width:3px;height:3px} ::-webkit-scrollbar-thumb{background:${cfg.accent}40;border-radius:4px}
      `}</style>

      <div style={{ background: "#f7f4ed", minHeight: "100vh", fontFamily: "'Nunito',sans-serif" }}>

        {/* ═══ HERO BANNER ═══ */}
        <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
          {/* BG */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${cfg.color} 0%, ${cfg.color}cc 60%, ${cfg.color}88 100%)` }} />
          {/* Pattern */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .06, pointerEvents: "none" }}>
            <defs><pattern id="cp-pat" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="14" cy="14" r="1.5" fill={cfg.accent} />
              <path d="M0,14 Q7,7 14,14 Q21,21 28,14" stroke={cfg.accent} strokeWidth=".8" fill="none" />
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#cp-pat)" />
          </svg>
          {/* Glow */}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 60% at 50% 80%, ${cfg.accent}15 0%, transparent 70%)` }} />
          {/* Scan */}
          <div style={{ position: "absolute", top: 0, bottom: 0, width: "30%", background: `linear-gradient(90deg, transparent, ${cfg.accent}08, transparent)`, animation: "scan 5s ease-in-out infinite" }} />

          {/* Content */}
          <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "0 20px", textAlign: "center" }}>
            {/* Back */}
            <button onClick={() => navigate("/")} style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 100, padding: "6px 14px", color: "rgba(255,255,255,.8)", fontSize: 12, fontFamily: "'Nunito',sans-serif", cursor: "pointer", backdropFilter: "blur(4px)" }}>
              ← Back
            </button>

            {/* Tag */}
            <div style={{ background: `rgba(${cfg.accent === "#c9a84c" ? "201,168,76" : "130,195,65"},.2)`, border: `1px solid ${cfg.accent}60`, borderRadius: 100, padding: "4px 16px", fontSize: 10, letterSpacing: 3, color: cfg.accent, fontWeight: 700 }}>
              ✦ {banner.tag} ✦
            </div>

            {/* Main text */}
            <div key={bannerIdx} className={bannerAnim ? "cp-banner-content" : ""} style={{ opacity: bannerAnim ? 1 : 0, transition: "opacity .3s" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", letterSpacing: 4, fontWeight: 600, marginBottom: 6 }}>{category?.name ?? slug.toUpperCase()}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 6, textShadow: "0 2px 20px rgba(0,0,0,.3)" }}>{banner.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", letterSpacing: .4 }}>{banner.sub}</div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: cfg.accent }}>{allProducts.length}+</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", letterSpacing: 1 }}>PRODUCTS</div>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,.15)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: cfg.accent }}>500+</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", letterSpacing: 1 }}>ARTISANS</div>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,.15)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: cfg.accent }}>GI</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", letterSpacing: 1 }}>CERTIFIED</div>
              </div>
            </div>
          </div>

          {/* Banner dots */}
          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
            {cfg.banners.map((_, i) => (
              <div key={i} onClick={() => setBannerIdx(i)} style={{ height: 4, borderRadius: 100, cursor: "pointer", transition: "all .3s", width: i === bannerIdx ? 20 : 4, background: i === bannerIdx ? cfg.accent : "rgba(255,255,255,.35)" }} />
            ))}
          </div>
        </div>

        {/* Gamusa stripe */}
        <div style={{ height: 3, background: `repeating-linear-gradient(90deg, ${cfg.color} 0, ${cfg.color} 8px, transparent 8px, transparent 14px, ${cfg.accent} 14px, ${cfg.accent} 16px, transparent 16px, transparent 22px)`, opacity: .5 }} />

        {/* ═══ STICKY SEARCH BAR ═══ */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(247,244,237,.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e8e2d0", padding: "10px 14px" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Search */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1.5px solid ${search ? cfg.accent : "#e0d8c0"}`, borderRadius: 12, padding: "0 12px", transition: "border-color .2s", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
              <span style={{ fontSize: 15, color: "#999" }}>⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={`Search in ${category?.name ?? slug}...`}
                style={{ flex: 1, border: "none", outline: "none", fontFamily: "'Nunito',sans-serif", fontSize: 13, color: "#333", background: "transparent", padding: "10px 0" }} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>}
              {/* Voice icon */}
              <span style={{ fontSize: 14, color: "#bbb", cursor: "pointer" }}>🎤</span>
            </div>
            {/* Sort */}
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="popular">Popular</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* ═══ SUB CATEGORIES ═══ */}
        {cfg.subCategories.length > 0 && (
          <div style={{ padding: "16px 0 8px" }}>
            <div style={{ padding: "0 14px 8px", fontSize: 10, letterSpacing: 3, color: cfg.color, fontWeight: 700, opacity: .7 }}>BROWSE SUBCATEGORIES</div>
            <div style={{ display: "flex", gap: 10, padding: "4px 14px 4px", overflowX: "auto", scrollbarWidth: "none" }}>
              {cfg.subCategories.map(sub => (
                <button key={sub.slug} className={`cp-sub${activeSub === sub.slug ? " active" : ""}`}
                  onClick={() => { setActiveSub(activeSub === sub.slug ? null : sub.slug); setActiveChild(null); }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    padding: "12px 14px", borderRadius: 16, minWidth: 72,
                    background: activeSub === sub.slug
                      ? `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`
                      : "rgba(255,255,255,.8)",
                    border: `1.5px solid ${activeSub === sub.slug ? cfg.color : "#e0d8c0"}`,
                    boxShadow: activeSub === sub.slug
                      ? `0 6px 20px ${cfg.color}30`
                      : "0 2px 8px rgba(0,0,0,.06)",
                    backdropFilter: "blur(4px)",
                  }}>
                  <span style={{ fontSize: 22 }}>{sub.emoji}</span>
                  <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 600, color: activeSub === sub.slug ? "#fff" : "#333", whiteSpace: "nowrap", textAlign: "center" }}>{sub.name}</span>
                </button>
              ))}
            </div>

            {/* Child categories */}
            {activeSub_ && activeSub_?.childCategories && activeSub_?.childCategories?.length > 0 && (
              <div style={{ display: "flex", gap: 8, padding: "8px 14px 4px", overflowX: "auto", scrollbarWidth: "none", animation: "slideUp .3s ease" }}>
                {activeSub_?.childCategories?.map(child => (
                  <button key={child.slug} onClick={() => setActiveChild(activeChild === child.slug ? null : child.slug)}
                    style={{
                      flexShrink: 0, padding: "5px 14px", borderRadius: 100,
                      background: activeChild === child.slug ? cfg.accent : "#fff",
                      border: `1.5px solid ${activeChild === child.slug ? cfg.accent : "#e0d8c0"}`,
                      color: activeChild === child.slug ? "#fff" : "#555",
                      fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 600,
                      cursor: "pointer", transition: "all .2s",
                    }}>
                    {child.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ SECTION HEADER ═══ */}
        <div style={{ padding: "10px 14px 6px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: cfg.accent, fontWeight: 700, marginBottom: 2 }}>
              {activeSub_ ? activeSub_.name.toUpperCase() : "ALL PRODUCTS"}
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 600, color: "#1a2d1a" }}>
              {activeChild
                ? activeSub_?.childCategories?.find(c => c.slug === activeChild)?.name
                : activeSub_ ? activeSub_.name
                : (category?.name ?? "Collection")}
              <span style={{ fontSize: 13, color: "#aaa", marginLeft: 7, fontFamily: "'Nunito',sans-serif", fontWeight: 400 }}>
                ({displayedProducts.length} items)
              </span>
            </div>
          </div>
          {/* Layout toggle placeholder */}
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fff", border: "1.5px solid #e0d8c0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer" }}>⊞</div>
          </div>
        </div>

        {/* ═══ PRODUCTS GRID ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "4px 12px 80px" }}>

          {/* Skeletons */}
          {loading && [...Array(8)].map((_, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: "hidden", background: "#fff", border: "1px solid #e8e2d0", boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
              <div className="shimmer" style={{ height: 170 }} />
              <div style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="shimmer" style={{ height: 11, width: "75%", borderRadius: 6 }} />
                <div className="shimmer" style={{ height: 10, width: "45%", borderRadius: 6 }} />
                <div className="shimmer" style={{ height: 28, borderRadius: 8 }} />
              </div>
            </div>
          ))}

          {/* Product cards */}
          {!loading && displayedProducts.map((p, i) => {
            const price = toNum(p.price);
            const orig = toNum(p.originalPrice);
            const disc = discPct(price, orig);
            const rating = toNum(p.rating) || 4.2;
            const img = p.imageUrl ?? p.image_url ?? FALLBACK;
            const img2 = p.images?.[1] ?? img;
            const isHovered = hovered === p.id;
            const inCart = cartAnim.has(p.id);
            const isWish = wishlist.has(p.id);

            return (
              <div key={p.id} className="cp-card"
                style={{ borderRadius: 16, overflow: "hidden", background: "#fff", border: "1px solid #e8e2d0", boxShadow: "0 3px 14px rgba(0,0,0,.07)", animationDelay: `${i * .04}s` }}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}>

                {/* Image container */}
                <div style={{ position: "relative", height: 170, overflow: "hidden", background: "#f0ede4", cursor: "pointer" }}
                  onClick={() => navigate(`/products/${p.slug ?? p.id}`)}>

                  {/* Main image */}
                  <img src={isHovered && img2 !== img ? img2 : img} alt={p.name}
                    className="cp-img"
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                    onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />

                  {/* Overlay gradient */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(0,0,0,.4) 0%,transparent 55%)", pointerEvents: "none" }} />

                  {/* Badges */}
                  {p.featured && (
                    <div style={{ position: "absolute", top: 8, left: 8, background: cfg.color, color: "#fff", borderRadius: 100, padding: "3px 10px", fontSize: 9, letterSpacing: .8, fontWeight: 700 }}>★ TOP PICK</div>
                  )}
                  {disc >= 10 && !p.featured && (
                    <div style={{ position: "absolute", top: 8, left: 8, background: "#e05c2a", color: "#fff", borderRadius: 100, padding: "3px 10px", fontSize: 9, letterSpacing: .8, fontWeight: 700 }}>-{disc}%</div>
                  )}
                  {p.stock === 0 && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, border: "1.5px solid rgba(255,255,255,.5)", padding: "4px 14px", borderRadius: 100 }}>SOLD OUT</span>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button className="cp-wish" onClick={e => { e.stopPropagation(); setWishlist(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; }); }}
                    style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: "50%", background: isWish ? "#fff5f0" : "rgba(255,255,255,.9)", border: `1.5px solid ${isWish ? "#e05c2a" : "rgba(255,255,255,.6)"}`, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
                    <span style={{ fontSize: 14 }}>{isWish ? "❤️" : "🤍"}</span>
                  </button>

                  {/* Artisan tag */}
                  {p.artisan && (
                    <div style={{ position: "absolute", bottom: 7, left: 8, fontSize: 9, color: "rgba(255,255,255,.75)", letterSpacing: .3, fontWeight: 500 }}>✦ {p.artisan}</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "10px 11px 11px" }}>
                  {/* Name */}
                  <div onClick={() => navigate(`/products/${p.slug ?? p.id}`)}
                    style={{ fontFamily: "'Playfair Display',serif", fontSize: 12.5, fontWeight: 500, color: "#1a2d1a", lineHeight: 1.35, marginBottom: 5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", cursor: "pointer", minHeight: 34 }}>
                    {p.name}
                  </div>

                  {/* Origin */}
                  {p.origin && (
                    <div style={{ fontSize: 9, color: "#aaa", letterSpacing: .5, marginBottom: 4, fontWeight: 500 }}>📍 {p.origin}</div>
                  )}

                  {/* Rating */}
                  <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 6 }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 10, color: s <= Math.floor(rating) ? cfg.accent : "#ddd" }}>★</span>)}
                    <span style={{ fontSize: 10, color: "#aaa", marginLeft: 2 }}>{rating.toFixed(1)}</span>
                  </div>

                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 9 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: cfg.color }}>₹{price.toLocaleString()}</span>
                    {disc > 0 && <span style={{ fontSize: 11, color: "#bbb", textDecoration: "line-through" }}>₹{orig.toLocaleString()}</span>}
                    {disc >= 10 && <span style={{ fontSize: 9, color: "#e05c2a", fontWeight: 700, background: "#fff0ea", padding: "1px 6px", borderRadius: 100 }}>{disc}% OFF</span>}
                  </div>

                  {/* Add to Cart */}
                  <button className={`cp-add${inCart ? " done" : ""}`}
                    disabled={p.stock === 0}
                    onClick={() => addCart(p.id)}
                    style={{
                      width: "100%", borderRadius: 10, padding: "8px 0",
                      fontSize: 10, letterSpacing: 1.2, fontWeight: 700,
                      background: inCart
                        ? cfg.color
                        : p.stock === 0
                        ? "#f0ede4"
                        : "#fff",
                      color: inCart ? "#fff" : p.stock === 0 ? "#bbb" : cfg.color,
                      border: `1.5px solid ${p.stock === 0 ? "#e0d8c0" : cfg.color}`,
                      cursor: p.stock === 0 ? "not-allowed" : "pointer",
                    }}>
                    {inCart ? "✓ ADDED!" : p.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {!loading && displayedProducts.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{cfg.emoji}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#555", marginBottom: 6 }}>No products found</div>
              <div style={{ fontSize: 13, color: "#aaa" }}>Try clearing your search or browse all categories</div>
            </div>
          )}
        </div>

        {/* ═══ LOAD MORE TRIGGER ═══ */}
        <div ref={loadMoreRef} style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          {loadingMore && (
            <div style={{ display: "flex", gap: 6 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.accent, animation: `dotPulse 1.2s ease ${i * .2}s infinite` }} />
              ))}
            </div>
          )}
          {!hasMore && !loading && displayedProducts.length > 0 && (
            <div style={{ fontSize: 12, color: "#bbb", letterSpacing: 2, fontWeight: 600 }}>✦ END OF COLLECTION ✦</div>
          )}
        </div>

      </div>
    </>
  );
}