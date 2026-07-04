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
import { useSession } from "@/hooks/use-session";
import { useInvalidateCart, useInvalidateWishlist, useWishlist } from "@/hooks/use-shop-data";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewSystem from "@/components/reviews/ReviewSystem";
import { ShareButtons } from "@/components/ShareButtons";
import { trackViewItem, trackAddToCart, trackAddToWishlist } from "@/lib/analytics";
import { NotifyMe } from "@/components/NotifyMe";

const G = "#1a5a32";
const GOLD = "#c9a84c";
const WA_NUM = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "919395722454";

const WA_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L0 24l6.326-1.506A11.926 11.926 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-4.989-1.367l-.358-.213-3.716.885.917-3.617-.233-.372A9.79 9.79 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
  </svg>
);


// ─── STAR RATING ──────────────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1,2,3,4,5].map(i => {
          const fill = Math.min(1, Math.max(0, rating - (i - 1)));
          return (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24">
              <defs>
                <linearGradient id={`star-${i}-${Math.round(rating*10)}`}>
                  <stop offset={`${fill*100}%`} stopColor={GOLD} />
                  <stop offset={`${fill*100}%`} stopColor="#e0e0e0" />
                </linearGradient>
              </defs>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill={`url(#star-${i}-${Math.round(rating*10)})`} />
            </svg>
          );
        })}
      </div>
      <span style={{ fontSize: 13, color: "#535766", fontFamily: "'Nunito',sans-serif" }}>
        ({count} Reviews)
      </span>
      <span style={{ fontSize: 12, color: "#535766", fontFamily: "'Nunito',sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ color: G }}>🛡</span> 100% Authentic
      </span>
    </div>
  );
}





// ─── FAQ DATA ─────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Is this product 100% authentic from Assam?", a: "Yes, every product on ApunBazar is sourced directly from verified artisans, farmers, and producers in Assam. We visit our partners personally to ensure authenticity." },
  { q: "How long does delivery take?", a: "Standard delivery takes 4–7 business days across India. Express delivery (2–3 days) is available for select pincodes. You will receive tracking details via SMS/email once shipped." },
  { q: "What is the return policy?", a: "We offer a 7-day easy return policy. If you are not satisfied with your purchase, contact us within 7 days of delivery and we will arrange a pickup and full refund." },
  { q: "Can I order in bulk for gifting or reselling?", a: "Absolutely! We offer bulk pricing for orders above ₹5,000. Contact us on WhatsApp or email for wholesale pricing and custom packaging options." },
];

// ─── ACCORDION ────────────────────────────────────────────────────────────────
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid #f0ece4" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 700, color: "#282c3f", textAlign: "left" }}>
        {title}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94969f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .25s", flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 20px 18px", fontSize: 14, color: "#535766", fontFamily: "'Nunito',sans-serif", lineHeight: 1.7 }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── ORDER TIMELINE ───────────────────────────────────────────────────────────
const TIMELINE_IMGS = [
  { label: "Order Placed",       img: "", icon: "📦" },
  { label: "Order Shipped",      img: "", icon: "🚚" },
  { label: "Estimated Delivery", img: "", icon: "🏠" },
];

function OrderTimeline() {
  const deliveryDate = new Date(Date.now() + 6 * 86400000).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "16px 0 4px", overflowX: "auto" }}>
      {TIMELINE_IMGS.map((step, i) => (
        <div key={step.label} style={{ display: "flex", alignItems: "center", flex: i < 2 ? "1" : "0" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, minWidth: 80 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f0faf4", border: `2px solid ${G}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {step.img
                ? <img src={step.img} alt={step.label} style={{ width: 26, height: 26, objectFit: "contain" }} />
                : <span style={{ fontSize: 20 }}>{step.icon}</span>
              }
            </div>
            <p style={{ fontSize: 10, color: "#535766", fontFamily: "'Nunito',sans-serif", fontWeight: 700, margin: "6px 0 0", textAlign: "center", lineHeight: 1.3 }}>{step.label}</p>
            {i === 2 && <p style={{ fontSize: 10, color: G, fontFamily: "'Nunito',sans-serif", fontWeight: 800, margin: "2px 0 0" }}>{deliveryDate}</p>}
          </div>
          {i < 2 && <div style={{ flex: 1, height: 2, background: `linear-gradient(to right, ${G}, #c3e6cb)`, margin: "0 6px", marginBottom: 18 }} />}
        </div>
      ))}
    </div>
  );
}

