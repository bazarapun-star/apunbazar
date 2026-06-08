import { useState, useEffect } from "react";
import { useLocation } from "wouter";
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet"></link>

interface MainCategory { id: number; name: string; slug: string; imageUrl?: string; }
interface SubCategory  { id: number; name: string; slug: string; mainCategoryId: number; }
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
  { id: "1", label: "CELEBRATING ASSAM'S", title: "Timeless Crafts", desc: "Handpicked from 500+ master artisans", bg: "linear-gradient(135deg,#1a4a2e,#2d7a50,#1a4a2e)", btnText: "EXPLORE NOW →", btnLink: "/products" },
  { id: "2", label: "PURE ASSAM TEA", title: "Garden Fresh", desc: "Award-winning orthodox varieties", bg: "linear-gradient(135deg,#2d4a1a,#4a7a2d,#2d4a1a)", btnText: "SHOP TEA →", btnLink: "/products?category=assam-tea" },
  { id: "3", label: "HERITAGE HANDLOOM", title: "Muga & Pat Silk", desc: "GI tagged authentic Assamese weaves", bg: "linear-gradient(135deg,#3a2d1a,#7a5a2d,#3a2d1a)", btnText: "VIEW HANDLOOM →", btnLink: "/products?category=handloom" },
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
function Stars({ r }: { r: number }) {
  return <div style={{ display: "flex", gap: 1 }}>
    {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 11, color: i <= Math.floor(r) ? "#c9a84c" : "#d4c9a8" }}>★</span>)}
  </div>;
}

