import { Link } from "wouter";
import { useEffect, useState, useRef } from "react";
import { useGetFeaturedProducts } from "@workspace/api-client-react";
import { getGetFeaturedProductsQueryKey } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Leaf, Shield, Truck, Headphones, ChevronLeft, ChevronRight, Star, Play } from "lucide-react";
import ProductCard from "@/components/product-card";
import { StatsSection } from "@/components/StatsSection";

const G = "#1a5a32";
const GOLD = "#c9a84c";
const BG = "#f5f0e8";

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      .ab-root { font-family: 'DM Sans', sans-serif; background: ${BG}; }
      .ab-serif { font-family: 'Playfair Display', serif; }
      @keyframes ab-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes ab-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.6} }
      @keyframes ab-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      @keyframes ab-fadeup { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      @keyframes ab-fadein { from{opacity:0} to{opacity:1} }
      .ab-noscroll { scrollbar-width:none; -ms-overflow-style:none; }
      .ab-noscroll::-webkit-scrollbar { display:none; }
      .ab-cat-card { flex-shrink:0; width:120px; border-radius:14px; overflow:hidden; text-decoration:none; display:block; position:relative; box-shadow:0 2px 10px rgba(0,0,0,.08); transition:transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s; }
      .ab-cat-card:hover { transform:translateY(-5px) scale(1.03); box-shadow:0 12px 28px rgba(0,0,0,.14); }
      .ab-cat-card.active { box-shadow:0 0 0 2.5px ${G}, 0 12px 24px rgba(26,90,50,.2); }
      .ab-cat-card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s cubic-bezier(.16,1,.3,1); }
      .ab-cat-card:hover img { transform:scale(1.08); }
      .ab-label { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:${GOLD}; margin-bottom:6px; }
      .ab-h2 { font-family:'Playfair Display',serif; font-size:clamp(1.5rem,4vw,2rem); font-weight:700; color:#111827; line-height:1.2; }
      .ab-h2 span { color:${GOLD}; }
      .ab-viewall { display:inline-flex; align-items:center; gap:4px; font-size:13px; font-weight:600; color:${G}; text-decoration:none; transition:gap .2s; }
      .ab-viewall:hover { gap:8px; }
      .ab-hero-primary { display:inline-flex; align-items:center; gap:8px; padding:13px 26px; border-radius:50px; background:${GOLD}; color:#111; font-weight:700; font-size:14px; border:none; cursor:pointer; text-decoration:none; box-shadow:0 8px 24px rgba(201,168,76,.45); transition:transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s; }
      .ab-hero-primary:hover { transform:scale(1.06); box-shadow:0 14px 32px rgba(201,168,76,.6); }
      .ab-hero-secondary { display:inline-flex; align-items:center; gap:8px; padding:13px 26px; border-radius:50px; background:rgba(255,255,255,.13); backdrop-filter:blur(12px); border:1.5px solid rgba(255,255,255,.45); color:#fff; font-weight:700; font-size:14px; cursor:pointer; text-decoration:none; transition:transform .2s cubic-bezier(.34,1.56,.64,1), background .2s; }
      .ab-hero-secondary:hover { transform:scale(1.06); background:rgba(255,255,255,.22); }
      .ab-arrow-btn { width:32px; height:32px; border-radius:50%; border:1.5px solid #e5e7eb; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; color:${G}; transition:background .2s, border-color .2s, transform .2s; }
      .ab-arrow-btn:hover { background:${G}; color:#fff; border-color:${G}; transform:scale(1.1); }
      .ab-review-card { background:#fff; border-radius:22px; padding:24px 22px; box-shadow:0 4px 20px rgba(0,0,0,.07); border:1px solid #f0e8df; transition:transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s; }
      .ab-review-card:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(0,0,0,.12); }
      .ab-htag { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border-radius:20px; background:rgba(201,168,76,.12); color:${GOLD}; font-size:11.5px; font-weight:600; border:1px solid rgba(201,168,76,.25); white-space:nowrap; }
    `}</style>
  );
}

const DEFAULT_SLIDES = [
  { id: "1", badge: "Straight from Assam", title: "Awesome Assam", titleAccent: "TEA", subtitle: "From Assam's lush gardens to your cup — pure, rich & truly authentic.", ctaLabel: "Discover Now", ctaHref: "/products?category=assam-tea", ctaSecondaryLabel: "View All", ctaSecondaryHref: "/products", bgColor: "#0d2e10", image: "https://sad-beige-a5kcyl8q.edgeone.app/44e87171-865e-40d5-9a20-b585e9b34956.png", accent: GOLD },
  { id: "2", badge: "Cultural Heritage", title: "Traditional", titleAccent: "Mekhela Chador", subtitle: "The sacred weave of Assam — handcrafted with love, worn with pride.", ctaLabel: "Shop Now", ctaHref: "/products?category=handloom", ctaSecondaryLabel: "View All", ctaSecondaryHref: "/products", bgColor: "#1a0d2e", image: "https://quickest-blush-tkhqsusm.edgeone.app/b58e6c82-c671-4a12-917c-eb8c458c2b61.png", accent: "#e8c84a" },
  { id: "3", badge: "Nature's Best", title: "Organic Assam", titleAccent: "Goodness", subtitle: "Chemical-free, farm-fresh organic produce straight from Assam's fertile lands.", ctaLabel: "Shop Organic", ctaHref: "/products?category=organic", ctaSecondaryLabel: "View All", ctaSecondaryHref: "/products", bgColor: "#0a2510", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80", accent: "#7ec850" },
  { id: "4", badge: "Artisan Craft", title: "Bamboo", titleAccent: "Handicrafts", subtitle: "Handmade bamboo treasures — sustainable, beautiful, uniquely Assamese.", ctaLabel: "Explore", ctaHref: "/products?category=handicrafts", ctaSecondaryLabel: "View All", ctaSecondaryHref: "/products", bgColor: "#1a1200", image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=1400&q=80", accent: GOLD },
  { id: "5", badge: "Pride of Assam", title: "Assam Tea", titleAccent: "Gardens", subtitle: "First flush, second flush — every sip tells the story of Assam's hills.", ctaLabel: "Shop Tea", ctaHref: "/products?category=tea", ctaSecondaryLabel: "View All", ctaSecondaryHref: "/products", bgColor: "#1a0808", image: "https://thundering-black-udqfmt7p.edgeone.app/785269bd-8b13-433b-a1ef-912e8699eeee.png", accent: GOLD },
];

// ─── HERO SLIDER — image fills 100%, text overlaid ──────────────────────────
function HeroSlider() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);

  const loadSlides = () => {
    try {
      const saved = localStorage.getItem("hero_slides");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed);
          setCurrent(0);
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadSlides();
    const onStorage = (e: StorageEvent) => { if (e.key === "hero_slides") loadSlides(); };
    const onUpdate = () => loadSlides();
    window.addEventListener("storage", onStorage);
    window.addEventListener("hero_slides_updated", onUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("hero_slides_updated", onUpdate);
    };
  }, []);

  const goTo = (i: number) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => { setCurrent(i); setFading(false); }, 380);
  };

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => goTo((current + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [current, paused, slides.length]);

  const s = slides[current];

  return (
    <section
      style={{ position: "relative", overflow: "hidden", minHeight: "86vh" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── SLIDE LAYERS ── */}
      {slides.map((sl, i) => (
        <div
          key={sl.id}
          style={{
            position: "absolute", inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.65s ease",
            zIndex: 0,
          }}
        >
          {/* Solid bg color — shows while image loads */}
          <div style={{ position: "absolute", inset: 0, background: sl.bgColor }} />

          {/* ── THE IMAGE — full width, full height, NO opacity reduction ── */}
          {sl.image && (
            <img
              src={sl.image}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",        // fills the box, same as admin preview
                objectPosition: "center",  // centered, same as admin
                opacity: 1,                // FULL opacity — exact same as uploaded
                transform: i === current ? "scale(1.04)" : "scale(1)",
                transition: "transform 7s ease",
              }}
            />
          )}

          {/* ── Gradient overlay — only for text readability, NOT hiding image ── */}
          {/* Left dark band: makes left-side text readable */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.05) 75%, transparent 100%)",
          }} />
          {/* Bottom vignette */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
            background: "linear-gradient(to top, rgba(0,0,0,0.40), transparent)",
          }} />
        </div>
      ))}

      {/* Gold top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${s.accent}cc, transparent)`, zIndex: 2 }} />

      {/* ── CONTENT ── */}
      <div
        style={{
          position: "relative", zIndex: 3,
          display: "flex", alignItems: "center",
          minHeight: "86vh",
          padding: "100px 22px 80px",
        }}
      >
        <div style={{
          maxWidth: 520,
          opacity: fading ? 0 : 1,
          transform: fading ? "translateY(16px)" : "translateY(0)",
          transition: "opacity .38s, transform .38s",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,.12)", backdropFilter: "blur(14px)",
            border: `1.5px solid ${s.accent}55`,
            color: s.accent, padding: "5px 14px", borderRadius: 50,
            fontSize: 10.5, fontWeight: 700, letterSpacing: 2.2,
            textTransform: "uppercase", marginBottom: 18,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.accent, display: "inline-block", animation: "ab-pulse 2s ease-in-out infinite" }} />
            🌿 {s.badge}
          </div>

          {/* Title */}
          <h1 className="ab-serif" style={{
            fontSize: "clamp(2.4rem,7vw,4.4rem)",
            color: "#fff", lineHeight: 1.06, fontWeight: 800, marginBottom: 10,
          }}>
            {s.title}<br />
            <span style={{
              backgroundImage: `linear-gradient(90deg, ${s.accent} 0%, rgba(255,255,255,.95) 45%, ${s.accent} 100%)`,
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "ab-shimmer 3s linear infinite",
            }}>{s.titleAccent}</span>
          </h1>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 44, height: 2, background: s.accent, borderRadius: 2 }} />
            <span style={{ color: s.accent, fontSize: 13 }}>🌿</span>
            <div style={{ width: 44, height: 2, background: s.accent, borderRadius: 2 }} />
          </div>

          <p style={{ color: "rgba(255,255,255,.85)", fontSize: "1rem", lineHeight: 1.72, maxWidth: 400, marginBottom: 30 }}>{s.subtitle}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href={s.ctaHref} className="ab-hero-primary">{s.ctaLabel} <ArrowRight size={15} /></Link>
            <Link href={s.ctaSecondaryHref} className="ab-hero-secondary"><Play size={12} style={{ fill: "currentColor" }} /> {s.ctaSecondaryLabel}</Link>
          </div>
        </div>
      </div>

      {/* Counter */}
      <div style={{ position: "absolute", top: 22, right: 18, zIndex: 4, color: "rgba(255,255,255,.4)", fontSize: 12, fontWeight: 700 }}>
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      {/* Dots */}
      <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", gap: 7, alignItems: "center" }}>
        {slides.map((sl, i) => (
          <button key={sl.id} onClick={() => goTo(i)} style={{ height: 8, width: i === current ? 26 : 8, borderRadius: 4, background: i === current ? s.accent : "rgba(255,255,255,.38)", border: "none", cursor: "pointer", transition: "all .35s", padding: 0 }} />
        ))}
      </div>

      {/* Side arrows */}
      <button onClick={() => goTo((current - 1 + slides.length) % slides.length)} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", zIndex: 4, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.25)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <ChevronLeft size={20} />
      </button>
      <button onClick={() => goTo((current + 1) % slides.length)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", zIndex: 4, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.25)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <ChevronRight size={20} />
      </button>
    </section>
  );
}

