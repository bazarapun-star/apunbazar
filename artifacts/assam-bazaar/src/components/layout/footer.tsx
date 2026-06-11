import { Link } from "wouter";
import { useState, useEffect } from "react";

const QUICK_LINKS = [
  { href: "/",                label: "Home"              },
  { href: "/products",        label: "Categories"        },
  { href: "/products",        label: "Best Offers"       },
  { href: "/orders",          label: "Track Order"       },
  { href: "/about",           label: "About Us"          },
  { href: "/contact",         label: "Contact Us"        },
];

const CUSTOMER_SERVICE = [
  { href: "/faq",              label: "Help Center"          },
  { href: "/faq",              label: "FAQs"                 },
  { href: "/shipping-policy",  label: "Shipping Policy"      },
  { href: "/refund-policy",    label: "Return & Refund Policy"},
  { href: "/terms",            label: "Terms & Conditions"   },
  { href: "/privacy-policy",   label: "Privacy Policy"       },
];

const TRUST_BADGES = [
  { icon: "/icons/secure.svg",   emoji: "🛡️", label: "100% SECURE\nSHOPPING"   },
  { icon: "/icons/support.svg",  emoji: "🎧", label: "24/7 CUSTOMER\nSUPPORT"   },
  { icon: "/icons/delivery.svg", emoji: "🚚", label: "ON-TIME\nDELIVERY"        },
  { icon: "/icons/quality.svg",  emoji: "⭐", label: "BEST QUALITY\nPRODUCTS"   },
];

const PAYMENTS = [
  { label: "VISA",       bg: "#1a1f71", color: "#fff"    },
  { label: "Mastercard", bg: "#eb001b", color: "#fff"    },
  { label: "RuPay",      bg: "#006db7", color: "#fff"    },
  { label: "UPI",        bg: "#097939", color: "#fff"    },
  { label: "Paytm",      bg: "#00baf2", color: "#fff"    },
  { label: "PhonePe",    bg: "#5f259f", color: "#fff"    },
];

