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

const G = "#1a5a32";
const GOLD = "#c9a84c";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=70";
const FALLBACK_CAT_IMG = "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&q=70";

const DEFAULT_BANNERS = [
  { id: "1", label: "CELEBRATING ASSAM'S", title: "Timeless Crafts", desc: "Handpicked from 500+ master artisans", bg: "linear-gradient(135deg,#1a4a2e,#2d7a50,#1a4a2e)", btnText: "EXPLORE NOW →", btnLink: "/products", image: "" },
  { id: "2", label: "PURE ASSAM TEA", title: "Garden Fresh", desc: "Award-winning orthodox varieties from the lush gardens of Assam.", bg: "linear-gradient(135deg,#2d4a1a,#4a7a2d,#2d4a1a)", btnText: "SHOP TEA →", btnLink: "/products?category=assam-tea", image: "" },
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
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ fontSize: 11, color: i <= Math.round(r) ? G : "#e0ddd4" }}>★</span>
        ))}
      </div>
      <span style={{ fontSize: 11, color: "#9a9a8f", fontFamily: "'Nunito',sans-serif" }}>{r.toFixed(1)}</span>
      {count !== undefined && <span style={{ fontSize: 10, color: "#9a9a8f" }}>({count})</span>}
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
  const [cartCount, setCartCount]   = useState(4);
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
    setCartCount(c => c + 1);
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Nunito:wght@300;400;500;600;700;800&display=swap');
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes cardIn{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes scanGold{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes slideUp{0%{opacity:0;transform:translateY(100%)}100%{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{0%{opacity:0}100%{opacity:1}}

        *{box-sizing:border-box}
        body{margin:0;background:#faf7f0}

        .ab-header{position:sticky;top:0;z-index:50;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #f0ece2}
        .ab-logo{font-family:'Playfair Display',serif;font-weight:700;font-size:19px;color:${G};display:flex;align-items:center;gap:6px}
        .ab-logo .accent{color:${GOLD}}
        .ab-header-icons{display:flex;align-items:center;gap:18px}
        .ab-icon-btn{position:relative;background:none;border:none;cursor:pointer;font-size:18px;color:#282c3f;display:flex}
        .ab-cart-badge{position:absolute;top:-7px;right:-8px;background:${G};color:#fff;border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:'Nunito',sans-serif}

        .ab-search-bar{padding:12px 16px;background:#fff}
        .ab-search-wrap{display:flex;align-items:center;gap:10px;background:#f6f3ec;border-radius:24px;padding:11px 16px}
        .ab-search-wrap.focused{box-shadow:0 0 0 1.5px ${G}55;background:#fff}
        .ab-search-wrap input{flex:1;background:transparent;border:none;outline:none;font-size:13.5px;color:#282c3f;font-family:'Nunito',sans-serif}
        .ab-search-wrap input::placeholder{color:#a3a399;font-size:13px}

        .ab-banner-wrap{padding:0 16px 16px}
        .ab-banner{position:relative;height:200px;overflow:hidden;border-radius:18px}
        .ab-banner-dots{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:4px}
        .ab-banner-dot{height:4px;border-radius:2px;cursor:pointer;transition:all .3s}

        .ab-cat-card{margin:0 16px 16px;background:#fff;border-radius:18px;padding:16px 12px 12px;box-shadow:0 2px 14px rgba(0,0,0,.04)}
        .ab-cat-bar{display:flex;gap:0;overflow-x:auto;scrollbar-width:none}
        .ab-cat-bar::-webkit-scrollbar{display:none}
        .ab-cat-tab{display:flex;flex-direction:column;align-items:center;gap:7px;padding:0 12px;flex-shrink:0;border:none;background:none;cursor:pointer;position:relative;min-width:68px}
        .ab-cat-tab .cat-circle{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid transparent;transition:border-color .2s}
        .ab-cat-tab.active .cat-circle{border-color:${G}}
        .ab-cat-tab .cat-circle-all{width:52px;height:52px;border-radius:14px;background:#f0ece2;display:flex;align-items:center;justify-content:center;font-size:20px}
        .ab-cat-tab span.label{font-size:11px;font-weight:600;color:#6b6b60;white-space:nowrap;font-family:'Nunito',sans-serif}
        .ab-cat-tab.active span.label{color:${G};font-weight:800}
        .ab-cat-tab.active::after{content:'';position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:18px;height:2.5px;background:${G};border-radius:2px}

        .ab-sub-bar{display:flex;gap:8px;padding:0 16px 12px;overflow-x:auto;scrollbar-width:none}
        .ab-sub-bar::-webkit-scrollbar{display:none}
        .ab-sub-chip{padding:7px 16px;border-radius:20px;border:1px solid #e4ddc9;background:#fff;font-size:11.5px;font-weight:700;color:#535766;cursor:pointer;white-space:nowrap;font-family:'Nunito',sans-serif;transition:all .15s;flex-shrink:0}
        .ab-sub-chip.active{background:${G};color:#fff;border-color:${G}}
        .ab-child-chip{padding:5px 13px;border-radius:14px;border:1px solid #ece6d8;background:#fdfbf6;font-size:10.5px;font-weight:600;color:#7a7a6e;cursor:pointer;white-space:nowrap;font-family:'Nunito',sans-serif;transition:all .15s;flex-shrink:0}
        .ab-child-chip.active{background:${GOLD};color:#fff;border-color:${GOLD}}

        .ab-breadcrumb{display:flex;align-items:center;gap:4px;padding:0 16px 10px;flex-wrap:wrap}
        .ab-breadcrumb span{font-size:11px;color:#9a9a8f;font-family:'Nunito',sans-serif;cursor:pointer}
        .ab-breadcrumb span:hover{color:${G}}
        .ab-breadcrumb .active{color:${G};font-weight:700;cursor:default}
        .ab-breadcrumb .sep{color:#d8d2c2}

        .ab-toolbar{display:flex;align-items:center;background:#fff;margin:0 16px 14px;border-radius:14px;border:1px solid #f0ece2;overflow:hidden}
        .ab-tool-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px 0;font-size:12px;font-weight:700;color:#535766;font-family:'Nunito',sans-serif;cursor:pointer;border:none;background:none;letter-spacing:.3px}
        .ab-tool-btn:not(:last-child){border-right:1px solid #f0ece2}
        .ab-tool-btn.active{color:${G}}
        .ab-badge{background:${G};color:#fff;border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center}

        .ab-sheet-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;animation:fadeIn .2s ease}
        .ab-sheet{position:fixed;bottom:0;left:0;right:0;background:#fff;border-radius:20px 20px 0 0;z-index:101;animation:slideUp .25s ease;max-height:70vh;overflow-y:auto}
        .ab-sheet-handle{width:36px;height:4px;background:#e8e2d3;border-radius:2px;margin:10px auto 4px}
        .ab-sheet-title{padding:12px 20px;font-size:11.5px;font-weight:800;color:#9a9a8f;letter-spacing:1.5px;font-family:'Nunito',sans-serif;border-bottom:1px solid #f5f1e8}
        .ab-sort-opt{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;font-size:14px;color:#282c3f;font-family:'Nunito',sans-serif;cursor:pointer;border-bottom:1px solid #faf8f2}
        .ab-sort-opt.active{color:${G};font-weight:700}
        .ab-sort-radio{width:18px;height:18px;border-radius:50%;border:2px solid #e0dac9;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .ab-sort-radio.active{border-color:${G}}
        .ab-sort-radio.active::after{content:'';width:9px;height:9px;border-radius:50%;background:${G};display:block}

        .ab-filter-wrap{display:flex;height:70vh}
        .ab-filter-sidebar{width:110px;background:#faf8f2;border-right:1px solid #f0ece2;overflow-y:auto}
        .ab-filter-section{padding:14px 14px;font-size:12px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif;cursor:pointer;border-bottom:1px solid #f0ece2}
        .ab-filter-section.active{background:#fff;border-left:3px solid ${G};color:${G}}
        .ab-filter-content{flex:1;padding:16px;overflow-y:auto}
        .ab-filter-label{font-size:11.5px;color:#9a9a8f;font-family:'Nunito',sans-serif;margin-bottom:10px;font-weight:700;letter-spacing:.5px}
        .ab-filter-checkbox{display:flex;align-items:center;gap:8px;padding:9px 0;font-size:13px;color:#282c3f;font-family:'Nunito',sans-serif;cursor:pointer;border-bottom:1px solid #faf8f2}
        .ab-check{width:17px;height:17px;border:1.5px solid #e0dac9;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px}
        .ab-check.checked{background:${G};border-color:${G};color:#fff}
        .ab-filter-footer{display:flex;gap:10px;padding:14px 20px;border-top:1px solid #f0ece2;background:#fff}
        .ab-filter-clear{flex:1;padding:12px;border:1.5px solid ${G};border-radius:10px;background:#fff;font-size:13px;font-weight:700;color:${G};cursor:pointer;font-family:'Nunito',sans-serif}
        .ab-filter-apply{flex:2;padding:12px;border:none;border-radius:10px;background:${G};font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:'Nunito',sans-serif}

        .ab-section-head{padding:4px 16px 14px}
        .ab-section-eyebrow{font-size:10.5px;font-weight:800;letter-spacing:2px;color:${G};text-transform:uppercase;font-family:'Nunito',sans-serif;margin:0 0 4px}
        .ab-section-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#1a2d1a;margin:0;display:flex;align-items:baseline;gap:8px}
        .ab-section-title .count{font-family:'Nunito',sans-serif;font-size:13px;font-weight:500;color:#9a9a8f}

        .ab-view-toggle{display:flex;gap:4px}
        .ab-view-btn{width:30px;height:30px;border:1px solid #e0dac9;border-radius:8px;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .15s}
        .ab-view-btn.active{border-color:${G};background:${G};color:#fff}

        .ab-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px}
        .ab-grid1{display:grid;grid-template-columns:1fr;gap:12px;padding:0 16px}
        .ab-pcard{background:#fff;border-radius:18px;overflow:hidden;animation:cardIn .35s ease both;position:relative;cursor:pointer;box-shadow:0 2px 14px rgba(0,0,0,.05)}
        .ab-pcard:active{opacity:.95}
        .ab-pimg-wrap{position:relative;overflow:hidden;background:linear-gradient(160deg,#f3efe4,#e9e3d4)}
        .ab-pimg{width:100%;object-fit:contain;display:block;transition:transform .5s ease;padding:14px}
        .ab-pcard:hover .ab-pimg{transform:scale(1.04)}
        .ab-pinfo{padding:12px 12px 14px}
        .ab-brand{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:${G};margin-bottom:5px;font-family:'Nunito',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .ab-pname{font-size:13px;font-weight:700;color:#282c3f;margin-bottom:6px;line-height:1.35;font-family:'Nunito',sans-serif;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .ab-origin{font-size:10.5px;color:#9a9a8f;margin-bottom:6px;font-family:'Nunito',sans-serif;display:flex;align-items:center;gap:3px}
        .ab-price-row{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;margin:8px 0 10px}
        .ab-price{font-size:15px;font-weight:800;color:#282c3f;font-family:'Nunito',sans-serif}
        .ab-orig{font-size:11.5px;color:#b7b2a2;text-decoration:line-through;font-family:'Nunito',sans-serif}
        .ab-disc{font-size:10.5px;font-weight:700;color:#e0784a;background:#fdf0e8;padding:2px 6px;border-radius:6px;font-family:'Nunito',sans-serif}
        .ab-wish-btn{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.95);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,.08);z-index:2}
        .ab-disc-badge{position:absolute;top:10px;left:10px;background:#e94e3c;color:#fff;font-size:11px;font-weight:800;padding:4px 9px;border-radius:8px;font-family:'Nunito',sans-serif;z-index:2}
        .ab-featured-badge{position:absolute;top:10px;left:10px;background:${G};color:#fff;font-size:10px;font-weight:800;padding:4px 9px;border-radius:8px;font-family:'Nunito',sans-serif;letter-spacing:.3px;z-index:2}
        .ab-add-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 0;border:1.5px solid ${G};border-radius:12px;background:#fff;color:${G};font-size:11.5px;font-weight:800;font-family:'Nunito',sans-serif;cursor:pointer;letter-spacing:.4px;transition:all .2s}
        .ab-add-btn:hover{background:${G};color:#fff}
        .ab-add-btn.done{background:${G};color:#fff}

        .ab-skel{background:linear-gradient(90deg,#f3efe4 25%,#ece6d8 50%,#f3efe4 75%);background-size:200% 100%;animation:shimmer 1.3s infinite;border-radius:8px}

        .ab-empty{padding:60px 20px;text-align:center;background:#fff;border-radius:18px;margin:0 16px}
      `}</style>

      <div className="ab-header">
        <button className="ab-icon-btn" aria-label="Menu">☰</button>
        <div className="ab-logo">🍃 Apun<span className="accent">Bazar</span></div>
        <div className="ab-header-icons">
          <button className="ab-icon-btn" onClick={() => navigate("/wishlist")} aria-label="Wishlist">
            🤍
          </button>
          <button className="ab-icon-btn" onClick={() => navigate("/cart")} aria-label="Cart">
            🛒
            {cartCount > 0 && <span className="ab-cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div className="ab-search-bar">
        <div className={`ab-search-wrap${searchFocused ? " focused" : ""}`}>
          <span style={{ fontSize: 15, color: "#a3a399" }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search for products, brands and more"
          />
          {search && (
            <span onClick={() => setSearch("")} style={{ fontSize: 15, color: "#a3a399", cursor: "pointer" }}>✕</span>
          )}
        </div>
      </div>

      <div className="ab-banner-wrap">
        <div className="ab-banner">
          <div style={{ position: "absolute", inset: 0, background: banner.bg }} />
          {banner.image && (
            <img src={banner.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
          )}
          <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)", animation: "scanGold 4s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: 8, padding: "0 26px" }}>
            <div key={bannerIdx} style={{ opacity: bannerVis ? 1 : 0, transition: "opacity .25s" }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,.75)", marginBottom: 6, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>{banner.label}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 27, fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 7 }}>{banner.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", fontFamily: "'Nunito',sans-serif", maxWidth: 220, marginBottom: 14 }}>{banner.desc}</div>
              <a href={banner.btnLink} style={{ background: "#fff", borderRadius: 10, padding: "10px 22px", color: "#1a2d1a", fontSize: 12, fontWeight: 800, cursor: "pointer", textDecoration: "none", fontFamily: "'Nunito',sans-serif", display: "inline-block" }}>
                {banner.btnText}
              </a>
            </div>
          </div>
          <div className="ab-banner-dots">
            {BANNERS.map((_, i) => (
              <div key={i} onClick={() => setBannerIdx(i)}
                className="ab-banner-dot"
                style={{ width: i === bannerIdx ? 18 : 4, background: i === bannerIdx ? "#fff" : "rgba(255,255,255,.45)" }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="ab-cat-card">
        <div className="ab-cat-bar">
          <button className={`ab-cat-tab${activeMain === "all" ? " active" : ""}`} onClick={selectAll}>
            <div className="cat-circle-all">🏪</div>
            <span className="label">All</span>
          </button>
          {mainCats.map(cat => (
            <button key={cat.id} className={`ab-cat-tab${activeMain === cat.slug ? " active" : ""}`} onClick={() => selectMain(cat)}>
              <img src={cat.imageUrl || FALLBACK_CAT_IMG} alt={cat.name} className="cat-circle"
                onError={e => { (e.target as HTMLImageElement).src = FALLBACK_CAT_IMG; }} />
              <span className="label">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {expandedMain !== null && (() => {
        const subs = subCats.filter(s => s.mainCategoryId === expandedMain);
        if (!subs.length) return null;
        return (
          <div className="ab-sub-bar">
            {subs.map(sub => (
              <button key={sub.id} className={`ab-sub-chip${activeSub === sub.id ? " active" : ""}`} onClick={() => selectSub(sub)}>
                {sub.name}
              </button>
            ))}
          </div>
        );
      })()}

      {activeSub !== null && (() => {
        const children = childCats.filter(c => c.subCategoryId === activeSub);
        if (!children.length) return null;
        return (
          <div className="ab-sub-bar" style={{ paddingTop: 0 }}>
            {children.map(child => (
              <button key={child.id} className={`ab-child-chip${activeChild === child.id ? " active" : ""}`} onClick={() => selectChild(child)}>
                {child.name}
              </button>
            ))}
          </div>
        );
      })()}

      {activeMain !== "all" && (
        <div className="ab-breadcrumb">
          <span onClick={selectAll}>Home</span>
          <span className="sep">›</span>
          <span onClick={selectAll}>Products</span>
          <span className="sep">›</span>
          <span className={!activeSubObj && !activeChildObj ? "active" : ""} onClick={() => { setActiveSub(null); setActiveChild(null); }}>{activeMainObj?.name}</span>
          {activeSubObj && <><span className="sep">›</span><span className={!activeChildObj ? "active" : ""} onClick={() => setActiveChild(null)}>{activeSubObj.name}</span></>}
          {activeChildObj && <><span className="sep">›</span><span className="active">{activeChildObj.name}</span></>}
        </div>
      )}

      <div className="ab-toolbar">
        <button className={`ab-tool-btn${showSort ? " active" : ""}`} onClick={() => { setShowSort(true); setShowFilter(false); }}>
          <span>⇅</span> SORT
        </button>
        <button className={`ab-tool-btn${showFilter ? " active" : ""}`} onClick={() => { setShowFilter(true); setShowSort(false); }}>
          <span>⊟</span> FILTER {activeFiltersCount > 0 && <span className="ab-badge">{activeFiltersCount}</span>}
        </button>
      </div>

      <div className="ab-section-head" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p className="ab-section-eyebrow">{sectionLabel}</p>
          <h2 className="ab-section-title">
            {sectionLabel}
            <span className="count">({displayedProducts.length} items)</span>
          </h2>
        </div>
        <div className="ab-view-toggle">
          <button className={`ab-view-btn${viewMode === "grid2" ? " active" : ""}`} onClick={() => setViewMode("grid2")}>⊞</button>
          <button className={`ab-view-btn${viewMode === "grid1" ? " active" : ""}`} onClick={() => setViewMode("grid1")}>☰</button>
        </div>
      </div>

      <div className={viewMode === "grid2" ? "ab-grid2" : "ab-grid1"} style={{ paddingBottom: 80 }}>

        {loading && [...Array(6)].map((_, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, overflow: "hidden" }}>
            <div className="ab-skel" style={{ height: viewMode === "grid2" ? 180 : 160, borderRadius: 0 }} />
            <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 7 }}>
              <div className="ab-skel" style={{ height: 11, width: "60%" }} />
              <div className="ab-skel" style={{ height: 10, width: "80%" }} />
              <div className="ab-skel" style={{ height: 10, width: "40%" }} />
            </div>
          </div>
        ))}

        {!loading && displayedProducts.map((p, i) => {
          const price  = toNum(p.price);
          const orig   = toNum(p.originalPrice ?? p.price);
          const rating = toNum(p.rating) || 4.2;
          const img    = p.imageUrl ?? p.image_url ?? FALLBACK_IMG;
          const disc   = discountPct(price, orig);
          const inCart = cartPops.has(p.id);
          const imgH   = viewMode === "grid2" ? 170 : 150;

          return (
            <div key={p.id} className="ab-pcard" style={{ animationDelay: `${i * .04}s` }}>
              <div className="ab-pimg-wrap" style={{ height: imgH }} onClick={() => navigate(`/products/${p.id}`)}>
                <img src={img} alt={p.name} className="ab-pimg" style={{ height: imgH }} loading="lazy"
                  onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />

                {p.featured && <div className="ab-featured-badge">FEATURED</div>}
                {disc >= 5 && !p.featured && <div className="ab-disc-badge">-{disc}%</div>}

                <button className="ab-wish-btn"
                  onClick={e => { e.stopPropagation(); toggleWish(p.id); }}>
                  {wishlist.has(p.id) ? "❤️" : "🤍"}
                </button>
              </div>

              <div className="ab-pinfo">
                <div className="ab-brand" onClick={() => navigate(`/products/${p.id}`)}>
                  ✦ {p.artisan ?? "ApunBazar"}
                </div>
                <div className="ab-pname" onClick={() => navigate(`/products/${p.id}`)}>
                  {p.name}
                </div>
                {p.origin && <div className="ab-origin">📍 {p.origin}</div>}
                <Stars r={rating} />
                <div className="ab-price-row">
                  <span className="ab-price">₹{price.toLocaleString()}</span>
                  {disc > 0 && <span className="ab-orig">₹{orig.toLocaleString()}</span>}
                  {disc > 0 && <span className="ab-disc">{disc}% OFF</span>}
                </div>
                <button className={`ab-add-btn${inCart ? " done" : ""}`} onClick={() => addToCart(p.id)}>
                  🛒 {inCart ? "ADDED TO CART" : "ADD TO CART"}
                </button>
              </div>
            </div>
          );
        })}

        {!loading && displayedProducts.length === 0 && (
          <div className="ab-empty" style={{ gridColumn: "1/-1" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#282c3f", fontFamily: "'Nunito',sans-serif", marginBottom: 6 }}>
              We couldn't find a match
            </div>
            <div style={{ fontSize: 13, color: "#9a9a8f", fontFamily: "'Nunito',sans-serif", marginBottom: 16 }}>
              Try different filters or search terms
            </div>
            <button onClick={selectAll} style={{ padding: "10px 24px", border: `1.5px solid ${G}`, borderRadius: 10, background: "#fff", fontSize: 13, fontWeight: 700, color: G, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
              CLEAR FILTERS
            </button>
          </div>
        )}
      </div>

      {showSort && (
        <>
          <div className="ab-sheet-overlay" onClick={() => setShowSort(false)} />
          <div className="ab-sheet">
            <div className="ab-sheet-handle" />
            <div className="ab-sheet-title">SORT BY</div>
            {SORT_OPTIONS.map(opt => (
              <div key={opt.value} className={`ab-sort-opt${sortBy === opt.value ? " active" : ""}`}
                onClick={() => { setSortBy(opt.value); setShowSort(false); }}>
                {opt.label}
                <div className={`ab-sort-radio${sortBy === opt.value ? " active" : ""}`} />
              </div>
            ))}
          </div>
        </>
      )}

      {showFilter && (
        <>
          <div className="ab-sheet-overlay" onClick={() => setShowFilter(false)} />
          <div className="ab-sheet" style={{ display: "flex", flexDirection: "column" }}>
            <div className="ab-sheet-handle" />
            <div className="ab-sheet-title">FILTERS</div>
            <div className="ab-filter-wrap">
              <div className="ab-filter-sidebar">
                <div className="ab-filter-section active">Price</div>
                <div className="ab-filter-section">Discount</div>
              </div>
              <div className="ab-filter-content">
                <div className="ab-filter-label">PRICE RANGE</div>
                {[
                  [0, 500, "Under ₹500"],
                  [500, 1000, "₹500 – ₹1,000"],
                  [1000, 2500, "₹1,000 – ₹2,500"],
                  [2500, 5000, "₹2,500 – ₹5,000"],
                  [5000, 10000, "Above ₹5,000"],
                ].map(([min, max, label]) => (
                  <div key={String(label)} className="ab-filter-checkbox"
                    onClick={() => setPriceRange([min as number, max as number])}>
                    <div className={`ab-check${priceRange[0] === min && priceRange[1] === max ? " checked" : ""}`}>
                      {priceRange[0] === min && priceRange[1] === max ? "✓" : ""}
                    </div>
                    {label}
                  </div>
                ))}
                <div style={{ marginTop: 16 }} className="ab-filter-label">DISCOUNT</div>
                <div className="ab-filter-checkbox" onClick={() => setOnlyDiscount(v => !v)}>
                  <div className={`ab-check${onlyDiscount ? " checked" : ""}`}>{onlyDiscount ? "✓" : ""}</div>
                  On Sale Only
                </div>
              </div>
            </div>
            <div className="ab-filter-footer">
              <button className="ab-filter-clear" onClick={() => { setPriceRange([0, 10000]); setOnlyDiscount(false); }}>
                CLEAR ALL
              </button>
              <button className="ab-filter-apply" onClick={() => setShowFilter(false)}>
                APPLY
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