// ─── TRUST BAR ────────────────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon: Truck,      label: "Free Shipping",     desc: "On orders above ₹499" },
    { icon: Shield,     label: "Authentic Products", desc: "Verified Assamese Products" },
    { icon: Leaf,       label: "100% Organic",       desc: "Natural & Handmade" },
    { icon: Headphones, label: "Customer Support",   desc: "We're here to help" },
  ];
  return (
    <section style={{ background: "#fff", borderTop: "1px solid #f0ece4", borderBottom: "1px solid #f0ece4" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {items.map(({ icon: Icon, label, desc }, idx) => (
          <div key={label} style={{
            display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 12px",
            borderRight: idx % 2 === 0 ? "1px solid #f0ece4" : "none",
            borderBottom: idx < 2 ? "1px solid #f0ece4" : "none",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0f7f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={16} color={G} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 12, color: "#111827", lineHeight: 1.3 }}>{label}</p>
              <p style={{ fontSize: 10.5, color: "#9ca3af", lineHeight: 1.45, marginTop: 2 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CATEGORY SECTION ─────────────────────────────────────────────────────────
const FALLBACK_CATS = [
  { id: "tea", name: "Tea", slug: "tea", emoji: "🍵" },
  { id: "handloom", name: "Handloom", slug: "handloom", emoji: "🧣" },
  { id: "handicrafts", name: "Handicrafts", slug: "handicrafts", emoji: "🪣" },
  { id: "organic", name: "Organic Food", slug: "organic", emoji: "🌿" },
  { id: "bamboo", name: "Bamboo", slug: "bamboo", emoji: "🎋" },
];

function CategorySection({ categories, isLoading }: { categories: any[]; isLoading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const cats = (Array.isArray(categories) && categories.length > 0) ? categories : FALLBACK_CATS;

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 5);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }
  function scrollBy(dir: number) { scrollRef.current?.scrollBy({ left: dir * 130, behavior: "smooth" }); }

  useEffect(() => {
    if (!cats.length) return;
    const t = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 5;
      el.scrollBy({ left: atEnd ? -el.scrollWidth : 130, behavior: "smooth" });
    }, 3200);
    return () => clearInterval(t);
  }, [cats.length]);

  return (
    <section style={{ padding: "22px 0 18px", background: "#fff" }}>
      <div style={{ padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}>Shop by Category</h2>
        <Link href="/products" className="ab-viewall">View All <ArrowRight size={14} /></Link>
      </div>
      <div style={{ position: "relative", padding: "0 16px" }}>
        <button className="ab-arrow-btn" style={{ position: "absolute", left: 4, top: "44%", transform: "translateY(-50%)", zIndex: 1, opacity: canLeft ? 0 : 0.0 }} onClick={() => scrollBy(-1)} disabled={!canLeft}><ChevronLeft size={15} /></button>
        <div ref={scrollRef} className="ab-noscroll" style={{ display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory", padding: "4px 2px 8px" }} onScroll={onScroll}>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ flexShrink: 0, width: 120, height: 120, borderRadius: 14, background: "#e5e7eb" }} />)
            : cats.map((cat: any) => {
                const imgSrc = cat.imageUrl ?? cat.image_url ?? null;
                const isActive = activeId === cat.id || activeId === cat.slug;
                return (
                  <Link key={cat.id} href={`/category/${cat.slug}`} className={`ab-cat-card ${isActive ? "active" : ""}`} style={{ height: 120 }} onClick={() => setActiveId(cat.id ?? cat.slug)}>
                    <div style={{ width: "100%", height: 82, overflow: "hidden", position: "relative" }}>
                      {imgSrc
                        ? <img src={imgSrc} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, background: isActive ? G : "#edf5ef" }}>{(cat as any).emoji ?? "🌿"}</div>
                      }
                      {isActive && <div style={{ position: "absolute", inset: 0, background: `${G}cc`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{(cat as any).emoji ?? "🌿"}</div>}
                    </div>
                    <div style={{ padding: "7px 8px", background: isActive ? G : "#fff", textAlign: "center" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#fff" : "#374151", lineHeight: 1.3 }}>{cat.name}</p>
                    </div>
                  </Link>
                );
              })
          }
        </div>
        <button className="ab-arrow-btn" style={{ position: "absolute", right: 4, top: "44%", transform: "translateY(-50%)", zIndex: 4, opacity: canRight ? 1 : 0.3, width: 32, height: 32, background: "rgba(255,255,255,.85)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => scrollBy(1)} disabled={!canRight}><ChevronRight size={18} /></button>
      </div>
    </section>
  );
}

// ─── FEATURED CAROUSEL ────────────────────────────────────────────────────────
function FeaturedCarousel({ products, isLoading }: { products: any[]; isLoading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const CARD_W = 172, GAP = 12;

  useEffect(() => {
    if (paused || isLoading || !products.length) return;
    const t = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 8) { el.scrollTo({ left: 0, behavior: "smooth" }); setCurrent(0); }
      else { el.scrollTo({ left: el.scrollLeft + CARD_W + GAP, behavior: "smooth" }); setCurrent(c => c + 1); }
    }, 3000);
    return () => clearInterval(t);
  }, [paused, isLoading, products.length]);

  const dots = products.length > 0 ? Math.ceil(products.length / 2) : 0;
  return (
    <section style={{ padding: "24px 0 20px", background: BG }}>
      <div style={{ padding: "0 16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <p className="ab-label">🌿 HANDPICKED FOR YOU</p>
          <h2 className="ab-h2" style={{ fontSize: "1.5rem" }}>Featured <span>Products</span></h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <button className="ab-arrow-btn" onClick={() => { scrollRef.current?.scrollBy({ left: -(CARD_W + GAP), behavior: "smooth" }); setPaused(true); setTimeout(() => setPaused(false), 2000); }}><ChevronLeft size={14} /></button>
          <button className="ab-arrow-btn" onClick={() => { scrollRef.current?.scrollBy({ left: CARD_W + GAP, behavior: "smooth" }); setPaused(true); setTimeout(() => setPaused(false), 2000); }}><ChevronRight size={14} /></button>
          <Link href="/products?featured=true" className="ab-viewall" style={{ fontSize: 12 }}>View All <ArrowRight size={13} /></Link>
        </div>
      </div>
      <div ref={scrollRef} className="ab-noscroll" style={{ display: "flex", gap: GAP, overflowX: "auto", padding: "4px 16px 8px", scrollSnapType: "x mandatory" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ width: CARD_W, flexShrink: 0 }}><Skeleton style={{ height: 260, borderRadius: 16, width: "100%" }} /></div>)
          : products.map(p => <div key={p.id} style={{ width: CARD_W, flexShrink: 0, scrollSnapAlign: "start" }}><ProductCard product={p} /></div>)
        }
      </div>
      {dots > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
          {Array.from({ length: dots }).map((_, i) => (
            <div key={i} style={{ width: Math.floor(current / 2) === i ? 22 : 7, height: 7, borderRadius: 4, background: Math.floor(current / 2) === i ? G : "rgba(0,0,0,.18)", transition: "all .3s" }} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── ARTISAN BANNER ───────────────────────────────────────────────────────────
function ArtisanBanner() {
  return (
    <section style={{ padding: "8px 16px 12px" }}>
      <div style={{ borderRadius: 22, overflow: "hidden", position: "relative", background: "#0d3318", minHeight: 220 }}>
        <img src="https://foreign-apricot-5gn5jhkx.edgeone.app/e5802067-9dbb-42c5-b805-678e9b453f9c.png" alt="" style={{ position: "absolute", top: 0, right: 0, width: "62%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0d3318 38%, #0d331888 62%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,25,12,0.35)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "22px 20px 18px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${GOLD}22`, border: `1px solid ${GOLD}60`, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: 2.2, textTransform: "uppercase", padding: "4px 12px", borderRadius: 20, marginBottom: 14 }}>🌿 OUR PROMISE</div>
          <h2 className="ab-serif" style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.18, marginBottom: 10, maxWidth: "55%" }}>Supporting<br />Assam's Artisan<br /><span style={{ color: GOLD }}>Community</span></h2>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 11.5, lineHeight: 1.65, maxWidth: "55%", marginBottom: 20 }}>Every purchase directly supports local weavers, tea farmers, and craftspeople preserving centuries-old Assamese traditions.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[{ icon: "👥", value: "500+", label: "Artisans" }, { icon: "📦", value: "1200+", label: "Products" }, { icon: "📍", value: "25+", label: "Districts" }, { icon: "⭐", value: "4.8", label: "Avg Rating" }].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,.1)", borderRadius: 12, padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.1)", backdropFilter: "blur(8px)" }}>
                <div style={{ fontSize: 15, marginBottom: 4 }}>{s.icon}</div>
                <p style={{ color: GOLD, fontWeight: 800, fontSize: ".95rem", fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: "rgba(255,255,255,.6)", fontSize: 9, marginTop: 3 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HERITAGE MARQUEE ─────────────────────────────────────────────────────────
function HeritageMarquee() {
  const tags = ["Assam Tea", "Gamosa", "Mekhela Chador", "Handicrafts", "Organic Goodness", "Bamboo Crafts", "Muga Silk", "Joha Rice"];
  return (
    <div style={{ background: `${G}0a`, borderTop: `1px solid ${G}18`, borderBottom: `1px solid ${G}18`, padding: "10px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", width: "max-content", animation: "ab-marquee 22s linear infinite" }}>
        {[...tags, ...tags].map((tag, i) => <span key={i} className="ab-htag" style={{ margin: "0 8px" }}>🌿 {tag}</span>)}
      </div>
    </div>
  );
}

// ─── NEW ARRIVALS ─────────────────────────────────────────────────────────────
function NewArrivalsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => { const r = await fetch("/api/products?limit=6"); const d = await r.json(); return Array.isArray(d) ? d : d?.products ?? []; },
  });
  if (isLoading) return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} style={{ height: 280, borderRadius: 18 }} />)}</div>;
  const products = Array.isArray(data) ? data : [];
  if (!products.length) return <div style={{ textAlign: "center", padding: "36px 0", color: "#9ca3af" }}><div style={{ fontSize: 28, marginBottom: 6 }}>🌿</div><p style={{ fontSize: 13 }}>New arrivals coming soon!</p></div>;
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{products.map((p: any) => <ProductCard key={p.id} product={p} />)}</div>;
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const reviews = [
    { name: "Ananya Das", city: "Mumbai", rating: 5, text: "Got a gamosa as a gift for my grandmother. She was moved to tears — said it reminded her of home.", emoji: "🎁" },
    { name: "Priya Sharma", city: "Delhi", rating: 5, text: "The Muga silk dupatta is absolutely stunning. You can feel the quality and craftsmanship. Will order again!", emoji: "🧣" },
    { name: "Rajesh Kumar", city: "Bangalore", rating: 5, text: "Best Assam tea I've ever had! The first flush is exceptional. Delivered within 3 days.", emoji: "🍵" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => { const t = setInterval(() => setActive(p => (p + 1) % reviews.length), 4200); return () => clearInterval(t); }, []);
  const r = reviews[active];
  return (
    <section style={{ padding: "28px 16px 24px", background: "#faf6f0" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <p style={{ color: GOLD, fontSize: 10.5, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>🌿 WHAT CUSTOMERS SAY 🌿</p>
        <h2 className="ab-serif" style={{ fontSize: "1.9rem", fontWeight: 800, color: "#111827" }}>Loved Across <span style={{ color: G }}>India</span></h2>
      </div>
      <div className="ab-review-card" style={{ marginBottom: 16, animation: "ab-fadein .4s ease" }} key={active}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 3 }}>{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={16} style={{ fill: GOLD, color: GOLD }} />)}</div>
          <span style={{ fontSize: 32 }}>{r.emoji}</span>
        </div>
        <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.75, fontStyle: "italic", marginBottom: 20, fontFamily: "'Playfair Display',serif", fontWeight: 600 }}>"{r.text}"</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${G},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{r.name[0]}</div>
          <div><p style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{r.name}</p><p style={{ fontSize: 11.5, color: GOLD }}>📍 {r.city}</p></div>
          <span style={{ marginLeft: "auto", background: "#f0fdf4", color: "#16a34a", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, border: "1px solid #bbf7d0" }}>✅ Verified</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
        {reviews.map((_, i) => <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 22 : 8, height: 8, borderRadius: 4, background: i === active ? G : "#d1d5db", border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }} />)}
      </div>
      <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", border: "1px solid #f0e8df" }}>
        <div style={{ display: "flex", gap: 0 }}>
          {[{ icon: "⭐", label: "4.9/5 Rating", sub: "2,400+ reviews" }, { icon: "🚚", label: "Fast Delivery", sub: "Pan India" }, { icon: "🔒", label: "Secure Payments", sub: "100% safe" }, { icon: "🤝", label: "Artisan Support", sub: "Direct from Artisans" }].map((b, idx) => (
            <div key={b.label} style={{ flex: 1, textAlign: "center", borderRight: idx < 3 ? "1px solid #f0ece4" : "none", padding: "0 6px" }}>
              <span style={{ fontSize: 20, display: "block", marginBottom: 3 }}>{b.icon}</span>
              <p style={{ fontWeight: 700, fontSize: 10.5, color: "#111827", lineHeight: 1.2 }}>{b.label}</p>
              <p style={{ fontSize: 9.5, color: "#9ca3af", lineHeight: 1.3 }}>{b.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── RECENTLY VIEWED ──────────────────────────────────────────────────────────
function RecentlyViewedSection() {
  const [productIds, setProductIds] = useState<number[]>([]);
  useEffect(() => { try { const ids: number[] = JSON.parse(localStorage.getItem("apunbazar_recently_viewed") ?? "[]"); setProductIds(ids.slice(0, 4)); } catch {} }, []);
  const { data: productsData, isLoading } = useQuery({ queryKey: ["recently-viewed", productIds], queryFn: async () => { if (!productIds.length) return []; const results = await Promise.all(productIds.map(id => fetch(`/api/products/${id}`).then(r => r.ok ? r.json() : null).catch(() => null))); return results.filter(Boolean); }, enabled: productIds.length > 0, staleTime: 2 * 60 * 1000 });
  if (!productIds.length) return null;
  return (
    <section style={{ padding: "22px 16px 24px", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div><p className="ab-label">🎁 RECENTLY VIEWED</p><h2 className="ab-h2" style={{ fontSize: "1.25rem" }}>VIEWED 👀</h2></div>
        <Link href="/products" className="ab-viewall" style={{ fontSize: 12 }}>See all <ArrowRight size={13} /></Link>
      </div>
      {isLoading ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{[1, 2].map(i => <Skeleton key={i} style={{ height: 220, borderRadius: 18 }} />)}</div>
        : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{(productsData ?? []).map((p: any) => <ProductCard key={p.id} product={p} />)}</div>}
    </section>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedProducts({ query: { queryKey: getGetFeaturedProductsQueryKey() } });
  const { data: categoriesRaw, isLoading: catLoading } = useQuery({
    queryKey: ["main-categories-with-count"],
    queryFn: async () => {
      const [cats, products] = await Promise.all([fetch("/api/categories/tree").then(r => r.json()), fetch("/api/products?limit=100").then(r => r.json())]);
      const prods = products?.products ?? [];
      const catsArr = Array.isArray(cats) ? cats : [];
      return catsArr.map((cat: any) => ({ ...cat, productCount: prods.filter((p: any) => p.categoryId === cat.id).length }));
    },
  });

  return (
    <div className="ab-root">
      <GlobalStyles />
      <HeroSlider />
      <TrustBar />
      <CategorySection categories={Array.isArray(categoriesRaw) ? categoriesRaw : []} isLoading={catLoading} />
      <FeaturedCarousel products={Array.isArray(featured) ? featured : []} isLoading={featuredLoading} />
      <ArtisanBanner />
      <HeritageMarquee />
      <StatsSection />
      <section style={{ padding: "24px 16px 20px", background: BG }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
          <div><p className="ab-label">🌿 NEW ARRIVALS</p><h2 className="ab-h2">Latest From Our <span>Artisans</span></h2></div>
          <Link href="/products" className="ab-viewall">View All <ArrowRight size={14} /></Link>
        </div>
        <NewArrivalsSection />
      </section>
      <TestimonialsSection />
      <RecentlyViewedSection />
    </div>
  );
}