const SOCIAL_DEFS = [
  {
    key: "facebook", label: "Facebook", bg: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    key: "instagram", label: "Instagram",
    bg: "linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    key: "youtube", label: "YouTube", bg: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
  {
    key: "whatsapp", label: "WhatsApp", bg: "#25D366",
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
    <footer style={{ background: "#1a4a2e", color: "#ffffff" }}>

      {/* ── MAIN FOOTER COLUMNS ── */}
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Col 1 — About */}
          <div className="lg:col-span-1">
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", marginBottom: 12 }}>
              About ApunBazar
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: 20 }}>
              ApunBazar is your trusted online marketplace for all your daily needs.
              We bring quality products, great prices and a seamless shopping experience right to your doorstep.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2 flex-wrap">
              {SOCIAL_DEFS.map(s => {
                const url = (socials as any)[s.key];
                const hasLink = !!url;
                return (
                  <button
                    key={s.key}
                    onClick={() => handleSocialClick(s.key)}
                    aria-label={s.label}
                    title={hasLink ? `Open ${s.label}` : `${s.label} — Admin mein link add karein`}
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "rgba(255,255,255,0.15)",
                      border: "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: hasLink ? "pointer" : "default",
                      opacity: hasLink ? 1 : 0.6,
                      transition: "background 0.2s",
                      flexShrink: 0,
                      padding: 0,
                    }}
                    onMouseEnter={e => { if (hasLink) (e.currentTarget as HTMLElement).style.background = (s.bg as string).startsWith("linear") ? s.bg as string : s.bg; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"; }}
                  >
                    {s.icon}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", marginBottom: 12 }}>
              Quick Links
            </h3>
            <nav className="flex flex-col gap-1">
              {QUICK_LINKS.map(l => (
                <Link key={l.href + l.label} href={l.href}>
                  <div className="flex items-center gap-2 py-1.5 cursor-pointer group">
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>›</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", transition: "color 0.15s" }}
                      className="group-hover:text-white">{l.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Customer Service */}
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", marginBottom: 12 }}>
              Customer Service
            </h3>
            <nav className="flex flex-col gap-1">
              {CUSTOMER_SERVICE.map(l => (
                <Link key={l.href + l.label} href={l.href}>
                  <div className="flex items-center gap-2 py-1.5 cursor-pointer group">
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>›</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", transition: "color 0.15s" }}
                      className="group-hover:text-white">{l.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4 — Download App */}
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", marginBottom: 6 }}>
              Download Our App
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
              Shop anytime, anywhere
            </p>
            <div className="flex flex-col gap-3">
              {/* Google Play */}
              <a href="#" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#000", borderRadius: 10, padding: "10px 14px",
                  textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M3.18 23.76c.33.18.7.24 1.06.18L15.57 12 12 8.43 3.18 23.76zm17.49-10.9L17.6 11.1l-3.46 3.46 3.46 3.46 3.09-1.77a1.98 1.98 0 000-3.39zM2.1.58A1.98 1.98 0 001 2.38v19.24c0 .78.42 1.47 1.1 1.8L13.72 12 2.1.58zm9.47 10.05L4.24.24A2 2 0 003.18.06L14.1 11l-2.53-2.37z"/>
                </svg>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 0.5 }}>GET IT ON</div>
                  <div style={{ fontSize: 14, color: "#fff", fontWeight: 600, lineHeight: 1.2 }}>Google Play</div>
                </div>
              </a>
              {/* App Store */}
              <a href="#" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#000", borderRadius: 10, padding: "10px 14px",
                  textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 0.5 }}>Download on the</div>
                  <div style={{ fontSize: 14, color: "#fff", fontWeight: 600, lineHeight: 1.2 }}>App Store</div>
                </div>
              </a>
            </div>
          </div>

          {/* Col 5 — Newsletter */}
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", marginBottom: 6 }}>
              Subscribe to Our Newsletter
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 16, lineHeight: 1.6 }}>
              Get the latest updates, offers and more delivered to your inbox.
            </p>
            {subscribed ? (
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "14px 16px", color: "#fff", fontSize: 13 }}>
                🎉 Subscribed! Thank you.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailErr(""); }}
                  placeholder="Enter your email"
                  style={{
                    width: "100%", padding: "12px 14px",
                    background: "#fff", border: "none", borderRadius: 8,
                    fontSize: 13, color: "#333", outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {emailErr && <p style={{ color: "#fca5a5", fontSize: 11 }}>{emailErr}</p>}
                <button
                  type="submit"
                  style={{
                    width: "100%", padding: "13px",
                    background: "#2e7d45", color: "#fff",
                    border: "none", borderRadius: 8,
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#256038")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#2e7d45")}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* ── TRUST BADGES BAR ── */}
      <div style={{ background: "#163d26", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {[
              { emoji: "🛡️", label: "100% SECURE\nSHOPPING"  },
              { emoji: "🎧", label: "24/7 CUSTOMER\nSUPPORT"  },
              { emoji: "🚚", label: "ON-TIME\nDELIVERY"       },
              { emoji: "⭐", label: "BEST QUALITY\nPRODUCTS"  },
            ].map(({ emoji, label }) => (
              <div key={label} className="flex items-center justify-center gap-3 px-4 py-2">
                <span style={{ fontSize: 28, flexShrink: 0 }}>{emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", whiteSpace: "pre-line", lineHeight: 1.5 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ background: "#163d26" }}>
        <div className="container mx-auto px-6 py-4 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
            © {new Date().getFullYear()} ApunBazar. All Rights Reserved.
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginRight: 4 }}>We Accept</span>
            {PAYMENTS.map(p => (
              <span key={p.label} style={{
                background: p.bg, color: p.color,
                borderRadius: 6, padding: "4px 10px",
                fontSize: 11, fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.2)",
                letterSpacing: 0.3,
              }}>{p.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Space for mobile bottom nav */}
      <div style={{ height: 16 }} />
    </footer>
  );
}
