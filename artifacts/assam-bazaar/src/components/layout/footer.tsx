import { Link } from "wouter";
import { useState, useEffect } from "react";

const QUICK_LINKS = [
  { href: "/",               label: "Home"        },
  { href: "/products",       label: "Categories"  },
  { href: "/products",       label: "Best Offers" },
  { href: "/orders",         label: "Track Order" },
  { href: "/about",          label: "About Us"    },
  { href: "/contact",        label: "Contact Us"  },
];

const CUSTOMER_SERVICE = [
  { href: "/faq",             label: "Help Center"            },
  { href: "/faq",             label: "FAQs"                   },
  { href: "/shipping-policy", label: "Shipping Policy"        },
  { href: "/refund-policy",   label: "Return & Refund Policy" },
  { href: "/terms",           label: "Terms & Conditions"     },
  { href: "/privacy-policy",  label: "Privacy Policy"         },
];

const PAYMENTS = [
  { label: "VISA",       src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" },
  { label: "Mastercard", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" },
  { label: "RuPay",      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay.svg/1280px-RuPay.svg.png" },
  { label: "UPI",        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png" },
  { label: "Paytm",      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1280px-Paytm_Logo_%28standalone%29.svg.png" },
  { label: "PhonePe",    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1280px-PhonePe_Logo.svg.png" },
];

const SOCIAL_LINKS = [
  {
    key: "facebook", label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    key: "instagram", label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    key: "youtube", label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
  {
    key: "whatsapp", label: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
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
      };
    }
  } catch {}
  return { facebook: "", instagram: "", whatsapp: "", youtube: "" };
}

const GOLD = "#c9a84c";
const GREEN = "#1a5a32";

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
    <footer style={{ background: "#0f2d1a", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        .ab-footer-link { display:flex; align-items:center; gap:8px; padding:5px 0; text-decoration:none; cursor:pointer; }
        .ab-footer-link:hover .ab-footer-link-text { color:#fff !important; }
        .ab-social-btn { width:44px; height:44px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.3); background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; }
        .ab-social-btn:hover { background:rgba(255,255,255,0.2); border-color:rgba(255,255,255,0.6); }
        .ab-subscribe-btn { background:${GOLD}; color:#111; border:none; border-radius:8px; padding:12px 22px; font-size:14px; font-weight:700; cursor:pointer; white-space:nowrap; transition:background 0.2s; display:flex; align-items:center; gap:6px; }
        .ab-subscribe-btn:hover { background:#b8942e; }
        @media (max-width:767px) {
          .ab-footer-top { flex-direction:column !important; }
          .ab-footer-links-row { flex-direction:column !important; }
          .ab-subscribe-row { flex-direction:column !important; }
          .ab-subscribe-input { width:100% !important; }
          .ab-payments-row { flex-wrap:wrap; justify-content:center; }
          .ab-bottom-bar { flex-direction:column !important; align-items:center !important; text-align:center; gap:10px !important; }
        }
      `}</style>

      {/* ── TOP SECTION: Logo + Social ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "32px 24px 28px" }}>
        <div className="ab-footer-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>

          {/* Logo + tagline */}
          <div style={{ maxWidth: 420 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <img src="/logo.png" alt="ApunBazar" style={{ height: 52, width: 52, objectFit: "contain", borderRadius: 10 }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 800, lineHeight: 1 }}>
                  <span style={{ color: "#4ade80" }}>Apun</span><span style={{ color: GOLD }}>Bazar</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                  <span style={{ fontSize: 11 }}>🌿</span>
                  <span style={{ color: GOLD, fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>Pride of Assam</span>
                  <span style={{ fontSize: 11 }}>🌿</span>
                </div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, lineHeight: 1.75, margin: "12px 0 0" }}>
              Bringing you the finest Assamese products –<br />
              Pure, Authentic &amp; Handmade<br />
              with love from Assam.
            </p>
          </div>

          {/* Stay Connected */}
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 14, marginTop: 0 }}>Stay Connected</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {SOCIAL_LINKS.map(s => (
                <button key={s.key} className="ab-social-btn" onClick={() => handleSocialClick(s.key)} aria-label={s.label}>
                  {s.icon}
                </button>
              ))}
            </div>
            {/* Divider with leaf */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
              <div style={{ width: 60, height: 1, background: "rgba(255,255,255,0.2)" }} />
              <span style={{ fontSize: 14 }}>🌿</span>
              <div style={{ width: 60, height: 1, background: "rgba(255,255,255,0.2)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE: Quick Links + Customer Service ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "28px 24px" }}>
        <div className="ab-footer-links-row" style={{ display: "flex", gap: 0 }}>

          {/* Quick Links */}
          <div style={{ flex: 1, paddingRight: 24, borderRight: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(74,222,128,0.15)", border: "1.5px solid rgba(74,222,128,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Quick Links</span>
            </div>
            <nav>
              {QUICK_LINKS.map(l => (
                <Link key={l.href + l.label} href={l.href}>
                  <div className="ab-footer-link">
                    <span style={{ color: GOLD, fontSize: 16, lineHeight: 1, fontWeight: 700 }}>›</span>
                    <span className="ab-footer-link-text" style={{ fontSize: 14, color: "rgba(255,255,255,0.78)", transition: "color 0.15s" }}>{l.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer Service */}
          <div style={{ flex: 1, paddingLeft: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(74,222,128,0.15)", border: "1.5px solid rgba(74,222,128,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
                </svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Customer Service</span>
            </div>
            <nav>
              {CUSTOMER_SERVICE.map(l => (
                <Link key={l.href + l.label} href={l.href}>
                  <div className="ab-footer-link">
                    <span style={{ color: GOLD, fontSize: 16, lineHeight: 1, fontWeight: 700 }}>›</span>
                    <span className="ab-footer-link-text" style={{ fontSize: 14, color: "rgba(255,255,255,0.78)", transition: "color 0.15s" }}>{l.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* ── NEWSLETTER ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "22px 24px" }}>
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "20px 22px" }}>
          <div className="ab-subscribe-row" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Icon + text */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(201,168,76,0.15)", border: `1.5px solid ${GOLD}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#fff", margin: 0 }}>Stay Updated</p>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", margin: "3px 0 0", lineHeight: 1.5 }}>
                  Subscribe to get exclusive offers,<br />new arrivals &amp; festival deals.
                </p>
              </div>
            </div>

            {/* Input + button */}
            {subscribed ? (
              <div style={{ flex: 1, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 8, padding: "14px 18px", color: "#4ade80", fontSize: 14, fontWeight: 600 }}>
                🎉 Subscribed! Thank you.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ flex: 1, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setEmailErr(""); }}
                    placeholder="Enter your email address"
                    className="ab-subscribe-input"
                    style={{
                      width: "100%", padding: "13px 16px", boxSizing: "border-box",
                      background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 8,
                      fontSize: 14, color: "#333", outline: "none",
                    }}
                  />
                  {emailErr && <p style={{ color: "#fca5a5", fontSize: 11, margin: "4px 0 0" }}>{emailErr}</p>}
                </div>
                <button type="submit" className="ab-subscribe-btn">
                  Subscribe Now
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── PAYMENTS ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 13 }}>🌿</span>
          <span style={{ color: GOLD, fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>We Accept</span>
          <span style={{ fontSize: 13 }}>🌿</span>
        </div>
        <div className="ab-payments-row" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          {PAYMENTS.map(p => (
            <div key={p.label} style={{
              background: "#fff", borderRadius: 8, padding: "8px 14px",
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 40, minWidth: 70,
            }}>
              <img src={p.src} alt={p.label} style={{ height: 20, maxWidth: 64, objectFit: "contain", display: "block" }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ padding: "18px 24px 24px", textAlign: "center" }}>
        <div className="ab-bottom-bar" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: 0 }}>
            © {new Date().getFullYear()} ApunBazar. All Rights Reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13 }}>🌿</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
              Made with <span style={{ color: "#4ade80" }}>♥</span> in Assam
            </span>
            <span style={{ fontSize: 13 }}>🌿</span>
          </div>
        </div>
      </div>

      {/* Space for mobile bottom nav */}
      <div style={{ height: 16 }} />
    </footer>
  );
}
