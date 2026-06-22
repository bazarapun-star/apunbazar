import ExperienceAssamSection from "@/components/ExperienceAssamSection";
import { Link } from "wouter";
import { useEffect, useState, useRef } from "react";
import { useGetFeaturedProducts } from "@workspace/api-client-react";
import { getGetFeaturedProductsQueryKey } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import React from "react";

const G = "#1a5a32";
const GOLD = "#c9a84c";
const BG = "#f5f0e8";

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IconTruck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/>
    <path d="M16 8h4l3 3v5h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconLeaf = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/>
  </svg>
);
const IconHeadphones = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0118 0v6"/>
    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
  </svg>
);
const IconArrowRight = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const IconPlay = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);
const IconStar = ({ size = 16, filled = true }: { size?: number; filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? GOLD : "none"} stroke={GOLD} strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconMapPin = ({ size = 11 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconLeafSmall = ({ color = GOLD }: { color?: string }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill={color}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/>
  </svg>
);

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
      @keyframes ab-rotateleaf { 0%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} 100%{transform:rotate(-5deg)} }
      @keyframes ab-quoteglow { 0%,100%{opacity:.15} 50%{opacity:.35} }
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
      .ab-test-card { transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s; }
      .ab-test-card:active { transform: scale(0.98); }
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

// ─── HERO SLIDER ──────────────────────────────────────────────────────────────
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
          <div style={{ position: "absolute", inset: 0, background: sl.bgColor }} />
          {sl.image && (
            <img
              src={sl.image}
              alt=""
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
                opacity: 1,
                transform: i === current ? "scale(1.04)" : "scale(1)",
                transition: "transform 7s ease",
              }}
            />
          )}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.05) 75%, transparent 100%)",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
            background: "linear-gradient(to top, rgba(0,0,0,0.40), transparent)",
          }} />
        </div>
      ))}

      {/* Gold top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${s.accent}cc, transparent)`, zIndex: 2 }} />

      {/* Floating decorative leaf SVG */}
      <svg
        style={{ position: "absolute", right: "8%", top: "18%", zIndex: 2, opacity: 0.15, animation: "ab-rotateleaf 4s ease-in-out infinite" }}
        width="90" height="90" viewBox="0 0 100 100"
      >
        <path d="M50 10 C70 10,90 30,90 50 C90 70,70 90,50 90 C30 90,10 70,10 50 C10 30,30 10,50 10Z" fill={s.accent}/>
        <path d="M50 10 Q60 40 50 90" stroke={s.bgColor} strokeWidth="2.5" fill="none"/>
        <path d="M50 30 Q65 40 80 38" stroke={s.bgColor} strokeWidth="2" fill="none"/>
        <path d="M50 50 Q65 55 78 50" stroke={s.bgColor} strokeWidth="2" fill="none"/>
        <path d="M50 68 Q60 70 72 65" stroke={s.bgColor} strokeWidth="1.5" fill="none"/>
      </svg>

      {/* Content */}
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
            <IconLeafSmall color={s.accent} /> {s.badge}
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
            <IconLeafSmall color={s.accent} />
            <div style={{ width: 44, height: 2, background: s.accent, borderRadius: 2 }} />
          </div>

          <p style={{ color: "rgba(255,255,255,.85)", fontSize: "1rem", lineHeight: 1.72, maxWidth: 400, marginBottom: 30 }}>{s.subtitle}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href={s.ctaHref} className="ab-hero-primary">{s.ctaLabel} <IconArrowRight size={15} /></Link>
            <Link href={s.ctaSecondaryHref} className="ab-hero-secondary"><IconPlay size={12} /> {s.ctaSecondaryLabel}</Link>
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

    </section>
  );
}