// ─── TRUST BAR ────────────────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { img: "", label: "Free Shipping", sub: "Above ₹499", id: "trust-shipping" },
    { img: "", label: "Secure Pay", sub: "100% Safe", id: "trust-secure" },
    { img: "", label: "Authentic", sub: "From Assam", id: "trust-authentic" },
    { img: "", label: "7-Day Return", sub: "Easy Refund", id: "trust-return" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "#f9fdf9", borderTop: "1px solid #e8f5ee", borderBottom: "1px solid #e8f5ee", padding: "12px 0" }}>
      {items.map(it => (
        <div key={it.label} style={{ textAlign: "center", padding: "0 4px" }}>
          <div style={{ width: 40, height: 40, margin: "0 auto 5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {it.img
              ? <img src={it.img} alt={it.label} style={{ width: 40, height: 40, objectFit: "contain" }} />
              : <div style={{ width: 40, height: 40, background: "#e8f5ee", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🖼️</div>
            }
          </div>
          <p style={{ fontSize: 9.5, fontWeight: 800, color: "#282c3f", margin: 0, fontFamily: "'Nunito',sans-serif", lineHeight: 1.3 }}>{it.label}</p>
          <p style={{ fontSize: 9, color: "#94969f", margin: 0, fontFamily: "'Nunito',sans-serif" }}>{it.sub}</p>
        </div>
      ))}
    </div>
  );
}




// ─── SPOTLIGHTS SECTION ──────────────────────────────────────────────────────
const SPOTLIGHTS = [
  { title: "Meet Our Artisans",         duration: "2:34", thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { title: "Handloom Weaving Process",  duration: "3:12", thumb: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=400&q=80" },
  { title: "Story Behind the Gamusa",   duration: "1:58", thumb: "https://images.unsplash.com/photo-1601379760883-1bb497c558e0?w=400&q=80" },
  { title: "Making of Mekhela Chador",  duration: "4:05", thumb: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=400&q=80" },
  { title: "Tea Garden Journey",        duration: "2:47", thumb: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80" },
  { title: "Assam Craft Heritage",      duration: "3:29", thumb: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80" },
];

const SG = "#234B2A";
const SGOLD = "#C89B3C";
const SIVORY = "#F8F5EE";

function SpotlightsSection() {
  const [visible, setVisible] = useState(false);
  const [founderVis, setFounderVis] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);

  // Intersection observers
  useEffect(() => {
    const obs1 = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs1.disconnect(); } }, { threshold: 0.1 });
    const obs2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setFounderVis(true); obs2.disconnect(); } }, { threshold: 0.15 });
    if (sectionRef.current)  obs1.observe(sectionRef.current);
    if (founderRef.current)  obs2.observe(founderRef.current);
    return () => { obs1.disconnect(); obs2.disconnect(); };
  }, []);

  function scrollCarousel(dir: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = 160 + 14; // card width + gap
    el.scrollBy({ left: dir * cardW * 2, behavior: "smooth" });
    setActiveIdx(i => Math.max(0, Math.min(SPOTLIGHTS.length - 1, i + dir * 2)));
  }

  return (
    <div style={{ background: SIVORY, borderTop: "8px solid #f0ebe0", overflow: "hidden" }}>

     

        {/* Carousel */}
        <div
          ref={scrollRef}
          style={{
            display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory",
            padding: "0 20px 20px", scrollbarWidth: "none",
            opacity: visible ? 1 : 0, transition: "opacity .7s ease .15s",
          }}
        >
          {SPOTLIGHTS.map((sp, i) => (
            <div key={sp.title} style={{
              flexShrink: 0, width: 160,
              scrollSnapAlign: "start",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(20px)",
              transition: `opacity .5s ease ${i * 0.08 + 0.2}s, transform .5s ease ${i * 0.08 + 0.2}s`,
            }}>
              {/* 9:16 card */}
              <div style={{
                width: 160, height: 285,
                borderRadius: 22, overflow: "hidden",
                position: "relative", cursor: "pointer",
                boxShadow: "0 8px 28px rgba(35,75,42,0.18)",
                transition: "transform .25s ease, box-shadow .25s ease",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(35,75,42,0.25)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(35,75,42,0.18)"; }}
              >
                {/* Thumbnail */}
                <img
                  src={sp.thumb}
                  alt={sp.title}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* Dark gradient */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />

                {/* Play button */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 48, height: 48, borderRadius: "50%",
                  background: "rgba(255,255,255,0.92)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={SG}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>

                {/* Duration badge */}
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  background: "rgba(0,0,0,0.62)", backdropFilter: "blur(6px)",
                  borderRadius: 10, padding: "3px 8px",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: "'Nunito',sans-serif" }}>{sp.duration}</span>
                </div>

                {/* Title at bottom */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 12px 14px" }}>
                  <p style={{ margin: 0, fontSize: 11.5, fontWeight: 800, color: "#fff", fontFamily: "'Nunito',sans-serif", lineHeight: 1.35 }}>{sp.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingBottom: 24 }}>
          {SPOTLIGHTS.map((_, i) => (
            <div key={i} style={{
              width: i === activeIdx ? 20 : 6, height: 6, borderRadius: 3,
              background: i === activeIdx ? SG : "#d0c8b8",
              transition: "all .3s ease",
            }} />
          ))}
        </div>
      </div>

      {/* ── Gold divider ── */}
      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${SGOLD}, transparent)`, margin: "0 24px 32px", opacity: 0.5 }} />

      {/* ─── FOUNDER SECTION ────────────────────────────────── */}
      <div ref={founderRef} style={{
        margin: "0 16px 28px",
        borderRadius: 24,
        background: "#fff",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(35,75,42,0.10)",
        border: `1px solid rgba(200,155,60,0.18)`,
        opacity: founderVis ? 1 : 0,
        transform: founderVis ? "none" : "translateY(20px)",
        transition: "opacity .7s ease, transform .7s ease",
      }}>

        {/* Watercolour banner */}
        <div style={{
          height: 180, position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, #e8f5ee 0%, #d4ead8 40%, #f5f0e0 100%)`,
        }}>
          {/* Soft brush strokes */}
          <div style={{ position: "absolute", inset: 0 }}>
            <div style={{ position: "absolute", top: -30, left: -30, width: 180, height: 180, borderRadius: "50%", background: "rgba(35,75,42,0.08)", filter: "blur(30px)" }} />
            <div style={{ position: "absolute", bottom: -20, right: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(200,155,60,0.12)", filter: "blur(25px)" }} />
            <div style={{ position: "absolute", top: 20, right: 40, width: 100, height: 100, borderRadius: "50%", background: "rgba(35,75,42,0.06)", filter: "blur(20px)" }} />
          </div>

          {/* Gamusa pattern overlay */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 8,
            background: `repeating-linear-gradient(90deg, ${SGOLD} 0,${SGOLD} 10px,#fff 10px,#fff 16px,${SG} 16px,${SG} 26px,#fff 26px,#fff 32px)`,
            opacity: 0.5,
          }} />

          

        {/* Text content */}
        <div style={{ padding: "22px 20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ height: 1.5, width: 20, background: SGOLD }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: SGOLD, fontFamily: "'Nunito',sans-serif", textTransform: "uppercase" }}>Our Story</span>
          </div>

          <h3 style={{ margin: "0 0 12px", fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 800, color: SG, lineHeight: 1.25 }}>
            Keeping Assam's<br />Heritage Alive
          </h3>

          <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "#555", fontFamily: "'Nunito',sans-serif", lineHeight: 1.75 }}>
            Every Pride of Assam product is handcrafted by skilled Assamese artisans using traditional weaving techniques passed down through generations. Your purchase directly supports local families and preserves the rich cultural heritage of Assam.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 0, marginBottom: 20, borderRadius: 14, overflow: "hidden", border: `1px solid #eee` }}>
            {[
              { num: "500+", label: "Artisans" },
              { num: "10K+", label: "Families" },
              { num: "15+", label: "Districts" },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                flex: 1, textAlign: "center", padding: "12px 8px",
                borderRight: i < 2 ? "1px solid #eee" : "none",
                background: i % 2 === 1 ? `${SIVORY}` : "#fff",
              }}>
                <p style={{ margin: 0, fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 800, color: SG }}>{stat.num}</p>
                <p style={{ margin: 0, fontSize: 10, color: "#888", fontFamily: "'Nunito',sans-serif", fontWeight: 700 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <a href="/about" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            height: 48, borderRadius: 12,
            border: `2px solid ${SG}`, background: "transparent",
            fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 800,
            color: SG, textDecoration: "none",
            transition: "background .2s, color .2s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = SG; el.style.color = "#fff"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.color = SG; }}
          >
            Meet Our Artisans
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Gamusa bottom strip ── */}
      <div style={{ height: 5, background: `repeating-linear-gradient(90deg, ${SGOLD} 0,${SGOLD} 10px,#fff 10px,#fff 16px,${SG} 16px,${SG} 26px,#fff 26px,#fff 32px)`, opacity: 0.65 }} />

      <style>{`
        div[data-spotcarousel]::-webkit-scrollbar { display: none; }
        @keyframes spotFloat { 0%,100%{transform:translateY(0) rotate(-20deg)} 50%{transform:translateY(-6px) rotate(-15deg)} }
      `}</style>
    </div>
  );
}

