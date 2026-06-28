import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface MainCategory { id: number; name: string; slug: string; imageUrl?: string; }
interface SubCategory  { id: number; name: string; slug: string; mainCategoryId: number; imageUrl?: string; }
interface ChildCategory{ id: number; name: string; slug: string; subCategoryId: number; }

interface Product {
  id: number; name: string; slug: string; description?: string;
  price: string | number; originalPrice?: string | number;
  imageUrl?: string; image_url?: string;
  categoryId?: number; category_id?: number;
  stock?: number; featured?: boolean;
  artisan?: string; origin?: string; rating?: string | number;
}

const CAT_ICONS: Record<string, string> = {
  all: "🏪", handloom: "🧵", tea: "🍵", handicrafts: "🏺",
  organic: "🌿", bags: "👜", gamusa: "🎀", silk: "✨", jewelry: "💎",
};
const FALLBACK_IMG = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=70";

const DEFAULT_BANNERS = [
  { id: "1", label: "CELEBRATING ASSAM'S", title: "Timeless Crafts", desc: "Handpicked from 500+ master artisans", bg: "linear-gradient(135deg,#1a4a2e,#2d7a50,#1a4a2e)", btnText: "EXPLORE NOW →", btnLink: "/products", image: "" },
  { id: "2", label: "PURE ASSAM TEA", title: "Garden Fresh", desc: "Award-winning orthodox varieties", bg: "linear-gradient(135deg,#2d4a1a,#4a7a2d,#2d4a1a)", btnText: "SHOP TEA →", btnLink: "/products?category=assam-tea", image: "" },
  { id: "3", label: "HERITAGE HANDLOOM", title: "Muga & Pat Silk", desc: "GI tagged authentic Assamese weaves", bg: "linear-gradient(135deg,#3a2d1a,#7a5a2d,#3a2d1a)", btnText: "VIEW HANDLOOM →", btnLink: "/products?category=handloom", image: "" },
];

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
  { label: "Top Rated", value: "rating" },
];

function useProductBanners() {
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("products_banners");
      if (saved) { const p = JSON.parse(saved); if (Array.isArray(p) && p.length) setBanners(p); }
    } catch {}
  }, []);
  return banners;
}

function toNum(v: string | number | undefined): number {
  if (!v) return 0;
  return typeof v === "number" ? v : parseFloat(v) || 0;
}
function discountPct(p: number, o: number) { return (!o || o <= p) ? 0 : Math.round((1 - p / o) * 100); }

function Stars({ r, count }: { r: number; count?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ fontSize: 10, color: i <= Math.round(r) ? "#ff6161" : "#d4d4d4" }}>★</span>
        ))}
      </div>
      {count !== undefined && <span style={{ fontSize: 10, color: "#999" }}>({count})</span>}
    </div>
  );
}

function sortProducts(products: Product[], sort: string): Product[] {
  const arr = [...products];
  if (sort === "price_asc") return arr.sort((a, b) => toNum(a.price) - toNum(b.price));
  if (sort === "price_desc") return arr.sort((a, b) => toNum(b.price) - toNum(a.price));
  if (sort === "rating") return arr.sort((a, b) => toNum(b.rating) - toNum(a.rating));
  if (sort === "newest") return arr.reverse();
  return arr;
}

