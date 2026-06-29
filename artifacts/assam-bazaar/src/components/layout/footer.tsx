import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

/* ─────────────────────────────────────────────────────────────────────────
 * DATA — unchanged from the original footer. Nothing here was removed;
 * two new groups (Popular Categories, Company) were added to match the
 * new design, reusing routes that already exist elsewhere in the app.
 * ───────────────────────────────────────────────────────────────────────── */
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

const POPULAR_CATEGORIES = [
  { href: "/products?category=tea",         label: "Assam Tea"      },
  { href: "/products?category=handloom",    label: "Handloom"       },
  { href: "/products?category=handicrafts", label: "Handicrafts"    },
  { href: "/products?category=organic",     label: "Organic Food"   },
  { href: "/products?category=bamboo",      label: "Bamboo"         },
];

const COMPANY_LINKS = [
  { href: "/about",          label: "About Us"           },
  { href: "/contact",        label: "Contact Us"         },
  { href: "/terms",          label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy"     },
];

const FOOTER_GROUPS = [
  { id: "quick",      title: "Quick Links",        links: QUICK_LINKS },
  { id: "service",    title: "Customer Service",    links: CUSTOMER_SERVICE },
  { id: "categories", title: "Popular Categories",  links: POPULAR_CATEGORIES },
  { id: "company",    title: "Company",             links: COMPANY_LINKS },
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

/* ── Palette ── */
const GREEN      = "#1A5C2A";
const GREEN_DARK = "#10351C";
const GOLD       = "#C17B3E";
const IVORY      = "#FAF8F2";

/* ── Payment badges — text-based, no third-party logo assets ── */
const PAYMENT_METHODS = [
  { label: "VISA",       fg: "#1A1F71", bg: "#fff"    },
  { label: "Mastercard", fg: "#fff",    bg: "#EB001B" },
  { label: "RuPay",      fg: "#fff",    bg: "#0B5FA5" },
  { label: "UPI",        fg: "#fff",    bg: "#097939" },
  { label: "G Pay",      fg: "#5F6368", bg: "#fff"    },
  { label: "PhonePe",    fg: "#fff",    bg: "#5F259F" },
  { label: "Paytm",      fg: "#fff",    bg: "#00BAF2" },
  { label: "Pay",        fg: "#fff",    bg: "#000"    },
];

export default function Footer() {
  const [socials, setSocials] = useState(loadSocials);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const onUpdate = () => setSocials(loadSocials());
    window.addEventListener("apunbazar_socials_updated", onUpdate);
    return () => window.removeEventListener("apunbazar_socials_updated", onUpdate);
  }, []);

  function handleSocialClick(key: string) {
    const url = (socials as any)[key];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  function toggleGroup(id: string) {
    setOpenGroup(prev => (prev === id ? null : id));
  }

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    toast({ title: "Subscribed!", description: "You'll hear from us with offers & new arrivals." });
    setEmail("");
  }

  return (
    <footer
      style={{ fontFamily: "'Inter', sans-serif", background: IVORY, position: "relative", overflow: "hidden" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes ab-fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .ab-fade-up { animation: ab-fade-up 0.6s ease both; }

        @keyframes ab-float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(8deg); } }
        .ab-leaf { animation: ab-float 6s ease-in-out infinite; }

        @keyframes ab-particle { 0% { transform: translateY(0) translateX(0); opacity:0; } 10% { opacity:.6; } 90% { opacity:.4; } 100% { transform: translateY(-60px) translateX(10px); opacity:0; } }
        .ab-particle { animation: ab-particle 5s linear infinite; }

        .ab-glass-btn {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.35);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          box-shadow: 0 0 0 rgba(193,123,62,0);
        }
        .ab-glass-btn:hover {
          transform: translateY(-4px) scale(1.06);
          background: rgba(255,255,255,0.26);
          box-shadow: 0 8px 20px rgba(193,123,62,0.35);
        }

        .ab-accordion-card {
          border-radius: 16px;
          background: #fff;
          border: 1px solid rgba(26,92,42,0.10);
          box-shadow: 0 2px 10px rgba(16,53,28,0.05);
          overflow: hidden;
          transition: box-shadow 0.25s ease, transform 0.2s ease;
        }
        .ab-accordion-card:hover { box-shadow: 0 6px 18px rgba(16,53,28,0.10); }

        .ab-accordion-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s ease;
        }
        .ab-accordion-body.open { grid-template-rows: 1fr; }
        .ab-accordion-body > div { overflow: hidden; min-height: 0; }

        .ab-chevron { transition: transform 0.3s ease; }
        .ab-chevron.open { transform: rotate(180deg); }

        .ab-payment-pill {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ab-payment-pill:hover { transform: translateY(-3px); box-shadow: 0 6px 14px rgba(0,0,0,0.15); }

        .ab-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
        }

        @media (min-width: 768px) {
          .ab-accordion-body { grid-template-rows: 1fr !important; }
          .ab-chevron-wrap { display: none !important; }
          .ab-accordion-toggle { cursor: default !important; }
        }
      `}</style>

      {/* ── HERO: tea garden image + wave ── */}
      <div style={{ position: "relative", width: "100%", height: 280, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=1600&q=80"
          alt="Assam tea gardens at sunrise"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(16,53,28,0.05) 0%, rgba(16,53,28,0.35) 70%, " + IVORY + " 100%)",
          }}
        />
        {/* Curved wave divider */}
        <svg
          viewBox="0 0 1440 80" preserveAspectRatio="none"
          style={{ position: "absolute", bottom: -1, left: 0, width: "100%", height: 60 }}
        >
          <path d="M0,40 C360,90 1080,0 1440,40 L1440,80 L0,80 Z" fill={IVORY} />
        </svg>

        {/* Floating leaf decoration */}
        <div className="ab-leaf" style={{ position: "absolute", top: 16, right: 20, opacity: 0.85 }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path d="M3 13c0-6 4-10 10-10 6 0 8 2 8 2s-1 9-8 11c-5 1.5-8-1-9-3z" fill="#5fae4a" opacity="0.9" />
          </svg>
        </div>
      </div>

      {/* ── LOGO + TAGLINE ── */}
      <div className="ab-fade-up" style={{ textAlign: "center", padding: "8px 20px 24px", position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <img
            src="/logo.png" alt="ApunBazar"
            style={{ height: 46, width: 46, objectFit: "contain", borderRadius: 10 }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, lineHeight: 1 }}
          >
            <span style={{ color: GREEN }}>Apun</span><span style={{ color: GOLD }}>Bazar</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
          <span className="ab-divider" style={{ width: 28 }} />
          <span style={{ color: GOLD, fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Pride of Assam
          </span>
          <span className="ab-divider" style={{ width: 28 }} />
        </div>
        <p style={{ marginTop: 14, color: "#4a5246", fontSize: 14, maxWidth: 360, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          Authentic Assam products sourced directly from local farmers and artisans.
        </p>

        {/* Social icons — glass buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
          {SOCIAL_LINKS.map(s => (
            <button
              key={s.key}
              className="ab-glass-btn"
              style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})` }}
              onClick={() => handleSocialClick(s.key)}
              aria-label={s.label}
            >
              {s.icon}
            </button>
          ))}
        </div>
      </div>

      {/* ── FOOTER LINKS — premium accordion cards ── */}
      <div style={{ padding: "0 16px 28px", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span className="ab-divider" style={{ width: 50 }} />
          <span style={{ fontFamily: "'Playfair Display', serif", color: GREEN, fontWeight: 700, fontSize: 16 }}>
            🍃 Footer Links 🍃
          </span>
          <span className="ab-divider" style={{ width: 50 }} />
        </div>

        <div
          className="ab-fade-up"
          style={{
            display: "flex", flexDirection: "column", gap: 10,
            maxWidth: 900, margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className="md:!grid md:!grid-cols-4 md:!gap-4">
            {FOOTER_GROUPS.map(group => {
              const isOpen = openGroup === group.id;
              return (
                <div key={group.id} className="ab-accordion-card">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="ab-accordion-toggle"
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px 18px", background: "transparent", border: "none", cursor: "pointer",
                      fontFamily: "'Playfair Display', serif", fontSize: 15.5, fontWeight: 600, color: GREEN_DARK,
                    }}
                  >
                    <span>{group.title}</span>
                    <span className="ab-chevron-wrap">
                      <svg
                        className={`ab-chevron ${isOpen ? "open" : ""}`}
                        width="18" height="18" viewBox="0 0 24 24" fill="none"
                      >
                        <path d="M6 9l6 6 6-6" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>

                  {/* Mobile: animated accordion. Desktop (≥768px): always expanded via CSS above. */}
                  <div className={`ab-accordion-body ${isOpen ? "open" : ""}`}>
                    <div>
                      <nav style={{ padding: "0 18px 18px" }}>
                        {group.links.map((l, i) => (
                          <Link key={l.href + l.label + i} href={l.href}>
                            <div
                              style={{
                                display: "flex", alignItems: "center", gap: 8, padding: "6px 0",
                                cursor: "pointer", textDecoration: "none",
                              }}
                            >
                              <span style={{ color: GOLD, fontSize: 13, fontWeight: 700 }}>›</span>
                              <span style={{ fontSize: 13.5, color: "#52594d" }}>{l.label}</span>
                            </div>
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── NEWSLETTER ── */}
        <div
          className="ab-fade-up"
          style={{
            maxWidth: 560, margin: "20px auto 0", borderRadius: 18,
            background: "linear-gradient(135deg, rgba(26,92,42,0.06), rgba(193,123,62,0.07))",
            border: `1px solid rgba(193,123,62,0.25)`, padding: "22px 22px 24px", position: "relative", overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{
              width: 38, height: 38, borderRadius: "50%", background: "rgba(193,123,62,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              ✉️
            </span>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: GREEN_DARK, margin: 0 }}>
                Stay Updated
              </p>
              <p style={{ fontSize: 12.5, color: "#666", margin: "2px 0 0" }}>
                Get exclusive offers and new arrivals.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                flex: 1, borderRadius: 999, border: "1px solid rgba(26,92,42,0.2)",
                padding: "10px 16px", fontSize: 13.5, outline: "none", background: "#fff", color: "#222",
              }}
            />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, #a8632e)`, color: "#fff", border: "none",
                borderRadius: 999, padding: "10px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
              }}
            >
              Subscribe <span>→</span>
            </motion.button>
          </form>
        </div>

        {/* ── PAYMENT METHODS ── */}
        <div className="ab-fade-up" style={{ textAlign: "center", marginTop: 26 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <span className="ab-divider" style={{ width: 40 }} />
            <span style={{ fontFamily: "'Playfair Display', serif", color: GREEN, fontWeight: 700, fontSize: 14 }}>
              Payment Methods
            </span>
            <span className="ab-divider" style={{ width: 40 }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, maxWidth: 480, margin: "0 auto" }}>
            {PAYMENT_METHODS.map(p => (
              <span
                key={p.label}
                className="ab-payment-pill"
                style={{
                  background: p.bg, color: p.fg, fontSize: 11, fontWeight: 700,
                  padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)",
                  letterSpacing: 0.3,
                }}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ background: GREEN_DARK, borderTop: `2px solid ${GOLD}`, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="ab-particle"
            style={{
              position: "absolute", bottom: 6, left: `${10 + i * 20}%`,
              width: 3, height: 3, borderRadius: "50%", background: GOLD,
              animationDelay: `${i * 1.1}s`,
            }}
          />
        ))}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
          {/* Simplified Assam state outline */}
          <svg width="46" height="40" viewBox="0 0 100 90" fill="none">
            <path
              d="M10 30 C20 15, 35 10, 45 18 C55 8, 70 12, 75 22 C88 24, 95 35, 88 45 C92 55, 85 65, 72 62 C68 75, 52 80, 42 70 C28 78, 12 70, 14 55 C4 50, 2 38, 10 30 Z"
              stroke={GOLD} strokeWidth="1.6" fill="none" opacity="0.9"
            />
          </svg>
          <p style={{ fontSize: 12.5, color: "rgba(250,248,242,0.85)", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
            Made with <span style={{ color: "#e0654f" }}>♥</span> in Assam
          </p>
          <div className="ab-divider" style={{ width: 120, margin: "4px 0" }} />
          <p style={{ fontSize: 11.5, color: "rgba(250,248,242,0.55)", margin: 0, textAlign: "center" }}>
            © {new Date().getFullYear()} ApunBazar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