// ─── RELATED PRODUCTS ─────────────────────────────────────────────────────────
function YouMightAlsoLike({ products, onNavigate }: { products: any[]; onNavigate: (id: number) => void }) {
  if (!products.length) return null;
  return (
    <div style={{ background: "#fff", borderTop: "8px solid #f5f5f6", padding: "20px 0" }}>
      <div style={{ padding: "0 20px", marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: "#94969f", letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "'Nunito',sans-serif" }}>YOU MIGHT ALSO LIKE</p>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 20px 4px", scrollbarWidth: "none" }}>
        {products.map(p => {
          const disc = p.originalPrice && Number(p.originalPrice) > Number(p.price) ? Math.round((1 - Number(p.price) / Number(p.originalPrice)) * 100) : 0;
          return (
            <div key={p.id} onClick={() => onNavigate(p.id)} style={{ flexShrink: 0, width: 140, cursor: "pointer" }}>
              <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", marginBottom: 8, background: "#f5f5f6" }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: 140, height: 170, objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/140x170/f5f5f6/282c3f?text=${encodeURIComponent(p.name.slice(0, 4))}`; }} />
                {disc >= 5 && <div style={{ position: "absolute", top: 8, left: 0, background: "#ff3f6c", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 8px", fontFamily: "'Nunito',sans-serif" }}>SAVE {disc}%</div>}
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#282c3f", margin: "0 0 3px", fontFamily: "'Nunito',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
              {p.originalPrice && <p style={{ fontSize: 10, color: "#94969f", textDecoration: "line-through", margin: "0 0 1px", fontFamily: "'Nunito',sans-serif" }}>₹{Number(p.originalPrice).toLocaleString("en-IN")}</p>}
              <p style={{ fontSize: 13, fontWeight: 800, color: "#282c3f", margin: 0, fontFamily: "'Nunito',sans-serif" }}>₹{Number(p.price).toLocaleString("en-IN")}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── KASUTAM FAQ ─────────────────────────────────────────────────────────────
function KasutamFAQ({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {faqs.map(({ q, a }, i) => (
        <div key={q} style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          {/* Question header */}
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "14px 16px",
              background: G,
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 13.5,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.4,
              flex: 1,
            }}>
              {q}
            </span>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "#fff",
              fontSize: 20,
              fontWeight: 300,
              lineHeight: 1,
            }}>
              {open === i ? "−" : "+"}
            </div>
          </button>

          {/* Answer */}
          {open === i && (
            <div style={{
              background: "#fff",
              padding: "14px 16px",
              fontSize: 13.5,
              color: "#282c3f",
              fontFamily: "'Nunito', sans-serif",
              lineHeight: 1.75,
            }}>
              {a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── KASUTAM-STYLE DETAIL TABS ───────────────────────────────────────────────
const DETAIL_TABS = [
  { id: "description",   label: "Description" },
  { id: "method",        label: "How It's Made" },
  { id: "why",           label: "Why ApunBazar?" },
  { id: "ingredients",   label: "Ingredients & Benefits" },
  { id: "how_to_use",    label: "How to Use" },
  { id: "storage",       label: "Storage Info" },
];

function KasutamDetailTabs({ product }: { product: any }) {
  const [active, setActive] = useState("description");

  const contentMap: Record<string, React.ReactNode> = {
    description: (
      <div>
        <p style={{ margin: "0 0 12px", lineHeight: 1.75 }}>{product.description}</p>
        {product.artisan && (
          <p style={{ margin: 0, color: G, fontWeight: 700, fontSize: 13 }}>
            🧑‍🎨 Crafted by <strong>{product.artisan}</strong>
            {product.origin ? ` · ${product.origin}` : ""}
          </p>
        )}
      </div>
    ),
    method: (
      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 2 }}>
        <li>Sourced directly from local artisans and farmers in Assam</li>
        <li>Traditional methods passed down through generations</li>
        <li>No mass production — every batch is small and carefully crafted</li>
        <li>Quality checked before packaging and dispatch</li>
        <li>Packed hygienically to preserve freshness and authenticity</li>
      </ul>
    ),
    why: (
      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 2 }}>
        <li>100% authentic products directly from Assam</li>
        <li>We personally visit and verify every partner artisan</li>
        <li>Fair price guaranteed — no middlemen</li>
        <li>Supporting local communities and preserving Assamese heritage</li>
        <li>7-day easy return policy — zero hassle</li>
        <li>Thousands of happy customers across India 🇮🇳</li>
      </ul>
    ),
    ingredients: (
      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 2 }}>
        <li>100% pure and natural {product.categoryName?.toLowerCase() ?? "product"} from Assam</li>
        <li>No artificial additives, preservatives, or synthetic colors</li>
        <li>No harmful chemicals or pesticides used</li>
        <li>Rich in natural nutrients and traditional goodness</li>
        <li>GI Tagged — certified origin from Assam</li>
      </ul>
    ),
    how_to_use: (
      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 2 }}>
        <li>Follow the instructions on the packaging for best results</li>
        <li>Use a clean and dry spoon or hands every time</li>
        <li>Do not allow water or moisture to enter the container</li>
        <li>Suitable for daily use by all age groups</li>
        <li>Best experienced fresh — consume within recommended period after opening</li>
      </ul>
    ),
    storage: (
      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 2 }}>
        <li>Store in a cool, dry place away from direct sunlight and moisture</li>
        <li>Keep the container tightly closed after every use</li>
        <li>Always use a clean and dry spoon</li>
        <li>Do not allow water or moisture to enter the container</li>
        <li>Natural texture may change with weather — this is normal</li>
        <li>Best used before the date mentioned on the label</li>
        <li>For best aroma and taste, consume sooner after opening</li>
      </ul>
    ),
  };

  return (
    <div style={{ background: "#fff", borderTop: "8px solid #f5f5f6" }}>
      {/* Tab grid — 2 columns like kasutam */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "16px 16px 0" }}>
        {DETAIL_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: "12px 8px",
              borderRadius: 10,
              border: active === tab.id ? `2px solid ${G}` : "2px solid #e8e8e8",
              background: active === tab.id ? G : "#fff",
              color: active === tab.id ? "#fff" : "#282c3f",
              fontFamily: "'Nunito',sans-serif",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              textAlign: "center",
              lineHeight: 1.3,
              transition: "all .2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div style={{
        margin: "14px 16px 16px",
        background: "#fafdf9",
        border: "1px solid #e8f5ee",
        borderRadius: 12,
        padding: "16px",
        fontSize: 13.5,
        color: "#282c3f",
        fontFamily: "'Nunito',sans-serif",
        lineHeight: 1.7,
        minHeight: 120,
      }}>
        {contentMap[active]}
      </div>

      {/* Specs row */}
      {[
        ["Category", product.categoryName],
        product.artisan ? ["Artisan", product.artisan] : null,
        product.origin  ? ["Origin",  product.origin]  : null,
        ["In Stock", product.stock > 0 ? `${product.stock} units` : "Out of Stock"],
      ].filter(Boolean).length > 0 && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 12, overflow: "hidden" }}>
            {[
              ["Category", product.categoryName],
              product.artisan ? ["Artisan", product.artisan] : null,
              product.origin  ? ["Origin",  product.origin]  : null,
              ["In Stock", product.stock > 0 ? `${product.stock} units` : "Out of Stock"],
              ...(product.tags ?? []).map((t: string) => ["Tag", t]),
            ].filter(Boolean).map(([k, v], i, arr) => (
              <div key={String(k)} style={{
                display: "flex",
                padding: "10px 14px",
                borderBottom: i < arr.length - 1 ? "1px solid #f5f5f5" : "none",
                background: i % 2 === 0 ? "#fff" : "#fafafa",
              }}>
                <span style={{ width: 120, fontSize: 12, color: "#94969f", fontFamily: "'Nunito',sans-serif", fontWeight: 700, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 12, color: "#282c3f", fontFamily: "'Nunito',sans-serif", fontWeight: 800 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LOADING ──────────────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ background: "#fff" }}>
      <Skeleton className="w-full" style={{ aspectRatio: "1/1" }} />
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-7 w-4/5 rounded" />
        <Skeleton className="h-5 w-1/2 rounded" />
        <Skeleton className="h-10 w-2/5 rounded" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [cartCount, setCartCount] = useState(0);
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
  const discount = product?.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const savings = product?.originalPrice ? product.originalPrice - product.price : 0;
  const images = product ? [product.imageUrl, ...(product.images ?? [])].filter(Boolean) : [];

  function waUrl(name: string, price: number, includeLink = false) {
    const text = `Hi! I want to order: ${name} (₹${price})${includeLink ? "\n" + window.location.href : ""}`;
    return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(text)}`;
  }

  function handleAddToCart(then?: () => void) {
    if (!sessionId || !product) return;
    addToCart.mutate(
      { data: { sessionId, productId: product.id, quantity } },
      {
        onSuccess: () => {
          invalidateCart();
          setCartCount(c => c + quantity);
          trackAddToCart({ id: product.id, name: product.name, price: product.price, category: product.categoryName, quantity });
          toast({ title: "Added to cart! 🛍️", description: `${quantity}× ${product.name}` });
          then?.();
        },
      }
    );
  }

  function handleAddToWishlist() {
    if (!sessionId || !product) return;
    addToWishlist.mutate(
      { data: { sessionId, productId: product.id } },
      {
        onSuccess: () => {
          invalidateWishlist();
          trackAddToWishlist({ id: product.id, name: product.name, price: product.price, category: product.categoryName });
          toast({ title: "Saved to wishlist! ❤️" });
        },
      }
    );
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
  }, [product]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .pdp-wrap { background: #fff; padding-bottom: 104px; }
        .pdp-topbar { position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid #f0ece4;display:flex;align-items:center;justify-content:space-between;padding:0 16px;height:54px; }
        .pdp-back { display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#282c3f;font-family:'Nunito',sans-serif;background:none;border:none;cursor:pointer;padding:0; }
        .pdp-logo { font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#1a3a22; }
        .pdp-logo span { color:${GOLD}; }
        .pdp-img-scroll { display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none; }
        .pdp-img-scroll::-webkit-scrollbar { display:none; }
        .pdp-img-slide { flex-shrink:0;width:100%;scroll-snap-align:start; }
        .pdp-main-img { width:100%;aspect-ratio:1/1;object-fit:cover;display:block; }
        .pdp-thumb-strip { display:flex;gap:8px;overflow-x:auto;padding:10px 16px;background:#fafafa;scrollbar-width:none;border-bottom:1px solid #f0ece4; }
        .pdp-thumb-strip::-webkit-scrollbar { display:none; }
        .pdp-thumb { width:52px;height:52px;object-fit:cover;border-radius:8px;cursor:pointer;border:2px solid transparent;flex-shrink:0;transition:border-color .2s; }
        .pdp-thumb.active { border-color:${G}; }
        .pdp-info { padding:18px 20px 14px; }
        .pdp-eyebrow { font-size:11px;font-weight:800;color:${G};font-family:'Nunito',sans-serif;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap; }
        .pdp-name { font-size:21px;font-weight:900;color:#1a1a2e;font-family:'Nunito',sans-serif;line-height:1.25;margin-bottom:6px; }
        .pdp-artisan { font-size:13px;color:#535766;font-family:'Nunito',sans-serif;margin-bottom:10px; }
        .pdp-rating-chip { display:inline-flex;align-items:center;gap:5px;background:${G};color:#fff;font-size:13px;font-weight:800;padding:5px 10px;border-radius:7px;font-family:'Nunito',sans-serif; }
        .pdp-price-section { padding:16px 20px;background:#fff;border-top:1px solid #f5f5f6; }
        .pdp-price-row { display:flex;align-items:flex-start;justify-content:space-between;gap:10px; }
        .pdp-price-left { flex:1; }
        .pdp-price-main { font-size:34px;font-weight:900;color:#1a1a2e;font-family:'Nunito',sans-serif;line-height:1; }
        .pdp-price-orig { font-size:17px;color:#94969f;text-decoration:line-through;font-family:'Nunito',sans-serif;margin-left:8px; }
        .pdp-disc-badge { display:inline-block;background:#ff6b6b;color:#fff;font-size:13px;font-weight:900;padding:4px 10px;border-radius:6px;font-family:'Nunito',sans-serif;margin-left:6px; }
        .pdp-save-line { font-size:14px;font-weight:800;color:${G};font-family:'Nunito',sans-serif;margin-top:6px; }
        .pdp-qty { display:flex;align-items:center;border:2px solid #e0e0e0;border-radius:8px;overflow:hidden;width:fit-content; }
        .pdp-qty-btn { width:44px;height:44px;background:#f5f5f6;border:none;font-size:20px;color:#282c3f;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:'Nunito',sans-serif;font-weight:700;transition:background .15s; }
        .pdp-qty-btn:hover:not(:disabled) { background:#e8e8e8; }
        .pdp-qty-btn:disabled { opacity:.3;cursor:default; }
        .pdp-qty-num { width:52px;height:44px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#282c3f;font-family:'Nunito',sans-serif;border-left:1px solid #e0e0e0;border-right:1px solid #e0e0e0; }
        .pdp-cta { padding:16px 20px;background:#fff;border-top:1px solid #f0ece4;display:flex;flex-direction:column;gap:10px; }
        .pdp-btn-cart { height:52px;background:#fff;border:2px solid #1a1a2e;border-radius:10px;font-size:15px;font-weight:800;color:#1a1a2e;font-family:'Nunito',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s; }
        .pdp-btn-cart:hover { background:#f5f5f6; }
        .pdp-btn-buynow { height:52px;background:${GOLD};border:none;border-radius:10px;font-size:15px;font-weight:900;color:#1a1a2e;font-family:'Nunito',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 18px rgba(201,168,76,.4);transition:all .2s; }
        .pdp-btn-buynow:hover { transform:translateY(-1px); }
        .pdp-btn-wa { height:52px;background:#25D366;border:none;border-radius:10px;font-size:15px;font-weight:800;color:#fff;font-family:'Nunito',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none; }
        .pdp-sticky { position:fixed;bottom:0;left:0;right:0;z-index:100;background:#fff;border-top:1px solid #eee;padding:10px 16px;display:flex;gap:8px;align-items:center; }
        .pdp-tabs { display:flex;background:#fff;border-bottom:2px solid #f0f0f0;position:sticky;top:54px;z-index:40; }
        .pdp-tab { flex:1;padding:14px 0;text-align:center;font-size:12.5px;font-weight:800;font-family:'Nunito',sans-serif;color:#94969f;cursor:pointer;border:none;background:none;position:relative;letter-spacing:.4px; }
        .pdp-tab.active { color:#1a1a2e; }
        .pdp-tab.active::after { content:'';position:absolute;bottom:-2px;left:15%;right:15%;height:3px;background:${G};border-radius:2px; }
        .pdp-dot { height:6px;border-radius:3px;cursor:pointer;border:none;padding:0;transition:all .3s; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
        .pdp-fadein { animation:fadeIn .3s ease; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div className="pdp-topbar">
        <button className="pdp-back" onClick={() => navigate("/products")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <span className="pdp-logo">Apun<span>Bazar</span></span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {product && <ShareButtons productName={product.name} price={product.price} />}
          <Link href="/cart" style={{ position: "relative", color: "#282c3f" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.66a2 2 0 001.98-1.71L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <div style={{ position: "absolute", top: -6, right: -6, width: 16, height: 16, borderRadius: "50%", background: GOLD, color: "#111", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif" }}>{cartCount}</div>
            )}
          </Link>
        </div>
      </div>

      {isLoading ? <LoadingSkeleton /> : !product ? (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#282c3f", fontFamily: "'Nunito',sans-serif", marginBottom: 12 }}>Product nahi mila</p>
          <button onClick={() => navigate("/products")} style={{ padding: "12px 28px", background: G, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Browse Products</button>
        </div>
      ) : (
        <div className="pdp-wrap pdp-fadein">

          {/* ── IMAGE GALLERY ── */}
          <div style={{ position: "relative", background: "#f8f6f0" }}>
            {discount >= 5 && (
              <div style={{ position: "absolute", top: 0, left: 0, zIndex: 5, background: "#ff3f6c", color: "#fff", fontSize: 11, fontWeight: 900, padding: "5px 14px", fontFamily: "'Nunito',sans-serif" }}>
                SAVE {discount}%
              </div>
            )}
            <button onClick={handleAddToWishlist} style={{ position: "absolute", top: 12, right: 12, zIndex: 5, width: 40, height: 40, borderRadius: "50%", background: "#fff", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20, boxShadow: "0 2px 8px rgba(0,0,0,.12)" }}>
              {isInWishlist ? "❤️" : "🤍"}
            </button>
            <div ref={imgScrollRef} className="pdp-img-scroll" onScroll={e => { const el = e.currentTarget; setCurrentSlide(Math.round(el.scrollLeft / el.offsetWidth)); }}>
              {images.length > 0 ? images.map((img, i) => (
                <div key={i} className="pdp-img-slide">
                  <img src={img} alt={`${product.name} ${i + 1}`} className="pdp-main-img" onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/600x600/f5f5f6/282c3f?text=${encodeURIComponent(product.name.slice(0, 6))}`; }} />
                </div>
              )) : (
                <div className="pdp-img-slide">
                  <img src={product.imageUrl} alt={product.name} className="pdp-main-img" onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/600x600/f5f5f6/282c3f?text=${encodeURIComponent(product.name.slice(0, 6))}`; }} />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
                {images.map((_, i) => (
                  <button key={i} className="pdp-dot" style={{ width: i === currentSlide ? 22 : 6, background: i === currentSlide ? GOLD : "rgba(0,0,0,.25)" }}
                    onClick={() => { imgScrollRef.current?.scrollTo({ left: i * (imgScrollRef.current?.offsetWidth ?? 0), behavior: "smooth" }); setCurrentSlide(i); }} />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="pdp-thumb-strip">
              {images.map((img, i) => (
                <img key={i} src={img} alt={`thumb ${i}`} className={`pdp-thumb${i === currentSlide ? " active" : ""}`}
                  onClick={() => { imgScrollRef.current?.scrollTo({ left: i * (imgScrollRef.current?.offsetWidth ?? 0), behavior: "smooth" }); setCurrentSlide(i); }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ))}
            </div>
          )}

          {/* ── PRODUCT INFO ── */}
          <div className="pdp-info">
            <div className="pdp-eyebrow">
              <span>🌿</span> {product.categoryName}
              {product.featured && <span style={{ background: GOLD, color: "#111", fontSize: 9, fontWeight: 900, padding: "2px 8px", borderRadius: 4 }}>⭐ TOP PICK</span>}
            </div>

            <h1 className="pdp-name">{product.name}</h1>
            {product.artisan && (
              <p className="pdp-artisan">By <strong style={{ color: G }}>{product.artisan}</strong>{product.origin && ` · ${product.origin}`}</p>
            )}

            {/* Rating row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
              <span className="pdp-rating-chip">{(product.rating ?? 4.2).toFixed(1)} ★</span>
              <StarRating rating={product.rating ?? 4.2} count={product.reviewCount ?? 0} />
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <p style={{ fontSize: 12, color: "#ff3f6c", fontWeight: 800, fontFamily: "'Nunito',sans-serif", margin: "6px 0 0" }}>⚡ Only {product.stock} left in stock!</p>
            )}
          </div>

          {/* ── PRICE SECTION ── */}
          <div className="pdp-price-section">
            {/* Main price */}
            <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
              <span className="pdp-price-main">₹{Number(product.price).toLocaleString("en-IN")}</span>
              {product.originalPrice && <span className="pdp-price-orig">₹{Number(product.originalPrice).toLocaleString("en-IN")}</span>}
              {discount > 0 && <span className="pdp-disc-badge">{discount}% OFF</span>}
            </div>
            <p style={{ fontSize: 11, color: "#94969f", fontFamily: "'Nunito',sans-serif", margin: "3px 0 0" }}>MRP (Incl. of all taxes)</p>
            {savings > 0 && <p className="pdp-save-line">You Save ₹{Number(savings).toLocaleString("en-IN")}</p>}
          </div>

          {/* ── TRUST BAR ── */}
          <TrustBar />

          {/* ── QUANTITY + CTA ── */}
          {product.stock > 0 ? (
            <>
              <div style={{ padding: "14px 20px 10px", background: "#fff", borderTop: "1px solid #f5f5f6", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#282c3f", fontFamily: "'Nunito',sans-serif" }}>Quantity</span>
                <div className="pdp-qty">
                  <button className="pdp-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                  <div className="pdp-qty-num">{quantity}</div>
                  <button className="pdp-qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
                </div>
              </div>
              <div className="pdp-cta">
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="pdp-btn-cart" style={{ flex: 1 }} onClick={() => handleAddToCart()} disabled={addToCart.isPending}>
                    🛒 {addToCart.isPending ? "Adding..." : "Add to Cart"}
                  </button>
                  <button className="pdp-btn-buynow" style={{ flex: 1 }} onClick={() => handleAddToCart(() => navigate("/checkout"))} disabled={addToCart.isPending}>
                    ⚡ Buy Now
                  </button>
                </div>
                <a href={waUrl(product.name, product.price, true)} target="_blank" rel="noopener noreferrer" className="pdp-btn-wa">
                  {WA_SVG} Order on WhatsApp
                </a>
                <p style={{ fontSize: 11, color: "#94969f", fontFamily: "'Nunito',sans-serif", textAlign: "center", margin: "4px 0 0" }}>
                  🔒 Trusted by 1 lakh+ Indians · Secure Checkout · 100% Genuine
                </p>
              </div>
            </>
          ) : (
            <div style={{ padding: "16px 20px", background: "#fff", borderTop: "8px solid #f5f5f6" }}>
              <NotifyMe productId={product.id} productName={product.name} />
            </div>
          )}

          {/* ── ORDER TIMELINE ── */}
          <div style={{ padding: "16px 20px 8px", background: "#fff", borderTop: "8px solid #f5f5f6" }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: "#94969f", letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "'Nunito',sans-serif", margin: "0 0 4px" }}>DELIVERY</p>
            <OrderTimeline />
          </div>

          {/* ── TABS ── */}
          <div className="pdp-tabs" style={{ marginTop: 8 }}>
            <button className={`pdp-tab${activeTab === "details" ? " active" : ""}`} onClick={() => setActiveTab("details")}>PRODUCT DETAILS</button>
            <button className={`pdp-tab${activeTab === "reviews" ? " active" : ""}`} onClick={() => setActiveTab("reviews")}>RATINGS & REVIEWS</button>
          </div>

          {activeTab === "details" ? (
            <KasutamDetailTabs product={product} />
          ) : (
            <div style={{ background: "#fff", padding: "16px 20px" }}>
              <ReviewSystem productId={product.id} productName={product.name} />
            </div>
          )}

          {/* ── FAQ ── */}
          <div style={{ background: "#f5f0e0", borderTop: "8px solid #f5f5f6", padding: "20px 16px 24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#1a1a2e", margin: "0 0 16px" }}>FAQ's</h2>
            <KasutamFAQ faqs={FAQS} />
          </div>

          
          {/* ── SPOTLIGHTS ── */}
          <SpotlightsSection />

          {/* ── YOU MIGHT ALSO LIKE ── */}
          <YouMightAlsoLike products={relatedList.slice(0, 6)} onNavigate={pid => navigate(`/products/${pid}`)} />

        </div>
      )}

      {/* ── STICKY BOTTOM BAR ── */}
      {product && product.stock > 0 && (
        <div className="pdp-sticky">
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#1a1a2e", fontFamily: "'Nunito',sans-serif", lineHeight: 1 }}>
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>
            {savings > 0 && <p style={{ margin: "2px 0 0", fontSize: 10, color: G, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>Save ₹{Number(savings).toLocaleString("en-IN")}</p>}
          </div>
          <a href={waUrl(product.name, product.price)} target="_blank" rel="noopener noreferrer"
            style={{ width: 46, height: 46, background: "#25D366", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, textDecoration: "none" }}>
            {WA_SVG}
          </a>
          <button onClick={() => handleAddToCart()} disabled={addToCart.isPending}
            style={{ flex: 1, height: 46, background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            🛒 Add to Cart
          </button>
          <button onClick={() => handleAddToCart(() => navigate("/checkout"))} disabled={addToCart.isPending}
            style={{ flex: 1, height: 46, background: GOLD, color: "#1a1a2e", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "'Nunito',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            ⚡ Buy Now
          </button>
        </div>
      )}
    </>
  );
}