export default function Products() {
  const [, navigate] = useLocation();
  const BANNERS = useProductBanners();

  const [mainCats, setMainCats]   = useState<MainCategory[]>([]);
  const [subCats, setSubCats]     = useState<SubCategory[]>([]);
  const [childCats, setChildCats] = useState<ChildCategory[]>([]);
  const [activeMain, setActiveMain]   = useState<string>("all");
  const [activeSub, setActiveSub]     = useState<number | null>(null);
  const [activeChild, setActiveChild] = useState<number | null>(null);
  const [expandedMain, setExpandedMain] = useState<number | null>(null);
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [wishlist, setWishlist]   = useState<Set<number>>(new Set());
  const [cartPops, setCartPops]   = useState<Set<number>>(new Set());
  const [bannerIdx, setBannerIdx] = useState(0);
  const [bannerVis, setBannerVis] = useState(true);

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
    if (activeSub === sub.id) { setActiveSub(null); setActiveChild(null); }
    else { setActiveSub(sub.id); setActiveChild(null); }
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Nunito:wght@300;400;500;600&display=swap');
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes cardIn{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes cartBounce{0%{transform:scale(1)}30%{transform:scale(.9)}70%{transform:scale(1.06)}100%{transform:scale(1)}}
        @keyframes scanGold{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes slideDown{0%{opacity:0;transform:translateY(-8px)}100%{opacity:1;transform:translateY(0)}}
        .ap-cat-pill{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 14px;border-radius:14px;flex-shrink:0;min-width:66px;background:#fff;border:1.5px solid #e8e0cc;cursor:pointer;transition:all .22s;box-shadow:0 2px 8px rgba(0,0,0,.06)}
        .ap-cat-pill:hover{transform:translateY(-3px);box-shadow:0 6px 20px rgba(26,90,50,.15)}
        .ap-cat-pill.active{background:linear-gradient(135deg,#1a5a32,#2d7a50);border-color:#1a5a32;box-shadow:0 4px 20px rgba(26,90,50,.25)}
        .ap-cat-pill.active .ap-cat-icon{animation:floatY 3s ease infinite}
        .ap-sub-pill{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;flex-shrink:0;background:#fff;border:1.5px solid #e8e0cc;cursor:pointer;font-family:'Nunito',sans-serif;font-size:11px;font-weight:600;color:#2d4a2d;transition:all .2s;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.05)}
        .ap-sub-pill:hover{border-color:#1a5a32;color:#1a5a32;transform:translateY(-2px)}
        .ap-sub-pill.active{background:#1a5a32;border-color:#1a5a32;color:#fff;box-shadow:0 3px 12px rgba(26,90,50,.3)}
        .ap-child-pill{display:flex;align-items:center;gap:5px;padding:4px 12px;border-radius:16px;flex-shrink:0;background:#f8f5ee;border:1px solid #e0d8c0;cursor:pointer;font-family:'Nunito',sans-serif;font-size:10px;font-weight:600;color:#5a4a2d;transition:all .2s;white-space:nowrap}
        .ap-child-pill:hover{border-color:#c9a84c;color:#a87c2a}
        .ap-child-pill.active{background:#c9a84c;border-color:#c9a84c;color:#fff}
        .ap-sub-row{display:flex;gap:8px;padding:6px 16px 2px;overflow-x:auto;scrollbar-width:none;animation:slideDown .25s ease}
        .ap-sub-row::-webkit-scrollbar{display:none}
        .ap-child-row{display:flex;gap:6px;padding:4px 16px 2px;overflow-x:auto;scrollbar-width:none;animation:slideDown .2s ease}
        .ap-child-row::-webkit-scrollbar{display:none}
        .ap-pcard{background:#fff;border:1px solid #e8e2d0;border-radius:16px;overflow:hidden;animation:cardIn .45s ease both;transition:transform .28s,box-shadow .28s;box-shadow:0 2px 12px rgba(0,0,0,.07)}
        .ap-pcard:hover{transform:translateY(-5px);box-shadow:0 12px 32px rgba(26,90,50,.18)}
        .ap-pcard:hover .ap-pimg{transform:scale(1.08)}
        .ap-pimg{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
        .ap-add-btn{width:100%;border:1.5px solid #1a5a32;border-radius:10px;padding:8px 0;cursor:pointer;font-family:'Nunito',sans-serif;font-size:11px;letter-spacing:1px;font-weight:600;background:#fff;color:#1a5a32;transition:all .22s}
        .ap-add-btn:hover{background:#1a5a32;color:#fff;box-shadow:0 4px 16px rgba(26,90,50,.3)}
        .ap-add-btn.done{background:#1a5a32!important;color:#fff!important;animation:cartBounce .45s ease;border-color:#1a5a32}
        .ap-cat-scroll{display:flex;gap:10px;padding:10px 16px 4px;overflow-x:auto;scrollbar-width:none}
        .ap-cat-scroll::-webkit-scrollbar{display:none}
        .ap-search{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid #e8e0cc;border-radius:14px;padding:4px 14px;box-shadow:0 2px 10px rgba(0,0,0,.07);transition:border-color .25s,box-shadow .25s}
        .ap-search.focused{border-color:#1a5a32;box-shadow:0 0 0 3px rgba(26,90,50,.1),0 4px 20px rgba(0,0,0,.1)}
        .ap-search input{flex:1;background:transparent;border:none;outline:none;font-family:'Nunito',sans-serif;font-size:14px;color:#2d3a2d;padding:10px 0}
        .ap-search input::placeholder{color:#aaa}
        .ap-skeleton{background:linear-gradient(90deg,#f0ede4 25%,#e8e4d8 50%,#f0ede4 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:8px}
        .ap-badge{position:absolute;top:8px;left:8px;border-radius:100px;padding:3px 10px;font-family:'Nunito',sans-serif;font-size:9px;letter-spacing:.8px;font-weight:700}
        .ap-wish{position:absolute;top:8px;right:8px;background:rgba(255,255,255,.9);border:1px solid #e8e0cc;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;transition:all .2s;backdrop-filter:blur(4px)}
        .ap-wish:hover{border-color:#c9a84c;background:#fff}
        .ap-wish.wishlisted{border-color:#e05c2a;background:#fff5f0}
        .ap-gamusa-border{height:3px;background:repeating-linear-gradient(90deg,#1a5a32 0,#1a5a32 8px,transparent 8px,transparent 14px,#c9a84c 14px,#c9a84c 16px,transparent 16px,transparent 22px);opacity:.5}
        .ap-breadcrumb{display:flex;align-items:center;gap:6px;padding:6px 16px 0;flex-wrap:wrap}
        .ap-breadcrumb span{font-size:11px;color:#999;font-family:'Nunito',sans-serif}
        .ap-breadcrumb strong{font-size:11px;color:#1a5a32;font-family:'Nunito',sans-serif;font-weight:700}
        .ap-breadcrumb .sep{color:#ccc}
      `}</style>

      <div style={{ background: "#f8f5ee", minHeight: "100vh", fontFamily: "'Nunito',sans-serif" }}>

        {/* ── HERO BANNER ── */}
        <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: banner.bg }} />
          {banner.image && (
  <img src={banner.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
)}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .08, pointerEvents: "none" }}>
            <defs><pattern id="gm2" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M0,12 Q6,6 12,12 Q18,18 24,12" stroke="#f0d080" strokeWidth="1" fill="none" />
              <circle cx="12" cy="12" r="1.5" fill="#f0d080" />
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#gm2)" />
          </svg>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: "40%", background: "linear-gradient(90deg,transparent,rgba(201,168,76,.07),transparent)", animation: "scanGold 4s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "0 24px", textAlign: "center" }}>
            <div style={{ background: "rgba(201,168,76,.2)", border: "1px solid rgba(201,168,76,.5)", borderRadius: 100, padding: "4px 16px", fontSize: 10, letterSpacing: 3, color: "#f0d080", fontWeight: 600 }}>✦ APUNBAZAR PREMIUM ✦</div>
            <div key={bannerIdx} style={{ opacity: bannerVis ? 1 : 0, transition: "opacity .25s", textAlign: "center" }}>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "rgba(240,220,140,.8)", marginBottom: 6, fontWeight: 600 }}>{banner.label}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>{banner.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)" }}>{banner.desc}</div>
            </div>
            <a href={banner.btnLink} style={{ marginTop: 6, background: "linear-gradient(135deg,#c9a84c,#a8883c)", border: "none", borderRadius: 100, padding: "10px 28px", color: "#fff", fontSize: 12, letterSpacing: 1.5, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
              {banner.btnText}
            </a>
          </div>
          <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
            {BANNERS.map((_, i) => (
              <div key={i} onClick={() => setBannerIdx(i)} style={{ height: 5, borderRadius: 100, cursor: "pointer", transition: "all .3s", width: i === bannerIdx ? 20 : 5, background: i === bannerIdx ? "#c9a84c" : "rgba(255,255,255,.45)" }} />
            ))}
          </div>
        </div>

        <div className="ap-gamusa-border" />

        {/* ── SEARCH ── */}
        <div style={{ padding: "0 16px", marginTop: -24, position: "relative", zIndex: 10 }}>
          <div className={`ap-search${searchFocused ? " focused" : ""}`}>
            <span style={{ fontSize: 17, color: searchFocused ? "#1a5a32" : "#aaa" }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              placeholder="Search Assamese treasures..." />
            {search && <button onClick={() => setSearch("")} style={{ background: "#f0ede4", border: "1px solid #e0dac8", borderRadius: 100, padding: "2px 10px", color: "#666", cursor: "pointer", fontSize: 11 }}>✕</button>}
          </div>
        </div>

        {/* ── MAIN CATEGORIES ── */}
        <div style={{ padding: "18px 0 4px" }}>
          <div style={{ padding: "0 16px 8px", fontSize: 10, letterSpacing: 3, color: "#1a5a32", fontWeight: 700, opacity: .8 }}>BROWSE BY CATEGORY</div>
          <div className="ap-cat-scroll">
            <button className={`ap-cat-pill${activeMain === "all" ? " active" : ""}`} onClick={selectAll}>
              <span className="ap-cat-icon" style={{ fontSize: 20 }}>🏪</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: activeMain === "all" ? "#fff" : "#2d4a2d", whiteSpace: "nowrap" }}>All</span>
            </button>
            {mainCats.map(cat => {
              const isActive = activeMain === cat.slug;
              const isExpanded = expandedMain === cat.id;
              const subCount = subCats.filter(s => s.mainCategoryId === cat.id).length;
              return (
                <button key={cat.id} className={`ap-cat-pill${isActive ? " active" : ""}`} onClick={() => selectMain(cat)}>
                  {cat.imageUrl ? (
                    <div className="ap-cat-icon" style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                      <img src={cat.imageUrl} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <span className="ap-cat-icon" style={{ fontSize: 20 }}>{CAT_ICONS[cat.slug] ?? "🏷️"}</span>
                  )}
                  <span style={{ fontSize: 10, fontWeight: 600, color: isActive ? "#fff" : "#2d4a2d", whiteSpace: "nowrap" }}>{cat.name}</span>
                  {subCount > 0 && <span style={{ fontSize: 8, color: isActive ? "rgba(255,255,255,.7)" : "#aaa", marginTop: -2 }}>{isExpanded ? "▲" : "▼"} {subCount}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {expandedMain !== null && (() => {
          const subs = subCats.filter(s => s.mainCategoryId === expandedMain);
          if (!subs.length) return null;
          return (
            <div style={{ paddingBottom: 4 }}>
              <div style={{ padding: "0 16px 4px", fontSize: 9, letterSpacing: 2, color: "#c9a84c", fontWeight: 700, opacity: .9 }}>SUB CATEGORIES</div>
              <div className="ap-sub-row">
                {subs.map(sub => {
                  const childCount = childCats.filter(c => c.subCategoryId === sub.id).length;
                  return (
                    <button key={sub.id} className={`ap-sub-pill${activeSub === sub.id ? " active" : ""}`} onClick={() => selectSub(sub)}>
                      {sub.imageUrl ? <img src={sub.imageUrl} alt={sub.name} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} /> : <span style={{ fontSize: 18 }}>🍃</span>}
                      {sub.name}
                      {childCount > 0 && <span style={{ fontSize: 9, opacity: .7 }}>{activeSub === sub.id ? "▲" : "▼"}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {activeSub !== null && (() => {
          const children = childCats.filter(c => c.subCategoryId === activeSub);
          if (!children.length) return null;
          return (
            <div style={{ paddingBottom: 4 }}>
              <div style={{ padding: "0 16px 4px", fontSize: 9, letterSpacing: 2, color: "#888", fontWeight: 700 }}>TYPE</div>
              <div className="ap-child-row">
                {children.map(child => (
                  <button key={child.id} className={`ap-child-pill${activeChild === child.id ? " active" : ""}`} onClick={() => selectChild(child)}>• {child.name}</button>
                ))}
              </div>
            </div>
          );
        })()}

        {activeMain !== "all" && (
          <div className="ap-breadcrumb">
            <span style={{ cursor: "pointer" }} onClick={selectAll}>All</span>
            <span className="sep">›</span><span>{activeMainObj?.name}</span>
            {activeSubObj && <><span className="sep">›</span><span>{activeSubObj.name}</span></>}
            {activeChildObj && <><span className="sep">›</span><strong>{activeChildObj.name}</strong></>}
          </div>
        )}

        <div style={{ padding: "10px 16px 8px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#c9a84c", fontWeight: 700, marginBottom: 3 }}>ARTISAN COLLECTION</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: "#1a2d1a" }}>
              {sectionLabel}
              <span style={{ fontSize: 13, color: "#999", marginLeft: 8, fontWeight: 400, fontFamily: "'Nunito',sans-serif" }}>({products.length})</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "4px 16px 100px" }}>
          {loading && [...Array(6)].map((_, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: "hidden", background: "#fff", border: "1px solid #e8e2d0" }}>
              <div className="ap-skeleton" style={{ height: 155 }} />
              <div style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
                <div className="ap-skeleton" style={{ height: 11, width: "75%" }} />
                <div className="ap-skeleton" style={{ height: 10, width: "45%" }} />
                <div className="ap-skeleton" style={{ height: 26 }} />
              </div>
            </div>
          ))}

          {!loading && products.map((p, i) => {
            const price  = toNum(p.price);
            const orig   = toNum(p.originalPrice ?? p.price);
            const rating = toNum(p.rating) || 4.5;
            const img    = p.imageUrl ?? p.image_url ?? FALLBACK_IMG;
            const disc   = discountPct(price, orig);
            const inCart = cartPops.has(p.id);
            return (
              <div key={p.id} className="ap-pcard" style={{ animationDelay: `${i * .05}s` }}>
                <div style={{ position: "relative", height: 155, overflow: "hidden" }} onClick={() => navigate(`/products/${p.id}`)}>
                  <img src={img} alt={p.name} className="ap-pimg" loading="lazy" onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(0,0,0,.35) 0%,transparent 55%)" }} />
                  {p.featured && <div className="ap-badge" style={{ background: "#1a5a32", color: "#fff" }}>Featured</div>}
                  {disc >= 10 && !p.featured && <div className="ap-badge" style={{ background: "#e05c2a", color: "#fff" }}>-{disc}%</div>}
                  <button className={`ap-wish${wishlist.has(p.id) ? " wishlisted" : ""}`} onClick={e => { e.stopPropagation(); toggleWish(p.id); }}>
                    {wishlist.has(p.id) ? "❤️" : "🤍"}
                  </button>
                  {p.artisan && <div style={{ position: "absolute", bottom: 7, left: 8, fontSize: 9, color: "rgba(255,255,255,.8)", fontWeight: 500 }}>✦ {p.artisan}</div>}
                </div>
                <div style={{ padding: "10px 11px 11px" }}>
                  <div onClick={() => navigate(`/products/${p.id}`)} style={{ fontFamily: "'Playfair Display',serif", fontSize: 12.5, fontWeight: 500, color: "#1a2d1a", lineHeight: 1.35, marginBottom: 5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", cursor: "pointer" }}>
                    {p.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <Stars r={rating} />
                    <span style={{ fontSize: 10, color: "#999" }}>{rating.toFixed(1)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 9 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: "#1a5a32" }}>₹{price.toLocaleString()}</span>
                    {disc > 0 && <span style={{ fontSize: 11, color: "#bbb", textDecoration: "line-through" }}>₹{orig.toLocaleString()}</span>}
                  </div>
                  <button className={`ap-add-btn${inCart ? " done" : ""}`} onClick={() => addToCart(p.id)}>
                    {inCart ? "✓ Added!" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}

          {!loading && products.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#999", fontFamily: "'Playfair Display',serif" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🌿</div>
              <div style={{ fontSize: 18, color: "#555" }}>No treasures found</div>
              <div style={{ fontSize: 13, marginTop: 6, fontFamily: "'Nunito',sans-serif", color: "#aaa" }}>Try a different search or category</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}