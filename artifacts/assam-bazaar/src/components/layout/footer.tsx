import { Link } from "wouter";
import { useState, useEffect } from "react";

const QUICK_LINKS = [
  { href: "/",               label: "Home"           },
  { href: "/products",       label: "Categories"     },
  { href: "/products",       label: "Best Offers"    },
  { href: "/orders",         label: "Track Order"    },
  { href: "/about",          label: "About Us"       },
  { href: "/contact",        label: "Contact Us"     },
];

const CUSTOMER_SERVICE = [
  { href: "/faq",             label: "Help Center"           },
  { href: "/faq",             label: "FAQs"                  },
  { href: "/shipping-policy", label: "Shipping Policy"       },
  { href: "/refund-policy",   label: "Return & Refund Policy"},
  { href: "/terms",           label: "Terms & Conditions"    },
  { href: "/privacy-policy",  label: "Privacy Policy"        },
];

const PAYMENTS = [
  { label: "VISA",       src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" },
  { label: "Mastercard", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" },
  { label: "RuPay",      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay.svg/1280px-RuPay.svg.png" },
  { label: "UPI",        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png" },
  { label: "Paytm",      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1280px-Paytm_Logo_%28standalone%29.svg.png" },
  { label: "PhonePe",    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1280px-PhonePe_Logo.svg.png" },
];

const TRUST_BADGES = [
  {
    label: "100% SECURE\nSHOPPING",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    label: "24/7 CUSTOMER\nSUPPORT",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
  },
  {
    label: "ON-TIME\nDELIVERY",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    label: "BEST QUALITY\nPRODUCTS",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
];

const SOCIAL_DEFS = [
  {
    key: "facebook", label: "Facebook", bg: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    key: "instagram", label: "Instagram",
    bg: "linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    key: "youtube", label: "YouTube", bg: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
  {
    key: "whatsapp", label: "WhatsApp", bg: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
];

function loadSocials() {
  try {
    const saved = localStorage.getItem("apunbazar_socials");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        facebook:  parsed.facebook  ?? "",
        instagram: parsed.instagram ?? "",
        whatsapp:  parsed.whatsapp  ?? "",
        youtube:   parsed.youtube   ?? "",
        twitter:   parsed.twitter   ?? "",
      };
    }
  } catch {}
  return { facebook: "", instagram: "", whatsapp: "", youtube: "", twitter: "" };
}

export default function Footer() {
  const [email, setEmail]           = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailErr, setEmailErr]     = useState("");
  const [socials, setSocials]       = useState(loadSocials);

  useEffect(() => {
    const onUpdate = () => setSocials(loadSocials());
    window.addEventListener("apunbazar_socials_updated", onUpdate);
    return () => window.removeEventListener("apunbazar_socials_updated", onUpdate);
  }, []);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    const v = email.trim();
    if (!v)                       { setEmailErr("Email daalo please"); return; }
    if (!/\S+@\S+\.\S+/.test(v)) { setEmailErr("Valid email daalo");  return; }
    setEmailErr(""); setSubscribed(true); setEmail("");
  }

  function handleSocialClick(key: string) {
    const url = (socials as any)[key];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <footer style={{ background: "#1e5631", color: "#ffffff" }}>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 0;
        }
        .footer-col {
          padding: 36px 28px;
          border-left: 1px solid rgba(255,255,255,0.15);
        }
        .footer-col:first-child { border-left: none; }

        .footer-nav-link {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 0; cursor: pointer; text-decoration: none;
        }
        .footer-nav-link:hover span.link-label { color: #ffffff !important; }

        /* Mobile: 2 columns */
        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
          .footer-col {
            padding: 20px 16px;
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.12);
          }
          .footer-col:first-child { border-top: none; grid-column: 1 / -1; }
          .footer-col:nth-child(3) { border-left: 1px solid rgba(255,255,255,0.12); }
          .footer-col:nth-child(5) { border-left: 1px solid rgba(255,255,255,0.12); }

          .trust-grid { grid-template-columns: repeat(2,1fr) !important; }
          .bottom-bar { flex-direction: column; align-items: flex-start !important; gap: 12px !important; }
          .payments-row { flex-wrap: wrap; }
        }
      `}</style>

      {/* ── MAIN COLUMNS ── */}
      <div className="footer-grid">

        {/* COL 1 — About */}
        <div className="footer-col">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10, marginTop: 0 }}>
            About ApunBazar
          </h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, marginBottom: 18, marginTop: 0 }}>
            ApunBazar is your trusted online marketplace for all your daily needs.
            We bring quality products, great prices and a seamless shopping experience right to your doorstep.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {SOCIAL_DEFS.map(s => {
              const url = (socials as any)[s.key];
              const hasLink = !!url;
              return (
                <button key={s.key} onClick={() => handleSocialClick(s.key)} aria-label={s.label}
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)",
                    border: "none", cursor: hasLink ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: hasLink ? 1 : 0.75, transition: "background 0.2s", padding: 0,
                  }}
                  onMouseEnter={e => { if (hasLink) (e.currentTarget as HTMLElement).style.background = s.bg as string; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)"; }}
                >{s.icon}</button>
              );
            })}
          </div>
        </div>

        {/* COL 2 — Quick Links */}
        <div className="footer-col">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>Quick Links</h3>
          <nav>
            {QUICK_LINKS.map(l => (
              <Link key={l.href + l.label} href={l.href}>
                <div className="footer-nav-link">
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1 }}>›</span>
                  <span className="link-label" style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", transition: "color 0.15s" }}>{l.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* COL 3 — Customer Service */}
        <div className="footer-col">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>Customer Service</h3>
          <nav>
            {CUSTOMER_SERVICE.map(l => (
              <Link key={l.href + l.label} href={l.href}>
                <div className="footer-nav-link">
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1 }}>›</span>
                  <span className="link-label" style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", transition: "color 0.15s" }}>{l.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* COL 4 — Newsletter */}
        <div className="footer-col">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6, marginTop: 0 }}>
            Subscribe to Our Newsletter
          </h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: 16, marginTop: 4 }}>
            Get the latest updates, offers and more delivered to your inbox.
          </p>
          {subscribed ? (
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "14px", color: "#fff", fontSize: 13 }}>
              🎉 Subscribed! Thank you.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setEmailErr(""); }}
                placeholder="Enter your email"
                style={{
                  width: "100%", padding: "11px 14px", boxSizing: "border-box",
                  background: "#fff", border: "none", borderRadius: 7,
                  fontSize: 13, color: "#333", outline: "none",
                }}
              />
              {emailErr && <p style={{ color: "#fca5a5", fontSize: 11, margin: 0 }}>{emailErr}</p>}
              <button type="submit" style={{
                width: "100%", padding: "12px",
                background: "#2e7d45", color: "#fff",
                border: "none", borderRadius: 7,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "#256038")}
                onMouseLeave={e => (e.currentTarget.style.background = "#2e7d45")}
              >Subscribe</button>
            </form>
          )}
        </div>

      </div>

      {/* ── TRUST BADGES + PAYMENTS BAR ── */}
      <div style={{ background: "#174d2a", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div className="trust-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}>
            {TRUST_BADGES.map(({ label, icon }, i) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 20px",
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.15)" : "none",
              }}>
                {icon}
                <span style={{
                  
                  color: "rgba(255,255,255,0.9)",
                  whiteSpace: "pre-line", lineHeight: 1.5,
                }}>{label}</span>
              </div>
            ))}
          </div>

          {/* ── PREMIUM PAYMENT LOGOS ── */}
          <div style={{ padding: "28px 0 8px" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{
                fontSize: 10, letterSpacing: 3, color: "rgba(201,168,76,0.7)",
                fontWeight: 700, textTransform: "uppercase",
              }}>Secure Payment Methods</span>
            </div>
            <div style={{
              display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8,
            }}>
              {PAYMENTS.map(p => (
                <div key={p.label} className="pay-card" style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "7px 14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: 38, minWidth: 60,
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                  transition: "transform .2s, box-shadow .2s",
                }}>
                  <img
                    src={p.src} alt={p.label}
                    style={{ height: 20, maxWidth: 56, objectFit: "contain", display: "block" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── GOLD DIVIDER ── */}
          <div style={{
            height: 1, margin: "24px 0 0",
            background: "linear-gradient(90deg, transparent, #C9A84C, #E8C97A, #C9A84C, transparent)",
          }} />
        </div>
      </div>

      {/* ── PREMIUM BOTTOM BAR ── */}
      <div style={{
        background: "#0D2818",
        borderTop: "1px solid rgba(201,168,76,0.3)",
        padding: "32px 20px 24px",
        position: "relative", overflow: "hidden",
      }}>
        <style>{`
          @keyframes glow-pulse { 0%,100%{opacity:.5;filter:blur(18px)} 50%{opacity:.85;filter:blur(22px)} }
          @keyframes particle-rise { 0%{transform:translateY(0) scale(1);opacity:0} 10%{opacity:.7} 90%{opacity:.3} 100%{transform:translateY(-70px) scale(0.4);opacity:0} }
          @keyframes leaf-sway { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }
          @keyframes map-glow { 0%,100%{filter:drop-shadow(0 0 6px rgba(201,168,76,0.4))} 50%{filter:drop-shadow(0 0 14px rgba(201,168,76,0.75))} }
          @keyframes fade-up-bar { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
          .pay-card:hover { transform: translateY(-3px) !important; box-shadow: 0 6px 20px rgba(201,168,76,0.25) !important; }
          .bb-content { animation: fade-up-bar .7s ease both; }
        `}</style>

        {/* Background glow blobs */}
        <div style={{ position: "absolute", top: -30, left: "10%", width: 180, height: 180, borderRadius: "50%", background: "rgba(26,90,50,0.25)", animation: "glow-pulse 5s ease infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -20, right: "8%", width: 140, height: 140, borderRadius: "50%", background: "rgba(201,168,76,0.12)", animation: "glow-pulse 6s ease infinite 1.5s", pointerEvents: "none" }} />

        {/* Tiny rising particles */}
        {[8, 22, 38, 55, 70, 85].map((left, i) => (
          <span key={i} style={{
            position: "absolute", bottom: 8, left: `${left}%`,
            width: 2.5, height: 2.5, borderRadius: "50%",
            background: "#C9A84C",
            animation: `particle-rise ${3.5 + i * 0.6}s ease-in infinite`,
            animationDelay: `${i * 0.9}s`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Traditional Assamese border pattern */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(201,168,76,0.5) 6px, rgba(201,168,76,0.5) 8px, transparent 8px, transparent 14px, rgba(201,168,76,0.25) 14px, rgba(201,168,76,0.25) 16px)",
          pointerEvents: "none",
        }} />

        <div className="bb-content" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>

          {/* Premium Assam Map SVG with glow */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <svg
              viewBox="0 0 220 130"
              width="110" height="65"
              style={{ animation: "map-glow 3.5s ease infinite" }}
              aria-label="Map of Assam"
            >
              {/* Detailed Assam silhouette — a recognizable stylized outline */}
              <defs>
                <linearGradient id="assam-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8C97A" />
                  <stop offset="50%" stopColor="#C9A84C" />
                  <stop offset="100%" stopColor="#A07832" />
                </linearGradient>
                <filter id="assam-glow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {/* Assam map path — elongated east-west shape */}
              <path
                d="M18,55 C22,42 30,35 38,32 C44,28 50,25 58,26 C64,22 72,18 82,20
                   C90,16 100,14 108,18 C116,14 126,12 134,16 C142,12 152,15 158,22
                   C166,18 176,22 182,30 C190,28 200,32 202,42
                   C208,46 210,54 206,62 C210,70 208,80 200,84
                   C196,92 188,96 180,94 C174,102 164,106 156,100
                   C148,108 138,110 130,104 C122,112 110,112 102,106
                   C94,114 82,112 76,104 C68,110 56,108 50,100
                   C42,104 32,100 26,92 C18,88 12,78 14,68
                   C10,62 12,58 18,55 Z"
                fill="none"
                stroke="url(#assam-gold)"
                strokeWidth="2.2"
                strokeLinejoin="round"
                filter="url(#assam-glow)"
              />
              {/* Brahmaputra river hint */}
              <path
                d="M30,62 Q60,56 90,60 Q120,64 150,58 Q170,55 190,60"
                fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              {/* Center dot — Guwahati */}
              <circle cx="82" cy="65" r="2.5" fill="#C9A84C" opacity="0.9" />
              <circle cx="82" cy="65" r="5" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5" />
            </svg>
          </div>

          {/* Made with love */}
          <div style={{ marginBottom: 10 }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 17, fontWeight: 600,
              color: "#fff",
              margin: "0 0 5px",
              letterSpacing: 0.3,
            }}>
              Made with <span style={{ color: "#e05c4a" }}>❤️</span> in Assam
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11.5,
              color: "rgba(255,255,255,0.45)",
              margin: 0, letterSpacing: 1.2,
              textTransform: "uppercase",
            }}>
              Authentic products &nbsp;•&nbsp; Proudly crafted for India
            </p>
          </div>

          {/* Gold thin divider */}
          <div style={{
            width: 80, height: 1, margin: "14px auto",
            background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
          }} />

          {/* Copyright */}
          <div>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 13, fontWeight: 600,
              color: "rgba(255,255,255,0.75)",
              margin: "0 0 3px",
            }}>
              © {new Date().getFullYear()} ApunBazar
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11, color: "rgba(255,255,255,0.35)",
              margin: "0 0 2px", letterSpacing: 0.5,
            }}>
              All Rights Reserved.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11, color: "rgba(201,168,76,0.55)",
              margin: 0, letterSpacing: 0.5,
            }}>
              Designed &amp; Crafted in Assam 🇮🇳
            </p>
          </div>

          {/* Decorative tea leaves */}
          <div style={{ position: "absolute", bottom: 12, left: 16, opacity: 0.18 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#C9A84C" style={{ animation: "leaf-sway 4s ease infinite" }}>
              <path d="M3 13c0-6 4-10 10-10 6 0 8 2 8 2s-1 9-8 11c-5 1.5-8-1-9-3z"/>
            </svg>
          </div>
          <div style={{ position: "absolute", bottom: 16, right: 16, opacity: 0.18 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#C9A84C" style={{ animation: "leaf-sway 5s ease infinite 1s", transform: "scaleX(-1)" }}>
              <path d="M3 13c0-6 4-10 10-10 6 0 8 2 8 2s-1 9-8 11c-5 1.5-8-1-9-3z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Space for mobile bottom nav */}
      <div style={{ height: 16 }} />
    </footer>
  );
}
