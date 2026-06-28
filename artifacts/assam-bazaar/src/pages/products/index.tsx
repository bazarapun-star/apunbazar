import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface Category { id: number; name: string; slug: string; description?: string; imageUrl?: string; productCount?: number; }
interface SubType { name: string; slug: string; }

const G = "#1a5a32";
const GOLD = "#c9a84c";

const HERO = {
  tag: "Our Collections",
  title: "Authentic Products.\nProudly Assamese.",
  sub: "Curated with care. Delivered with pride.",
  image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=900&q=80",
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Assam Tea", slug: "tea", productCount: 120, imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&q=75" },
  { id: 2, name: "Handloom & Gamusa", slug: "handloom", productCount: 85, imageUrl: "https://images.unsplash.com/photo-1611042553365-9b101441c135?w=300&q=75" },
  { id: 3, name: "Handicrafts", slug: "handicrafts", productCount: 60, imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&q=75" },
  { id: 4, name: "Traditional Foods", slug: "organic", productCount: 75, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=75" },
  { id: 5, name: "Lifestyle & Gifts", slug: "gifts", productCount: 50, imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&q=75" },
];

const SUB_TYPES: SubType[] = [
  { name: "Orthodox", slug: "orthodox" },
  { name: "CTC", slug: "ctc" },
  { name: "Tippy Golden", slug: "tgfop" },
  { name: "Green Tea", slug: "green" },
];

const TRUST_BADGES = [
  { icon: "leaf", title: "100% Pure Assam Tea", sub: "Sourced from best gardens" },
  { icon: "shield", title: "Authentic & Natural", sub: "No artificial flavours" },
  { icon: "truck", title: "Free Delivery", sub: "On orders above ₹499" },
  { icon: "headset", title: "Expert Support", sub: "We're here to help" },
];

const FEATURE_BANNER = {
  title: "From the Gardens of Assam",
  desc: "Bringing you the finest brew, straight from our tea gardens to your home.",
  btnText: "Shop Now",
  image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=900&q=80",
};

function BadgeIcon({ type }: { type: string }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: G, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "leaf") return <svg {...common}><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 9.5 17 13a8 8 0 01-6 7z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 11 11 11 11"/></svg>;
  if (type === "shield") return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>;
  if (type === "truck") return <svg {...common}><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
  return <svg {...common}><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>;
}

export default function Products() {
  const [, navigate] = useLocation();
  const slug = (() => {
    if (typeof window === "undefined") return "tea";
    const p = new URLSearchParams(window.location.search);
    return p.get("category") ?? "tea";
  })();

  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeType, setActiveType] = useState<string>(SUB_TYPES[0]?.slug ?? "");
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetch("/api/categories/main").then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length) setCategories(d); })
      .catch(() => {});
  }, []);

  function goToCategory(catSlug: string) {
    navigate(`/products?category=${encodeURIComponent(catSlug)}`);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Nunito:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        body{margin:0;background:#faf7f0}

        .cg-wrap{font-family:'Nunito',sans-serif;background:#faf7f0;min-height:100vh;padding:16px;max-width:680px;margin:0 auto}

        /* HERO */
        .cg-hero{position:relative;height:170px;border-radius:18px;overflow:hidden;margin-bottom:22px}
        .cg-hero-tag{font-size:11px;font-weight:700;color:${G};letter-spacing:.5px;margin:0 0 6px;font-family:'Nunito',sans-serif}
        .cg-hero-title{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#1a2d1a;line-height:1.25;margin:0 0 8px;white-space:pre-line}
        .cg-hero-sub{font-size:12.5px;color:#6b6b60;margin:0 0 10px}
        .cg-hero-rule{width:36px;height:2px;background:${G};border-radius:2px}

        /* SECTION HEAD */
        .cg-sec-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
        .cg-sec-title{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:800;color:#1a2d1a;margin:0}
        .cg-sec-sub{font-size:11.5px;color:#9a9a8f;margin:2px 0 14px 0}
        .cg-view-all{display:flex;align-items:center;gap:5px;border:1px solid #e0dac9;border-radius:100px;padding:6px 14px;font-size:11.5px;font-weight:700;color:#444;background:#fff;cursor:pointer;font-family:'Nunito',sans-serif;white-space:nowrap}

        /* CATEGORY CARDS */
        .cg-cat-row{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:28px}
        .cg-cat-card{background:#fff;border-radius:14px;border:1.5px solid transparent;padding:10px 6px 12px;text-align:center;cursor:pointer;transition:all .2s;position:relative;display:flex;flex-direction:column;align-items:center}
        .cg-cat-card.active{border-color:${G};box-shadow:0 4px 16px rgba(26,90,50,.12)}
        .cg-cat-card:hover{transform:translateY(-2px)}
        .cg-cat-img-wrap{width:100%;aspect-ratio:1;border-radius:10px;overflow:hidden;margin-bottom:10px;position:relative}
        .cg-cat-img{width:100%;height:100%;object-fit:cover}
        .cg-cat-icon{position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);width:28px;height:28px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.12)}
        .cg-cat-name{font-size:11px;font-weight:700;color:#282c3f;margin:6px 0 3px;line-height:1.3}
        .cg-cat-count{font-size:9.5px;color:${G};font-weight:700}
        .cg-cat-underline{width:18px;height:2px;background:${G};border-radius:2px;margin-top:6px}

        /* TYPE PILLS */
        .cg-pill-row{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin-bottom:24px}
        .cg-pill-row::-webkit-scrollbar{display:none}
        .cg-pill{display:flex;align-items:center;gap:6px;padding:9px 16px;border-radius:100px;border:1.5px solid #e0dac9;background:#fff;font-size:12px;font-weight:700;color:#444;cursor:pointer;white-space:nowrap;flex-shrink:0;font-family:'Nunito',sans-serif;transition:all .15s}
        .cg-pill.active{background:${G};border-color:${G};color:#fff}
        .cg-pill-more{display:flex;align-items:center;gap:4px;padding:9px 16px;border-radius:100px;border:1.5px solid #e0dac9;background:#fff;font-size:12px;font-weight:700;color:#444;cursor:pointer;flex-shrink:0;font-family:'Nunito',sans-serif}

        /* TRUST BADGES */
        .cg-trust{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;background:#fff;border:1px solid #f0ece2;border-radius:16px;padding:16px 10px;margin-bottom:24px}
        .cg-trust-item{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px}
        .cg-trust-icon{width:38px;height:38px;border-radius:50%;background:#eef3ea;display:flex;align-items:center;justify-content:center}
        .cg-trust-title{font-size:10px;font-weight:800;color:#282c3f;line-height:1.3;margin:0}
        .cg-trust-sub{font-size:8.5px;color:#9a9a8f;line-height:1.3;margin:0}

        /* FEATURE BANNER */
        .cg-feature{position:relative;border-radius:18px;overflow:hidden;min-height:180px;display:flex;align-items:center}
        .cg-feature-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .cg-feature-overlay{position:absolute;inset:0;background:linear-gradient(90deg, rgba(250,247,240,0.97) 38%, rgba(250,247,240,0.55) 65%, transparent 100%)}
        .cg-feature-content{position:relative;padding:22px 20px;max-width:64%}
        .cg-feature-title{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;color:#1a2d1a;margin:0 0 8px;line-height:1.25}
        .cg-feature-desc{font-size:12px;color:#6b6b60;margin:0 0 16px;line-height:1.55}
        .cg-feature-btn{display:inline-flex;align-items:center;gap:6px;background:${G};color:#fff;border:none;border-radius:100px;padding:10px 20px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif}

        @media (max-width: 420px) {
          .cg-cat-row{grid-template-columns:repeat(5,1fr);gap:6px}
          .cg-cat-name{font-size:9.5px}
          .cg-trust{grid-template-columns:repeat(4,1fr)}
        }
      `}</style>

      <div className="cg-wrap">

        {/* HERO */}
        <div className="cg-hero">
          <img className="cg-feature-bg" src={HERO.image} alt="" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(250,247,240,0.96) 42%, rgba(250,247,240,0.5) 70%, transparent 100%)" }} />
          <div style={{ position: "relative", padding: "20px 20px", maxWidth: "62%" }}>
            <p className="cg-hero-tag">{HERO.tag}</p>
            <h1 className="cg-hero-title">{HERO.title}</h1>
            <p className="cg-hero-sub">{HERO.sub}</p>
            <div className="cg-hero-rule" />
          </div>
        </div>

        {/* BROWSE CATEGORIES */}
        <div className="cg-sec-head">
          <h2 className="cg-sec-title">🍃 BROWSE CATEGORIES</h2>
          <button className="cg-view-all" onClick={() => navigate("/products")}>
            ⊞ View all <span>›</span>
          </button>
        </div>
        <p className="cg-sec-sub">Explore our wide range of premium Assam products</p>

        <div className="cg-cat-row">
          {categories.map(cat => (
            <div key={cat.id}
              className={`cg-cat-card${cat.slug === slug ? " active" : ""}`}
              onClick={() => goToCategory(cat.slug)}>
              <div className="cg-cat-img-wrap">
                <img className="cg-cat-img" src={cat.imageUrl} alt={cat.name} />
                <div className="cg-cat-icon">🍃</div>
              </div>
              <p className="cg-cat-name">{cat.name}</p>
              <span className="cg-cat-count">{cat.productCount ?? 0}+ Products</span>
              {cat.slug === slug && <div className="cg-cat-underline" />}
            </div>
          ))}
        </div>

        {/* BROWSE BY TYPE */}
        <div className="cg-sec-head" style={{ marginBottom: 12 }}>
          <h2 className="cg-sec-title">🍃 BROWSE BY TEA TYPE</h2>
        </div>
        <div className="cg-pill-row">
          {SUB_TYPES.map(t => (
            <button key={t.slug}
              className={`cg-pill${activeType === t.slug ? " active" : ""}`}
              onClick={() => setActiveType(t.slug)}>
              🍃 {t.name}
            </button>
          ))}
          <button className="cg-pill-more" onClick={() => setShowMore(v => !v)}>
            More <span style={{ transform: showMore ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform .2s" }}>⌄</span>
          </button>
        </div>

        {/* TRUST BADGES */}
        <div className="cg-trust">
          {TRUST_BADGES.map(b => (
            <div key={b.title} className="cg-trust-item">
              <div className="cg-trust-icon"><BadgeIcon type={b.icon} /></div>
              <p className="cg-trust-title">{b.title}</p>
              <p className="cg-trust-sub">{b.sub}</p>
            </div>
          ))}
        </div>

        {/* FEATURE BANNER */}
        <div className="cg-feature">
          <img className="cg-feature-bg" src={FEATURE_BANNER.image} alt="" />
          <div className="cg-feature-overlay" />
          <div className="cg-feature-content">
            <h3 className="cg-feature-title">{FEATURE_BANNER.title}</h3>
            <p className="cg-feature-desc">{FEATURE_BANNER.desc}</p>
            <button className="cg-feature-btn" onClick={() => goToCategory(slug)}>
              {FEATURE_BANNER.btnText} <span>→</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