// ─── TRUST BAR ────────────────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    {
      tag: "Fast & Reliable", title: "Free Shipping", desc: "Orders Above ₹499",
      iconColor: "#1a5a32", ringColor: "#4caf50", bg: "#f0f7f0", border: "#c2e0ce", tagColor: "#2e7d32",
      icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    },
    {
      tag: "Pure & Authentic", title: "100% Authentic", desc: "Verified Assamese Products",
      iconColor: "#c9a84c", ringColor: "#e6b94a", bg: "#fdf8ee", border: "#e8d5a0", tagColor: "#b8860b",
      icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
    },
    {
      tag: "Clean & Natural", title: "Natural Products", desc: "Fresh & Carefully Selected",
      iconColor: "#2e7d32", ringColor: "#4caf50", bg: "#f0f7f0", border: "#bddfa0", tagColor: "#2e7d32",
      icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/></svg>,
    },
    {
      tag: "Always With You", title: "24/7 Support", desc: "Always Here To Help",
      iconColor: "#1565c0", ringColor: "#42a5f5", bg: "#e8f0fb", border: "#a8bede", tagColor: "#1565c0",
      icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    },
  ];

  return (
    <section style={{ background: BG, padding: "10px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {items.map((item) => (
          <div key={item.title} style={{
            background: "#fff", borderRadius: 14, padding: "10px 9px",
            border: "0.5px solid #ede8de",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            position: "relative", overflow: "hidden",
            display: "flex", alignItems: "flex-start", gap: 8,
            minHeight: 82,
          }}>
            {/* Icon with arc ring */}
            <div style={{ position: "relative", flexShrink: 0, width: 44, height: 44 }}>
              <svg width="44" height="44" viewBox="0 0 44 44" style={{ position: "absolute", inset: 0 }}>
                <circle cx="22" cy="22" r="19" fill="none" stroke={item.ringColor} strokeWidth="2" strokeDasharray="30 90" strokeDashoffset="-22" strokeLinecap="round" opacity="0.5" />
              </svg>
              <div style={{
                position: "absolute", inset: 4, borderRadius: "50%",
                background: item.bg, border: `1px solid ${item.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {item.icon(item.iconColor)}
              </div>
            </div>

            {/* Text */}
            <div style={{ flex: 1, paddingTop: 2 }}>
              <p style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: item.tagColor, margin: "0 0 3px" }}>
                {item.tag}
              </p>
              <div style={{ width: 16, height: 1.5, background: item.tagColor, borderRadius: 2, marginBottom: 4, opacity: 0.7 }} />
              <p style={{ fontSize: 12.5, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#1a2d1a", margin: "0 0 3px", lineHeight: 1.2 }}>
                {item.title}
              </p>
              <p style={{ fontSize: 9.5, color: "#888", margin: 0, lineHeight: 1.4 }}>
                {item.desc}
              </p>
            </div>

            {/* Deco leaf */}
            <svg style={{ position: "absolute", bottom: -3, right: -3, opacity: 0.06, pointerEvents: "none" }} width="46" height="46" viewBox="0 0 24 24" fill={item.iconColor}>
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/>
            </svg>
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
  const [paused, setPaused] = useState(false);
  const cats = (Array.isArray(categories) && categories.length > 0)
    ? categories
    : FALLBACK_CATS;

  useEffect(() => {
    if (paused || isLoading || !cats.length) return;
    const CARD_W = 148, GAP = 14;
    const t = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollTo({ left: el.scrollLeft + CARD_W + GAP, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(t);
  }, [paused, isLoading, cats.length]);

  return (
    <section style={{ background: BG, paddingBottom: 8 }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-end",
        justifyContent: "space-between", padding: "22px 16px 14px",
      }}>
        <div>
          <p className="ab-label" style={{ marginBottom: 5 }}>
            <IconLeafSmall /> Explore categories
          </p>
          <h2 className="ab-serif" style={{
            fontSize: "1.35rem", fontWeight: 700,
            color: "#1B3A22", margin: 0, lineHeight: 1.2,
          }}>
            Shop by <span style={{ color: GOLD }}>Category</span>
          </h2>
        </div>
        <Link href="/products" className="ab-viewall" style={{ fontSize: 12 }}>
          View all <IconArrowRight size={13} />
        </Link>
      </div>

      {/* Swipe hint */}
      <p style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: "0 16px 4px", color: "#9ca3af", fontSize: 10.5,
        margin: 0,
      }}>
        <IconArrowRight size={11} /> Swipe to explore
      </p>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setTimeout(() => setPaused(false), 2000)}
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          padding: "4px 16px 12px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        } as React.CSSProperties}
        className="ab-noscroll"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{
                flexShrink: 0, width: 148,
                height: 210, borderRadius: 20,
                background: "#e5e7eb",
              }} />
            ))
          : cats.map((cat: any) => {
              const imgSrc = cat.imageUrl ?? cat.image_url ?? null;
              return (
                <Link
                  key={cat.id ?? cat.slug}
                  href={`/category/${cat.slug}`}
                  style={{
                    flexShrink: 0,
                    width: 148,
                    borderRadius: 20,
                    overflow: "hidden",
                    textDecoration: "none",
                    scrollSnapAlign: "start",
                    background: "#fff",
                    border: `0.5px solid rgba(212,175,55,0.22)`,
                    boxShadow: "0 4px 18px rgba(27,94,32,0.10), 0 1px 4px rgba(0,0,0,0.06)",
                    display: "block",
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: "100%", height: 158,
                    overflow: "hidden", position: "relative",
                    background: "#edf5ef",
                  }}>
                    {imgSrc
                      ? <img
                          src={imgSrc} alt={cat.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      : <div style={{
                          width: "100%", height: "100%",
                          display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 52,
                        }}>{cat.emoji ?? "🌿"}</div>
                    }
                    {/* subtle green vignette */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(27,94,32,0.18) 0%, transparent 55%)",
                      pointerEvents: "none",
                    }} />
                  </div>

                  {/* Label */}
                  <div style={{ padding: "10px 10px 12px", textAlign: "center" }}>
                    <p className="ab-serif" style={{
                      fontSize: 13.5, fontWeight: 700, color: "#1B3A22",
                      margin: "0 0 6px", whiteSpace: "nowrap",
                      overflow: "hidden", textOverflow: "ellipsis",
                    }}>{cat.name}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      <span style={{ width: 28, height: 1, background: GOLD, display: "block", borderRadius: 1 }} />
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD, display: "inline-block", flexShrink: 0 }} />
                      <span style={{ width: 28, height: 1, background: GOLD, display: "block", borderRadius: 1 }} />
                    </div>
                  </div>
                </Link>
              );
            })
        }
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
          <p className="ab-label"><IconLeafSmall /> HANDPICKED FOR YOU</p>
          <h2 className="ab-h2" style={{ fontSize: "1.5rem" }}>Featured <span>Products</span></h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <button className="ab-arrow-btn" onClick={() => { scrollRef.current?.scrollBy({ left: -(CARD_W + GAP), behavior: "smooth" }); setPaused(true); setTimeout(() => setPaused(false), 2000); }}><ChevronLeft size={14} /></button>
          <button className="ab-arrow-btn" onClick={() => { scrollRef.current?.scrollBy({ left: CARD_W + GAP, behavior: "smooth" }); setPaused(true); setTimeout(() => setPaused(false), 2000); }}><ChevronRight size={14} /></button>
          <Link href="/products?featured=true" className="ab-viewall" style={{ fontSize: 12 }}>View All <IconArrowRight size={13} /></Link>
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${GOLD}22`, border: `1px solid ${GOLD}60`, color: GOLD, fontSize: 10, fontWeight: 700, letterSpacing: 2.2, textTransform: "uppercase", padding: "4px 12px", borderRadius: 20, marginBottom: 14 }}>
            <IconLeafSmall /> OUR PROMISE
          </div>
          <h2 className="ab-serif" style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.18, marginBottom: 10, maxWidth: "55%" }}>Supporting<br />Assam's Artisan<br /><span style={{ color: GOLD }}>Community</span></h2>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 11.5, lineHeight: 1.65, maxWidth: "55%", marginBottom: 20 }}>Every purchase directly supports local weavers, tea farmers, and craftspeople preserving centuries-old Assamese traditions.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[
              { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, value: "500+", label: "Artisans" },
              { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>, value: "1200+", label: "Products" },
              { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, value: "25+", label: "Districts" },
              { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill={GOLD}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, value: "4.8", label: "Avg Rating" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,.1)", borderRadius: 12, padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,.1)", backdropFilter: "blur(8px)" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{s.icon}</div>
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
  const items = [
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/></svg>, label: "Premium Assam Tea" },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0"/><path d="M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v2"/><path d="M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8"/><path d="M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15"/></svg>, label: "Handmade Handicrafts" },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/></svg>, label: "GI Tagged Products" },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "From Local Artisans" },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, label: "Pan India Delivery" },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>, label: "100% Authentic" },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l9 9M4.5 4.5l3 3M9 9l3 3M7 21c-1.657 0-3-1.343-3-3 0-2 2-4 5-7l-1-1c-3 3-5 5.5-5 8 0 2.761 2.239 5 5 5 2.761 0 5-2.239 5-5 0-1.5-.5-3-2-5l-1 1c1.5 2 2 3 2 4 0 1.657-1.343 3-3 3z"/></svg>, label: "Authentic Handloom" },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill={GOLD} stroke={GOLD} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>, label: "Pride of Assam" },
  ];

  const Sep = () => (
    <span style={{ color: GOLD, fontSize: 10, opacity: 0.5, flexShrink: 0 }}>✦</span>
  );

  const doubled = [...items, ...items];

  return (
    <div style={{
      background: `${G}08`,
      borderTop: `1px solid ${G}18`,
      borderBottom: `1px solid ${G}18`,
      padding: "12px 0",
      overflow: "hidden",
    }}>
      <div style={{ display: "flex", width: "max-content", animation: "ab-marquee 28s linear infinite", alignItems: "center", gap: 10 }}>
        {doubled.map((item, i) => (
          <React.Fragment key={i}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "7px 16px", borderRadius: 50,
              background: "#fff",
              border: `1px solid rgba(201,168,76,0.28)`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              fontSize: 12.5, fontWeight: 600, color: G,
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
              {item.icon}
              {item.label}
            </span>
            <Sep />
          </React.Fragment>
        ))}
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
  if (!products.length) return (
    <div style={{ textAlign: "center", padding: "36px 0", color: "#9ca3af" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><IconLeafSmall color="#9ca3af" /></div>
      <p style={{ fontSize: 13 }}>New arrivals coming soon!</p>
    </div>
  );
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{products.map((p: any) => <ProductCard key={p.id} product={p} />)}</div>;
}

// ─── TESTIMONIALS SECTION ─────────────────────────────────────────────────────
// Drop-in replacement for TestimonialsSection in home.tsx
// Uses existing tokens: G, GOLD, BG — no new dependencies needed.
// Requires Playfair Display (already imported via GlobalStyles).

const TESTIMONIALS_DATA = [
  {
    name: "Manoj Baruah",
    city: "Jorhat, Assam",
    rating: 5,
    verified: true,
    text: "Their Muga silk gamosa is a piece of art. You can feel the craftsmanship in every thread — worth every rupee.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80",
    initials: "MB",
  },
  {
    name: "Priya Das",
    city: "Guwahati, Assam",
    rating: 5,
    verified: true,
    text: "The quality of the products is exceptional! You can truly taste the authenticity of Assam in every bite.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
    initials: "PD",
  },
  {
    name: "Ananya Saikia",
    city: "Delhi",
    rating: 5,
    verified: true,
    text: "I love how they support local farmers and bring the best of Assam to our doorstep. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&q=80",
    initials: "AS",
  },
  {
    name: "Ritwik Sharma",
    city: "Bengaluru, Karnataka",
    rating: 5,
    verified: true,
    text: "Fast delivery, great packaging and super fresh products. ApunBazar is now my go-to store for Assamese goods.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80",
    initials: "RS",
  },
  {
    name: "Sneha Patil",
    city: "Pune, Maharashtra",
    rating: 5,
    verified: true,
    text: "Ordered Joha rice and bamboo shoot pickle — both tasted exactly like homemade Assamese food. Will order again!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80",
    initials: "SP",
  },
  {
    name: "Arif Hussain",
    city: "Kolkata, West Bengal",
    rating: 5,
    verified: true,
    text: "Customer support is genuinely helpful and packaging keeps everything fresh. A brand that actually cares.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&q=80",
    initials: "AH",
  },
];

// India map city pins: [city, x%, y%] relative to SVG viewBox 0 0 500 520
const MAP_PINS: [string, number, number][] = [
  ["Delhi",      188, 122],
  ["Guwahati",   378, 142],
  ["Jorhat",     398, 162],
  ["Kolkata",    320, 222],
  ["Mumbai",     135, 268],
  ["Pune",       148, 294],
  ["Bengaluru",  182, 356],
];

function IndiaMapBg() {
  return (
    <svg
      viewBox="0 0 500 520"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="tmapglow" cx="50%" cy="44%" r="52%">
          <stop offset="0%"  stopColor={G}    stopOpacity="0.10" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0.02" />
        </radialGradient>
        <filter id="tpinshadow">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor={GOLD} floodOpacity="0.6"/>
        </filter>
      </defs>

      {/* India outline — simplified path */}
      <path
        d="
          M242 22 L264 27 L285 36 L307 39 L325 44 L332 57
          L336 68 L332 79 L342 90 L350 97 L358 106
          L364 114 L372 122 L380 128 L390 132 L399 137
          L408 143 L413 154 L415 163 L411 172 L404 179
          L399 190 L400 201 L396 211 L388 220 L381 227
          L371 232 L364 240 L361 249 L356 257 L348 262
          L338 267 L327 273 L316 282 L306 293 L297 304
          L289 316 L282 328 L275 340 L268 352 L262 363
          L257 375 L252 387 L248 399 L244 411 L241 421
          L238 430 L235 439 L229 448 L224 456 L221 463
          L218 473 L219 482 L221 490 L219 499 L214 505
          L208 508 L202 506 L197 501 L193 495 L190 487
          L186 479 L182 471 L178 461 L174 451 L170 440
          L166 428 L162 416 L158 403 L154 390 L150 376
          L146 362 L142 347 L138 332 L135 317 L132 301
          L129 285 L127 269 L125 252 L124 235 L125 218
          L127 202 L131 188 L137 176 L145 166 L155 159
          L166 154 L177 150 L188 144 L196 137 L200 128
          L205 119 L212 113 L220 108 L231 104 L243 100
          L254 96 L264 90 L272 82 L276 72 L279 61
          L283 50 L289 40 L298 31 L308 24 L220 20 Z

          M219 499 L215 489 L210 480 L204 473 L198 469
          L192 467 L186 468 L181 472 L177 478 L175 484
          L176 490 L179 496 L184 501 L190 505 L197 507 Z
        "
        fill="url(#tmapglow)"
        stroke={G}
        strokeWidth="1"
        strokeOpacity="0.22"
        fillRule="evenodd"
      />

      {/* Subtle solid fill */}
      <path
        d="
          M242 22 L264 27 L285 36 L307 39 L325 44 L332 57
          L336 68 L332 79 L342 90 L350 97 L358 106
          L364 114 L372 122 L380 128 L390 132 L399 137
          L408 143 L413 154 L415 163 L411 172 L404 179
          L399 190 L400 201 L396 211 L388 220 L381 227
          L371 232 L364 240 L361 249 L356 257 L348 262
          L338 267 L327 273 L316 282 L306 293 L297 304
          L289 316 L282 328 L275 340 L268 352 L262 363
          L257 375 L252 387 L248 399 L244 411 L241 421
          L238 430 L235 439 L229 448 L224 456 L221 463
          L218 473 L219 482 L221 490 L219 499 L214 505
          L208 508 L202 506 L193 495 L186 479 L174 451
          L158 403 L142 347 L125 252 L125 218
          L131 188 L145 166 L166 154 L188 144 L200 128
          L212 113 L231 104 L254 96 L272 82 L279 61
          L289 40 L308 24 Z
        "
        fill={G}
        fillOpacity="0.035"
        stroke="none"
      />

      {/* City pins */}
      {MAP_PINS.map(([city, x, y]) => (
        <g key={city} filter="url(#tpinshadow)">
          {/* Pin body */}
          <path
            d={`M${x} ${y - 2}
                C${x - 6} ${y - 2} ${x - 6} ${y - 12} ${x} ${y - 12}
                C${x + 6} ${y - 12} ${x + 6} ${y - 2} ${x} ${y - 2}
                L${x} ${y + 4} Z`}
            fill={GOLD}
            fillOpacity="0.82"
          />
          <circle cx={x} cy={y - 7} r="2.8" fill="#fff" fillOpacity="0.92" />
          {/* Label */}
          <text
            x={x}
            y={y + 14}
            textAnchor="middle"
            fontSize="7.5"
            fontFamily="Georgia, serif"
            fill={G}
            fillOpacity="0.72"
            fontStyle="italic"
          >{city}</text>
        </g>
      ))}

      {/* Mountain deco — top right */}
      <g transform="translate(388, 36)" opacity="0.09">
        <polygon points="0,42 18,7 36,42"  fill={G}/>
        <polygon points="22,42 42,11 62,42" fill={G}/>
        <polygon points="44,42 60,18 76,42" fill={G}/>
      </g>

      {/* Tea garden row — bottom left */}
      <g transform="translate(18, 400)" opacity="0.11">
        {[0,1,2,3,4].map(i => (
          <ellipse
            key={i} cx={i * 18} cy={22 - (i % 2) * 6} rx="7" ry="4"
            fill={G} transform={`rotate(-18 ${i*18} ${22-(i%2)*6})`}
          />
        ))}
        <path d="M0 30 L90 30" stroke={G} strokeWidth="1.2"/>
      </g>
    </svg>
  );
}

function TestimonialsSection() {
  const reviews = TESTIMONIALS_DATA;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failedImgs, setFailedImgs] = useState<Record<number, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const isProgrammatic = useRef(false);
  const CARD_W = 252;
  const GAP = 14;
  const STEP = CARD_W + GAP;

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      isProgrammatic.current = true;
      if (el.scrollLeft >= maxScroll - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        setActive(0);
      } else {
        const next = Math.min(active + 1, reviews.length - 1);
        el.scrollTo({ left: next * STEP, behavior: "smooth" });
        setActive(next);
      }
    }, 4000);
    return () => clearInterval(t);
  }, [paused, active, reviews.length]);

  // Manual scroll tracking
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isProgrammatic.current) { isProgrammatic.current = false; return; }
        const idx = Math.round(el.scrollLeft / STEP);
        setActive(Math.min(Math.max(idx, 0), reviews.length - 1));
      }, 80);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); clearTimeout(timeout); };
  }, [reviews.length]);

  function goTo(idx: number) {
    const el = scrollRef.current;
    if (!el) return;
    isProgrammatic.current = true;
    el.scrollTo({ left: idx * STEP, behavior: "smooth" });
    setActive(idx);
    setPaused(true);
    setTimeout(() => setPaused(false), 5000);
  }

  return (
    <>
      {/* Section-scoped styles — appended once */}
      <style>{`
        .t-noscroll::-webkit-scrollbar { display: none; }
        .t-noscroll { scrollbar-width: none; -ms-overflow-style: none; }

        .t-dot {
          height: 7px; border-radius: 4px;
          border: none; cursor: pointer; padding: 0;
          transition: all 0.35s ease;
        }

        .t-card {
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.4s cubic-bezier(0.34,1.56,0.64,1),
                      border-color 0.3s ease;
        }

        .t-leaf-l {
          animation: t-sway 6s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .t-leaf-r {
          animation: t-sway 6s ease-in-out infinite reverse;
          transform-origin: bottom center;
        }
        @keyframes t-sway {
          0%,100% { rotate: -3deg; }
          50%      { rotate:  3deg; }
        }
        @keyframes t-quoteglow {
          0%,100% { opacity: 0.04; }
          50%      { opacity: 0.09; }
        }
        @media (prefers-reduced-motion: reduce) {
          .t-leaf-l, .t-leaf-r, .t-card { animation: none !important; transition: none !important; }
        }
      `}</style>

      <section
        style={{
          padding: "48px 0 36px",
          background: "#FAF8F2",
          overflow: "hidden",
          position: "relative",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >

        {/* ── India map background ─────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "3%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(600px, 96vw)",
            opacity: 0.08,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <IndiaMapBg />
        </div>

        {/* ── Giant ambient quote mark ─────────────────────────── */}
        <svg
          aria-hidden="true"
          style={{
            position: "absolute", top: 8, left: "50%",
            transform: "translateX(-50%)",
            animation: "t-quoteglow 4s ease-in-out infinite",
            pointerEvents: "none", zIndex: 0,
          }}
          width="160" height="160" viewBox="0 0 24 24" fill={GOLD}
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
        </svg>

        {/* ── Corner leaves ────────────────────────────────────── */}
        {(["left","right"] as const).map(side => (
          <svg
            key={side}
            aria-hidden="true"
            className={side === "left" ? "t-leaf-l" : "t-leaf-r"}
            style={{
              position: "absolute", top: 0, width: 72, opacity: 0.16,
              pointerEvents: "none", zIndex: 0,
              [side]: -8,
              ...(side === "right" ? { transform: "scaleX(-1)" } : {}),
            }}
            viewBox="0 0 40 60"
          >
            <path d="M20 55 C 8 40, 2 25, 8 12 C 14 0, 26 0, 32 12 C 38 25, 32 40, 20 55Z" fill={G} fillOpacity="0.5"/>
            <path d="M20 55 C 20 35, 20 15, 20 5" stroke={G} strokeWidth="0.8" strokeOpacity="0.5"/>
            <path d="M20 40 C 14 34, 10 28, 9 20" stroke={G} strokeWidth="0.6" strokeOpacity="0.4"/>
            <path d="M20 40 C 26 34, 30 28, 31 20" stroke={G} strokeWidth="0.6" strokeOpacity="0.4"/>
          </svg>
        ))}

        {/* ── Header ───────────────────────────────────────────── */}
        <div style={{
          textAlign: "center",
          marginBottom: 28,
          padding: "0 20px",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Eyebrow */}
          <p style={{
            color: GOLD,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "3.5px",
            textTransform: "uppercase",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}>
            <IconLeafSmall /> WHAT CUSTOMERS SAY <IconLeafSmall />
          </p>

          {/* Main heading */}
          <h2
            className="ab-serif"
            style={{
              fontSize: "clamp(1.9rem, 6vw, 2.5rem)",
              fontWeight: 800,
              color: "#111820",
              margin: "0 0 10px",
              lineHeight: 1.15,
              letterSpacing: "-0.4px",
            }}
          >
            Loved Across{" "}
            <span style={{ color: G }}>India</span>
            {" "}❤️
          </h2>

          {/* Gold ornament divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}80)` }} />
            <IconLeafSmall />
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${GOLD}80, transparent)` }} />
          </div>
        </div>

        {/* ── Card Carousel ────────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="t-noscroll"
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setTimeout(() => setPaused(false), 4500)}
          style={{
            display: "flex",
            gap: GAP,
            overflowX: "auto",
            padding: "8px 18px 12px",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            position: "relative",
            zIndex: 1,
          }}
        >
          {reviews.map((r, idx) => {
            const isActive = idx === active;
            return (
              <div
                key={r.name}
                className="t-card"
                style={{
                  flexShrink: 0,
                  width: CARD_W,
                  borderRadius: 26,
                  padding: "20px 18px 18px",
                  background: isActive
                    ? "rgba(255,255,255,0.96)"
                    : "rgba(255,255,255,0.78)",
                  backdropFilter: "blur(16px) saturate(1.3)",
                  WebkitBackdropFilter: "blur(16px) saturate(1.3)",
                  border: isActive
                    ? `1px solid ${GOLD}60`
                    : "1px solid rgba(193,123,62,0.18)",
                  boxShadow: isActive
                    ? `0 16px 44px rgba(26,90,50,0.13), 0 2px 8px rgba(201,168,76,0.14), inset 0 1px 0 rgba(255,255,255,0.9)`
                    : "0 3px 16px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
                  transform: isActive ? "translateY(-6px) scale(1.022)" : "translateY(0) scale(1)",
                  scrollSnapAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Glass inner highlight */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 26,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 55%)",
                  pointerEvents: "none",
                }} />

                {/* BG tea leaf */}
                <svg
                  aria-hidden="true"
                  style={{
                    position: "absolute", bottom: -10, right: -6,
                    width: 56, opacity: isActive ? 0.22 : 0.12,
                    transform: "rotate(14deg)",
                    pointerEvents: "none",
                    transition: "opacity 0.4s",
                  }}
                  viewBox="0 0 40 60"
                >
                  <path d="M20 55 C 8 40, 2 25, 8 12 C 14 0, 26 0, 32 12 C 38 25, 32 40, 20 55Z" fill={G} fillOpacity="0.5"/>
                  <path d="M20 55 C 20 35, 20 15, 20 5" stroke={G} strokeWidth="0.8" strokeOpacity="0.5"/>
                  <path d="M20 40 C 14 34, 10 28, 9 20" stroke={G} strokeWidth="0.6" strokeOpacity="0.4"/>
                  <path d="M20 40 C 26 34, 30 28, 31 20" stroke={G} strokeWidth="0.6" strokeOpacity="0.4"/>
                </svg>

                {/* Quote mark box */}
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: `${GOLD}1A`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 11,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={GOLD}>
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                  </svg>
                </div>

                {/* Stars + verified */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={GOLD}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  {r.verified && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 3,
                      fontSize: 8, fontWeight: 700, color: G,
                      background: `${G}15`,
                      border: `1px solid ${G}22`,
                      borderRadius: 100,
                      padding: "2px 7px",
                      letterSpacing: "0.7px",
                    }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill={G}>
                        <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/>
                      </svg>
                      VERIFIED
                    </div>
                  )}
                </div>

                {/* Review text */}
                <p style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 13,
                  lineHeight: 1.74,
                  color: "#2d2d2d",
                  margin: "0 0 16px",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical" as const,
                  overflow: "hidden",
                }}>
                  &ldquo;{r.text}&rdquo;
                </p>

                {/* Gold rule */}
                <div style={{
                  width: 26, height: 1.5,
                  background: `linear-gradient(90deg, ${GOLD}, transparent)`,
                  borderRadius: 2,
                  marginBottom: 13,
                }} />

                {/* Reviewer row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
                  <img
                    src={r.avatar}
                    alt={r.name}
                    style={{
                      width: 44, height: 44,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                      border: `2px solid ${GOLD}55`,
                      boxShadow: "0 3px 10px rgba(26,90,50,0.12)",
                      display: failedImgs[idx] ? "none" : "block",
                    }}
                    onError={() => setFailedImgs(prev => ({ ...prev, [idx]: true }))}
                  />
                  {failedImgs[idx] && (
                    <div style={{
                      width: 44, height: 44,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${G}, #2A7A3A)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 700, fontSize: 17,
                      flexShrink: 0,
                      border: `2px solid ${GOLD}55`,
                      boxShadow: "0 3px 10px rgba(26,90,50,0.12)",
                    }}>
                      {r.initials}
                    </div>
                  )}
                  <div>
                    <p style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#1a1a1a",
                      margin: 0,
                      letterSpacing: "-0.1px",
                    }}>
                      {r.name}
                    </p>
                    <p style={{
                      fontSize: 10.5,
                      color: "#888",
                      margin: "2px 0 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}>
                      <IconMapPin size={9} /> {r.city}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Dot indicators ───────────────────────────────────── */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 7,
          margin: "6px 0 22px",
          position: "relative",
          zIndex: 1,
        }}>
          {reviews.map((_, i) => (
            <button
              key={i}
              className="t-dot"
              onClick={() => goTo(i)}
              aria-label={`Review ${i + 1}`}
              style={{
                width: i === active ? 22 : 7,
                background: i === active ? G : `${GOLD}55`,
              }}
            />
          ))}
        </div>

        {/* ── Trust stats bar ──────────────────────────────────── */}
        <div style={{
          margin: "0 16px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 18,
          padding: "14px 12px",
          border: `1px solid ${GOLD}28`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ display: "flex" }}>
            {([
              {
                label: "4.9 / 5",
                sub: "2,400+ reviews",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={GOLD}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ),
              },
              {
                label: "Pan India",
                sub: "Fast delivery",
                icon: <IconTruck />,
              },
              {
                label: "Secure Pay",
                sub: "100% safe",
                icon: <IconShield />,
              },
              {
                label: "500+ Artisans",
                sub: "Direct source",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                ),
              },
            ] as { label: string; sub: string; icon: React.ReactNode }[]).map((b, i) => (
              <div
                key={b.label}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "0 4px",
                  borderRight: i < 3 ? `1px solid ${GOLD}20` : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{b.icon}</div>
                <p style={{ fontWeight: 700, fontSize: 9.5, color: "#111820", lineHeight: 1.2, margin: 0 }}>{b.label}</p>
                <p style={{ fontSize: 8.5, color: "#9ca3af", margin: "2px 0 0" }}>{b.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom garden silhouette ─────────────────────────── */}
        <svg
          aria-hidden="true"
          viewBox="0 0 430 36"
          preserveAspectRatio="none"
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            width: "100%", height: 36,
            opacity: 0.055, pointerEvents: "none", zIndex: 0,
          }}
        >
          <path d="M0 36 L0 24 Q22 12 44 22 Q66 32 88 18 Q110 4 132 16 Q154 28 176 14 Q198 0 220 12 Q242 24 264 10 Q286 -4 308 8 Q330 20 352 6 Q374 -8 396 6 L430 10 L430 36 Z" fill={G}/>
        </svg>

      </section>
    </>
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
        <div>
          <p className="ab-label"><IconLeafSmall /> RECENTLY VIEWED</p>
          <h2 className="ab-h2" style={{ fontSize: "1.25rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: 6 }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            VIEWED
          </h2>
        </div>
        <Link href="/products" className="ab-viewall" style={{ fontSize: 12 }}>See all <IconArrowRight size={13} /></Link>
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
      <ExperienceAssamSection />
      <HeritageMarquee />
      <section style={{ padding: "24px 16px 20px", background: BG }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
          <div><p className="ab-label"><IconLeafSmall /> NEW ARRIVALS</p><h2 className="ab-h2">Latest From Our <span>Artisans</span></h2></div>
          <Link href="/products" className="ab-viewall">View All <IconArrowRight size={14} /></Link>
        </div>
        <NewArrivalsSection />
      </section>
      <TestimonialsSection />
      <RecentlyViewedSection />
    </div>
  );
}
