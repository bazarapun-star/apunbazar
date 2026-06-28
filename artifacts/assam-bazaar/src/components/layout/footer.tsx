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

const SOCIAL_LINKS = [
  {
    key: "facebook", label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    key: "instagram", label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    key: "youtube", label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
  {
    key: "whatsapp", label: "WhatsApp",
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
      };
    }
  } catch {}
  return { facebook: "", instagram: "", whatsapp: "", youtube: "" };
}

const GOLD = "#c9a84c";

export default function Footer() {
  const [socials, setSocials] = useState(loadSocials);

  useEffect(() => {
    const onUpdate = () => setSocials(loadSocials());
    window.addEventListener("apunbazar_socials_updated", onUpdate);
    return () => window.removeEventListener("apunbazar_socials_updated", onUpdate);
  }, []);

  function handleSocialClick(key: string) {
    const url = (socials as any)[key];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <footer style={{ background: "#0f2d1a", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        .ab-footer-link { display:flex; align-items:center; gap:6px; padding:3px 0; text-decoration:none; cursor:pointer; }
        .ab-footer-link:hover .ab-footer-link-text { color:#fff !important; }
        .ab-social-btn { width:36px; height:36px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.3); background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; }
        .ab-social-btn:hover { background:rgba(255,255,255,0.2); border-color:rgba(255,255,255,0.6); }
        @media (max-width:767px) {
          .ab-footer-top { flex-direction:column !important; gap:16px !important; }
          .ab-footer-links-row { flex-direction:column !important; gap:0 !important; }
          .ab-footer-col-right { padding-left:0 !important; border-left:none !important; border-top:1px solid rgba(255,255,255,0.1); padding-top:16px !important; margin-top:4px; }
          .ab-bottom-bar { flex-direction:column !important; align-items:center !important; text-align:center; gap:6px !important; }
        }
      `}</style>

      {/* ── TOP: Logo + Social ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "20px 20px 16px" }}>
        <div className="ab-footer-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>

          {/* Logo + tagline */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/logo.png" alt="ApunBazar"
              style={{ height: 40, width: 40, objectFit: "contain", borderRadius: 8 }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800, lineHeight: 1 }}>
                <span style={{ color: "#4ade80" }}>Apun</span><span style={{ color: GOLD }}>Bazar</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <span style={{ fontSize: 10 }}>🌿</span>
                <span style={{ color: GOLD, fontSize: 11, fontWeight: 600, letterSpacing: 0.8 }}>Pride of Assam</span>
                <span style={{ fontSize: 10 }}>🌿</span>
              </div>
            </div>
          </div>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 8 }}>
            {SOCIAL_LINKS.map(s => (
              <button key={s.key} className="ab-social-btn" onClick={() => handleSocialClick(s.key)} aria-label={s.label}>
                {s.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── LINKS: Quick Links + Customer Service ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "16px 20px" }}>
        <div className="ab-footer-links-row" style={{ display: "flex", gap: 0 }}>

          {/* Quick Links */}
          <div style={{ flex: 1, paddingRight: 20, borderRight: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#4ade80", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 8px" }}>Quick Links</p>
            <nav>
              {QUICK_LINKS.map(l => (
                <Link key={l.href + l.label} href={l.href}>
                  <div className="ab-footer-link">
                    <span style={{ color: GOLD, fontSize: 14, lineHeight: 1, fontWeight: 700 }}>›</span>
                    <span className="ab-footer-link-text" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", transition: "color 0.15s" }}>{l.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer Service */}
          <div className="ab-footer-col-right" style={{ flex: 1, paddingLeft: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#4ade80", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 8px" }}>Customer Service</p>
            <nav>
              {CUSTOMER_SERVICE.map(l => (
                <Link key={l.href + l.label} href={l.href}>
                  <div className="ab-footer-link">
                    <span style={{ color: GOLD, fontSize: 14, lineHeight: 1, fontWeight: 700 }}>›</span>
                    <span className="ab-footer-link-text" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", transition: "color 0.15s" }}>{l.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ padding: "12px 20px 14px" }}>
        <div className="ab-bottom-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: 0 }}>
            © {new Date().getFullYear()} ApunBazar. All Rights Reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 12 }}>🌿</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              Made with <span style={{ color: "#4ade80" }}>♥</span> in Assam
            </span>
            <span style={{ fontSize: 12 }}>🌿</span>
          </div>
        </div>
      </div>

      {/* Space for mobile bottom nav */}
      <div style={{ height: 12 }} />
    </footer>
  );
}