export default function Products() {
  const [, navigate] = useLocation();
  const BANNERS = useProductBanners();

  const [mainCats, setMainCats]     = useState<MainCategory[]>([]);
  const [subCats, setSubCats]       = useState<SubCategory[]>([]);
  const [childCats, setChildCats]   = useState<ChildCategory[]>([]);
  const [activeMain, setActiveMain] = useState<string>("all");
  const [activeSub, setActiveSub]   = useState<number | null>(null);
  const [activeChild, setActiveChild] = useState<number | null>(null);
  const [expandedMain, setExpandedMain] = useState<number | null>(null);
  const [products, setProducts]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [wishlist, setWishlist]     = useState<Set<number>>(new Set());
  const [cartPops, setCartPops]     = useState<Set<number>>(new Set());
  const [bannerIdx, setBannerIdx]   = useState(0);
  const [bannerVis, setBannerVis]   = useState(true);
  const [sortBy, setSortBy]         = useState("relevance");
  const [showSort, setShowSort]     = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [viewMode, setViewMode]     = useState<"grid2" | "grid1">("grid2");

  useEffect(() => {
    fetch("/api/categories/main").then(r => r.json())
      .then(d => setMainCats(Array.isArray(d) ? d : [])).catch(() => {});
    fetch("/api/categories/sub").then(r => r.json())
      .then(d => setSubCats(Array.isArray(d) ? d : [])).catch(() => {});
    fetch("/api/categories/child").then(r => r.json())
      .then(d => setChildCats(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (activeChild !== null) p.set("childCategoryId", String(activeChild));
    else if (activeSub !== null) p.set("subCategoryId", String(activeSub));
    else if (activeMain !== "all") p.set("category", activeMain);
    fetch(`/api/products?${p}`).then(r => r.json())
      .then(d => { setProducts(Array.isArray(d) ? d : d?.products ?? []); setLoading(false); })
      .catch(() => { setProducts([]); setLoading(false); });
  }, [activeMain, activeSub, activeChild, search]);

  useEffect(() => {
    if (!BANNERS.length) return;
    const t = setInterval(() => {
      setBannerVis(false);
      setTimeout(() => { setBannerIdx(i => (i + 1) % BANNERS.length); setBannerVis(true); }, 250);
    }, 3800);
    return () => clearInterval(t);
  }, [BANNERS.length]);

  function selectMain(cat: MainCategory) {
    if (activeMain === cat.slug && expandedMain === cat.id) {
      setExpandedMain(null); setActiveMain("all"); setActiveSub(null); setActiveChild(null);
    } else {
      setActiveMain(cat.slug); setExpandedMain(cat.id); setActiveSub(null); setActiveChild(null);
    }
  }
  function selectSub(sub: SubCategory) {
    setActiveSub(activeSub === sub.id ? null : sub.id);
    setActiveChild(null);
  }
  function selectChild(child: ChildCategory) { setActiveChild(activeChild === child.id ? null : child.id); }
  function selectAll() { setActiveMain("all"); setExpandedMain(null); setActiveSub(null); setActiveChild(null); }
  function toggleWish(id: number) { setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function addToCart(id: number) {
    setCartPops(prev => new Set([...prev, id]));
    setTimeout(() => setCartPops(prev => { const n = new Set(prev); n.delete(id); return n; }), 1400);
  }

  const banner = BANNERS[bannerIdx] ?? BANNERS[0];
  const activeChildObj = childCats.find(c => c.id === activeChild);
  const activeSubObj   = subCats.find(s => s.id === activeSub);
  const activeMainObj  = mainCats.find(m => m.slug === activeMain);
  const sectionLabel   = activeChildObj?.name ?? activeSubObj?.name ?? activeMainObj?.name ?? "All Products";

  const displayedProducts = sortProducts(
    products.filter(p => {
      const price = toNum(p.price);
      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (onlyDiscount && discountPct(price, toNum(p.originalPrice)) < 1) return false;
      return true;
    }),
    sortBy
  );

  const activeFiltersCount = (onlyDiscount ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Nunito:wght@300;400;500;600&display=swap');
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes cardIn{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes scanGold{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes slideUp{0%{opacity:0;transform:translateY(100%)}100%{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{0%{opacity:0}100%{opacity:1}}

        *{box-sizing:border-box}
        body{margin:0}

        /* ─── TOP BAR ─── */
        .mn-topbar{position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid #eee;display:flex;align-items:center;gap:10px;padding:10px 14px}
        .mn-search-wrap{flex:1;display:flex;align-items:center;gap:8px;background:#f5f5f6;border-radius:4px;padding:8px 12px}
        .mn-search-wrap.focused{background:#fff;box-shadow:0 0 0 1.5px #ff3f6c}
        .mn-search-wrap input{flex:1;background:transparent;border:none;outline:none;font-size:14px;color:#282c3f;font-family:'Nunito',sans-serif}
        .mn-search-wrap input::placeholder{color:#94969f;font-size:13px}

        /* ─── BANNER ─── */
        .mn-banner{position:relative;height:180px;overflow:hidden}
        .mn-banner-dots{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:4px}
        .mn-banner-dot{height:4px;border-radius:2px;cursor:pointer;transition:all .3s}

        /* ─── CATEGORY TABS ─── */
        .mn-cat-bar{display:flex;gap:0;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid #eee;background:#fff}
        .mn-cat-bar::-webkit-scrollbar{display:none}
        .mn-cat-tab{display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 14px;flex-shrink:0;border:none;background:none;cursor:pointer;position:relative;min-width:64px}
        .mn-cat-tab span.icon{font-size:18px}
        .mn-cat-tab span.label{font-size:10px;font-weight:600;color:#282c3f;white-space:nowrap;font-family:'Nunito',sans-serif}
        .mn-cat-tab.active span.label{color:#ff3f6c}
        .mn-cat-tab.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#ff3f6c;border-radius:2px 2px 0 0}
        .mn-cat-tab .cat-img{width:36px;height:36px;border-radius:50%;object-fit:cover}

        /* ─── SUB FILTERS ─── */
        .mn-sub-bar{display:flex;gap:8px;padding:8px 14px;overflow-x:auto;scrollbar-width:none;background:#fafafa;border-bottom:1px solid #f0f0f0}
        .mn-sub-bar::-webkit-scrollbar{display:none}
        .mn-sub-chip{padding:5px 14px;border-radius:20px;border:1px solid #d4d5d9;background:#fff;font-size:11px;font-weight:600;color:#282c3f;cursor:pointer;white-space:nowrap;font-family:'Nunito',sans-serif;transition:all .15s;flex-shrink:0}
        .mn-sub-chip:hover{border-color:#282c3f}
        .mn-sub-chip.active{background:#282c3f;color:#fff;border-color:#282c3f}
        .mn-child-chip{padding:4px 12px;border-radius:14px;border:1px solid #e9e9eb;background:#fff;font-size:10px;font-weight:600;color:#535766;cursor:pointer;white-space:nowrap;font-family:'Nunito',sans-serif;transition:all .15s;flex-shrink:0}
        .mn-child-chip.active{background:#ff3f6c;color:#fff;border-color:#ff3f6c}

        /* ─── SORT / FILTER BAR ─── */
        .mn-toolbar{display:flex;align-items:center;border-bottom:1px solid #eee;background:#fff}
        .mn-tool-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:11px 0;font-size:12px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif;cursor:pointer;border:none;background:none;letter-spacing:.3px}
        .mn-tool-btn:not(:last-child){border-right:1px solid #eee}
        .mn-tool-btn.active{color:#ff3f6c}
        .mn-badge{background:#ff3f6c;color:#fff;border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center}

        /* ─── SORT SHEET ─── */
        .mn-sheet-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;animation:fadeIn .2s ease}
        .mn-sheet{position:fixed;bottom:0;left:0;right:0;background:#fff;border-radius:16px 16px 0 0;z-index:101;animation:slideUp .25s ease;max-height:70vh;overflow-y:auto}
        .mn-sheet-handle{width:36px;height:4px;background:#e0e0e0;border-radius:2px;margin:10px auto 4px}
        .mn-sheet-title{padding:12px 20px;font-size:12px;font-weight:700;color:#94969f;letter-spacing:1px;font-family:'Nunito',sans-serif;border-bottom:1px solid #f0f0f0}
        .mn-sort-opt{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;font-size:14px;color:#282c3f;font-family:'Nunito',sans-serif;cursor:pointer;border-bottom:1px solid #f9f9f9}
        .mn-sort-opt.active{color:#ff3f6c;font-weight:700}
        .mn-sort-radio{width:18px;height:18px;border-radius:50%;border:2px solid #d4d5d9;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .mn-sort-radio.active{border-color:#ff3f6c}
        .mn-sort-radio.active::after{content:'';width:9px;height:9px;border-radius:50%;background:#ff3f6c;display:block}

        /* ─── FILTER SHEET ─── */
        .mn-filter-wrap{display:flex;height:70vh}
        .mn-filter-sidebar{width:110px;background:#fafafa;border-right:1px solid #f0f0f0;overflow-y:auto}
        .mn-filter-section{padding:14px 14px;font-size:12px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif;cursor:pointer;border-bottom:1px solid #f0f0f0}
        .mn-filter-section.active{background:#fff;border-left:3px solid #ff3f6c;color:#ff3f6c}
        .mn-filter-content{flex:1;padding:16px;overflow-y:auto}
        .mn-filter-label{font-size:12px;color:#94969f;font-family:'Nunito',sans-serif;margin-bottom:10px;font-weight:600}
        .mn-filter-checkbox{display:flex;align-items:center;gap:8px;padding:8px 0;font-size:13px;color:#282c3f;font-family:'Nunito',sans-serif;cursor:pointer;border-bottom:1px solid #f9f9f9}
        .mn-check{width:16px;height:16px;border:1.5px solid #d4d5d9;border-radius:3px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px}
        .mn-check.checked{background:#ff3f6c;border-color:#ff3f6c;color:#fff}
        .mn-filter-footer{display:flex;gap:10px;padding:14px 20px;border-top:1px solid #eee;background:#fff}
        .mn-filter-clear{flex:1;padding:12px;border:1.5px solid #282c3f;border-radius:4px;background:#fff;font-size:13px;font-weight:700;color:#282c3f;cursor:pointer;font-family:'Nunito',sans-serif}
        .mn-filter-apply{flex:2;padding:12px;border:none;border-radius:4px;background:#ff3f6c;font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:'Nunito',sans-serif}

        /* ─── PRODUCT GRID ─── */
        .mn-grid2{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#f0f0f0}
        .mn-grid1{display:grid;grid-template-columns:1fr;gap:1px;background:#f0f0f0}
        .mn-pcard{background:#fff;overflow:hidden;animation:cardIn .35s ease both;position:relative;cursor:pointer}
        .mn-pcard:active{opacity:.95}
        .mn-pimg-wrap{position:relative;overflow:hidden}
        .mn-pimg{width:100%;object-fit:cover;display:block;transition:transform .5s ease}
        .mn-pcard:hover .mn-pimg{transform:scale(1.04)}
        .mn-pinfo{padding:8px 10px 12px}
        .mn-brand{font-size:12px;font-weight:700;color:#282c3f;margin-bottom:2px;font-family:'Nunito',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .mn-pname{font-size:11px;color:#535766;margin-bottom:6px;line-height:1.35;font-family:'Nunito',sans-serif;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .mn-price-row{display:flex;align-items:baseline;gap:5px;flex-wrap:wrap;margin-bottom:4px}
        .mn-price{font-size:14px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif}
        .mn-orig{font-size:11px;color:#94969f;text-decoration:line-through;font-family:'Nunito',sans-serif}
        .mn-disc{font-size:11px;font-weight:700;color:#ff905a;font-family:'Nunito',sans-serif}
        .mn-wish-btn{position:absolute;top:6px;right:6px;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.92);border:1px solid #eee;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;transition:all .2s;backdrop-filter:blur(4px);z-index:2}
        .mn-wish-btn:hover{border-color:#ff3f6c}
        .mn-wish-btn.wished{background:#fff0f3;border-color:#ffccd5}
        .mn-disc-badge{position:absolute;top:0;left:0;background:#ff3f6c;color:#fff;font-size:9px;font-weight:700;padding:3px 7px;font-family:'Nunito',sans-serif;letter-spacing:.5px}
        .mn-featured-badge{position:absolute;top:0;left:0;background:#1a5a32;color:#fff;font-size:9px;font-weight:700;padding:3px 7px;font-family:'Nunito',sans-serif;letter-spacing:.5px}
        .mn-add-btn{width:100%;margin-top:8px;padding:8px 0;border:1.5px solid #ff3f6c;border-radius:4px;background:#fff;color:#ff3f6c;font-size:11px;font-weight:700;font-family:'Nunito',sans-serif;cursor:pointer;letter-spacing:.5px;transition:all .2s}
        .mn-add-btn:hover{background:#ff3f6c;color:#fff}
        .mn-add-btn.done{background:#ff3f6c;color:#fff}
        .mn-artisan{font-size:9px;color:#1a5a32;font-weight:600;margin-top:2px;font-family:'Nunito',sans-serif}

        /* ─── SKELETON ─── */
        .mn-skel{background:linear-gradient(90deg,#f5f5f5 25%,#ebebeb 50%,#f5f5f5 75%);background-size:200% 100%;animation:shimmer 1.3s infinite;border-radius:4px}

        /* ─── EMPTY ─── */
        .mn-empty{padding:60px 20px;text-align:center;background:#fff}

        /* ─── RESULTS BAR ─── */
        .mn-results-bar{padding:10px 14px;background:#fff;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between}
        .mn-results-label{font-size:12px;color:#94969f;font-family:'Nunito',sans-serif}
        .mn-results-label strong{color:#282c3f}
        .mn-view-toggle{display:flex;gap:4px}
        .mn-view-btn{width:28px;height:28px;border:1px solid #d4d5d9;border-radius:3px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .15s}
        .mn-view-btn.active{border-color:#282c3f;background:#282c3f;color:#fff}

        /* ─── BREADCRUMB ─── */
        .mn-breadcrumb{display:flex;align-items:center;gap:4px;padding:8px 14px;background:#fff;border-bottom:1px solid #f5f5f5;flex-wrap:wrap}
        .mn-breadcrumb span{font-size:11px;color:#94969f;font-family:'Nunito',sans-serif;cursor:pointer}
        .mn-breadcrumb span:hover{color:#282c3f}
        .mn-breadcrumb .active{color:#282c3f;font-weight:600;cursor:default}
        .mn-breadcrumb .sep{color:#d4d5d9}
      `}</style>

      {/* ── TOP SEARCH BAR ── */}
      <div className="mn-topbar">
        <div className={`mn-search-wrap${searchFocused ? " focused" : ""}`}>
          <span style={{ fontSize: 16, color: "#94969f" }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search for products, brands and more"
          />
          {search && (
            <span onClick={() => setSearch("")} style={{ fontSize: 16, color: "#94969f", cursor: "pointer" }}>✕</span>
          )}
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="mn-banner">
        <div style={{ position: "absolute", inset: 0, background: banner.bg }} />
        {banner.image && (
          <img src={banner.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
        )}
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)", animation: "scanGold 4s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 20px", textAlign: "center" }}>
          <div key={bannerIdx} style={{ opacity: bannerVis ? 1 : 0, transition: "opacity .25s" }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,.7)", marginBottom: 4, fontWeight: 600, fontFamily: "'Nunito',sans-serif" }}>{banner.label}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 6 }}>{banner.title}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", fontFamily: "'Nunito',sans-serif" }}>{banner.desc}</div>
          </div>
          <a href={banner.btnLink} style={{ background: "#fff", borderRadius: 3, padding: "8px 22px", color: "#282c3f", fontSize: 11, letterSpacing: 1, fontWeight: 800, cursor: "pointer", textDecoration: "none", fontFamily: "'Nunito',sans-serif" }}>
            {banner.btnText}
          </a>
        </div>
        <div className="mn-banner-dots">
          {BANNERS.map((_, i) => (
            <div key={i} onClick={() => setBannerIdx(i)}
              className="mn-banner-dot"
              style={{ width: i === bannerIdx ? 18 : 4, background: i === bannerIdx ? "#fff" : "rgba(255,255,255,.45)" }}
            />
          ))}
        </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div className="mn-cat-bar">
        <button className={`mn-cat-tab${activeMain === "all" ? " active" : ""}`} onClick={selectAll}>
          <span className="icon">🏪</span>
          <span className="label">All</span>
        </button>
        {mainCats.map(cat => (
          <button key={cat.id} className={`mn-cat-tab${activeMain === cat.slug ? " active" : ""}`} onClick={() => selectMain(cat)}>
            {cat.imageUrl
              ? <img src={cat.imageUrl} alt={cat.name} className="cat-img" />
              : <span className="icon">{CAT_ICONS[cat.slug] ?? "🏷️"}</span>
            }
            <span className="label">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* ── SUB CATEGORIES ── */}
      {expandedMain !== null && (() => {
        const subs = subCats.filter(s => s.mainCategoryId === expandedMain);
        if (!subs.length) return null;
        return (
          <div className="mn-sub-bar">
            {subs.map(sub => (
              <button key={sub.id} className={`mn-sub-chip${activeSub === sub.id ? " active" : ""}`} onClick={() => selectSub(sub)}>
                {sub.name}
              </button>
            ))}
          </div>
        );
      })()}

      {/* ── CHILD CATEGORIES ── */}
      {activeSub !== null && (() => {
        const children = childCats.filter(c => c.subCategoryId === activeSub);
        if (!children.length) return null;
        return (
          <div className="mn-sub-bar" style={{ paddingTop: 6, background: "#fff" }}>
            {children.map(child => (
              <button key={child.id} className={`mn-child-chip${activeChild === child.id ? " active" : ""}`} onClick={() => selectChild(child)}>
                {child.name}
              </button>
            ))}
          </div>
        );
      })()}

      {/* ── BREADCRUMB ── */}
      {activeMain !== "all" && (
        <div className="mn-breadcrumb">
          <span onClick={selectAll}>Home</span>
          <span className="sep">›</span>
          <span onClick={selectAll}>Products</span>
          <span className="sep">›</span>
          <span className={!activeSubObj && !activeChildObj ? "active" : ""} onClick={() => { setActiveSub(null); setActiveChild(null); }}>{activeMainObj?.name}</span>
          {activeSubObj && <><span className="sep">›</span><span className={!activeChildObj ? "active" : ""} onClick={() => setActiveChild(null)}>{activeSubObj.name}</span></>}
          {activeChildObj && <><span className="sep">›</span><span className="active">{activeChildObj.name}</span></>}
        </div>
      )}

      {/* ── SORT / FILTER TOOLBAR ── */}
      <div className="mn-toolbar">
        <button className={`mn-tool-btn${showSort ? " active" : ""}`} onClick={() => { setShowSort(true); setShowFilter(false); }}>
          <span>⇅</span> SORT
        </button>
        <button className={`mn-tool-btn${showFilter ? " active" : ""}`} onClick={() => { setShowFilter(true); setShowSort(false); }}>
          <span>⊟</span> FILTER {activeFiltersCount > 0 && <span className="mn-badge">{activeFiltersCount}</span>}
        </button>
      </div>

      {/* ── RESULTS BAR ── */}
      <div className="mn-results-bar">
        <span className="mn-results-label">
          <strong>{displayedProducts.length}</strong> items — <strong>{sectionLabel}</strong>
        </span>
        <div className="mn-view-toggle">
          <button className={`mn-view-btn${viewMode === "grid2" ? " active" : ""}`} onClick={() => setViewMode("grid2")}>⊞</button>
          <button className={`mn-view-btn${viewMode === "grid1" ? " active" : ""}`} onClick={() => setViewMode("grid1")}>☰</button>
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className={viewMode === "grid2" ? "mn-grid2" : "mn-grid1"} style={{ paddingBottom: 80 }}>

        {loading && [...Array(6)].map((_, i) => (
          <div key={i} style={{ background: "#fff", padding: 1 }}>
            <div className="mn-skel" style={{ height: viewMode === "grid2" ? 200 : 160, borderRadius: 0 }} />
            <div style={{ padding: "8px 10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="mn-skel" style={{ height: 11, width: "60%" }} />
              <div className="mn-skel" style={{ height: 10, width: "80%" }} />
              <div className="mn-skel" style={{ height: 10, width: "40%" }} />
            </div>
          </div>
        ))}

        {!loading && displayedProducts.map((p, i) => {
          const price  = toNum(p.price);
          const orig   = toNum(p.originalPrice ?? p.price);
          const rating = toNum(p.rating) || 4.5;
          const img    = p.imageUrl ?? p.image_url ?? FALLBACK_IMG;
          const disc   = discountPct(price, orig);
          const inCart = cartPops.has(p.id);
          const imgH   = viewMode === "grid2" ? 210 : 160;

          return (
            <div key={p.id} className="mn-pcard" style={{ animationDelay: `${i * .04}s` }}>
              <div className="mn-pimg-wrap" style={{ height: imgH }} onClick={() => navigate(`/products/${p.id}`)}>
                <img src={img} alt={p.name} className="mn-pimg" style={{ height: imgH }} loading="lazy"
                  onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />

                {p.featured && <div className="mn-featured-badge">FEATURED</div>}
                {disc >= 5 && !p.featured && <div className="mn-disc-badge">{disc}% OFF</div>}

                <button className={`mn-wish-btn${wishlist.has(p.id) ? " wished" : ""}`}
                  onClick={e => { e.stopPropagation(); toggleWish(p.id); }}>
                  {wishlist.has(p.id) ? "❤️" : "🤍"}
                </button>
              </div>

              <div className="mn-pinfo">
                <div className="mn-brand" onClick={() => navigate(`/products/${p.id}`)}>
                  {p.artisan ?? "ApunBazar"}
                </div>
                <div className="mn-pname" onClick={() => navigate(`/products/${p.id}`)}>
                  {p.name}
                </div>
                <div className="mn-price-row">
                  <span className="mn-price">₹{price.toLocaleString()}</span>
                  {disc > 0 && <span className="mn-orig">₹{orig.toLocaleString()}</span>}
                  {disc > 0 && <span className="mn-disc">({disc}% OFF)</span>}
                </div>
                <Stars r={rating} />
                {p.origin && <div className="mn-artisan">📍 {p.origin}</div>}
                <button className={`mn-add-btn${inCart ? " done" : ""}`} onClick={() => addToCart(p.id)}>
                  {inCart ? "✓ ADDED TO BAG" : "ADD TO BAG"}
                </button>
              </div>
            </div>
          );
        })}

        {!loading && displayedProducts.length === 0 && (
          <div className="mn-empty" style={{ gridColumn: "1/-1" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#282c3f", fontFamily: "'Nunito',sans-serif", marginBottom: 6 }}>
              We couldn't find a match
            </div>
            <div style={{ fontSize: 13, color: "#94969f", fontFamily: "'Nunito',sans-serif", marginBottom: 16 }}>
              Try different filters or search terms
            </div>
            <button onClick={selectAll} style={{ padding: "10px 24px", border: "1.5px solid #282c3f", borderRadius: 4, background: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
              CLEAR FILTERS
            </button>
          </div>
        )}
      </div>

      {/* ── SORT BOTTOM SHEET ── */}
      {showSort && (
        <>
          <div className="mn-sheet-overlay" onClick={() => setShowSort(false)} />
          <div className="mn-sheet">
            <div className="mn-sheet-handle" />
            <div className="mn-sheet-title">SORT BY</div>
            {SORT_OPTIONS.map(opt => (
              <div key={opt.value} className={`mn-sort-opt${sortBy === opt.value ? " active" : ""}`}
                onClick={() => { setSortBy(opt.value); setShowSort(false); }}>
                {opt.label}
                <div className={`mn-sort-radio${sortBy === opt.value ? " active" : ""}`} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── FILTER BOTTOM SHEET ── */}
      {showFilter && (
        <>
          <div className="mn-sheet-overlay" onClick={() => setShowFilter(false)} />
          <div className="mn-sheet" style={{ display: "flex", flexDirection: "column" }}>
            <div className="mn-sheet-handle" />
            <div className="mn-sheet-title">FILTERS</div>
            <div className="mn-filter-wrap">
              <div className="mn-filter-sidebar">
                <div className="mn-filter-section active">Price</div>
                <div className="mn-filter-section">Discount</div>
              </div>
              <div className="mn-filter-content">
                <div className="mn-filter-label">PRICE RANGE</div>
                {[
                  [0, 500, "Under ₹500"],
                  [500, 1000, "₹500 – ₹1,000"],
                  [1000, 2500, "₹1,000 – ₹2,500"],
                  [2500, 5000, "₹2,500 – ₹5,000"],
                  [5000, 10000, "Above ₹5,000"],
                ].map(([min, max, label]) => (
                  <div key={String(label)} className="mn-filter-checkbox"
                    onClick={() => setPriceRange([min as number, max as number])}>
                    <div className={`mn-check${priceRange[0] === min && priceRange[1] === max ? " checked" : ""}`}>
                      {priceRange[0] === min && priceRange[1] === max ? "✓" : ""}
                    </div>
                    {label}
                  </div>
                ))}
                <div style={{ marginTop: 16 }} className="mn-filter-label">DISCOUNT</div>
                <div className="mn-filter-checkbox" onClick={() => setOnlyDiscount(v => !v)}>
                  <div className={`mn-check${onlyDiscount ? " checked" : ""}`}>{onlyDiscount ? "✓" : ""}</div>
                  On Sale Only
                </div>
              </div>
            </div>
            <div className="mn-filter-footer">
              <button className="mn-filter-clear" onClick={() => { setPriceRange([0, 10000]); setOnlyDiscount(false); }}>
                CLEAR ALL
              </button>
              <button className="mn-filter-apply" onClick={() => setShowFilter(false)}>
                APPLY
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
