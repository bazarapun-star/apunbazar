import { Link } from "wouter";
import { useState, useEffect } from "react";

const SHOP_CATEGORIES = [
  { href: "/category/tea",          label: "Assam Tea"        },
  { href: "/category/handloom",     label: "Handloom & Silk"  },
  { href: "/category/handicrafts",  label: "Handicrafts"      },
  { href: "/category/organic",      label: "Organic Foods"    },
  { href: "/category/bamboo",       label: "Bamboo Products"  },
  { href: "/category/gamusa",       label: "Gamusa & Gamosa"  },
  { href: "/category/lifestyle",    label: "Home & Lifestyle" },
  { href: "/category/hampers",      label: "Gift Hampers"     },
];

const CUSTOMER_SERVICE = [
  { href: "/orders",               label: "My Orders"          },
  { href: "/orders",               label: "Track Order"        },
  { href: "/refund-policy",        label: "Returns & Refunds"  },
  { href: "/shipping-policy",      label: "Shipping Policy"    },
  { href: "/cancellation-policy",  label: "Cancellation Policy"},
  { href: "/faq",                  label: "FAQ's"              },
  { href: "/contact",              label: "Contact Us"         },
  { href: "/bulk-orders",          label: "Bulk Orders"        },
];

const ABOUT_LINKS = [
  { href: "/about",          label: "About Us"           },
  { href: "/artisans",       label: "Our Artisans"       },
  { href: "/story",          label: "Our Story"          },
  { href: "/sustainability", label: "Sustainability"     },
  { href: "/blog",           label: "Blog"               },
  { href: "/careers",        label: "Careers"            },
  { href: "/privacy-policy", label: "Privacy Policy"    },
  { href: "/terms",          label: "Terms & Conditions" },
];

const TRUST_BADGES = [
  { icon: "🛡️", label: "100% Authentic"        },
  { icon: "🌿", label: "Natural & Organic"      },
  { icon: "👥", label: "Support Local Artisans" },
  { icon: "🚚", label: "Fast & Safe Delivery"   },
];

const PAYMENTS = ["VISA", "Mastercard", "RuPay", "UPI", "Paytm"];

const INFO_ITEMS = [
  { icon: "🎧", title: "Need Help?",           lines: ["+91 70027 12345", "support@apunbazar.com"] },
  { icon: "🕐", title: "Working Hours",        lines: ["Mon - Sat: 9AM - 8PM", "Sun: 10AM - 6PM"]  },
  { icon: "📍", title: "Our Office",           lines: ["Guwahati, Assam", "India - 781001"]         },
  { icon: "🌍", title: "We Ship Across India", lines: ["Delivering happiness to", "every corner of India"] },
];

// Social icons using official SVG/PNG from CDN
const SOCIAL_DEFS = [
  {
    key: "facebook",
    label: "Facebook",
    bg: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    bg: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    bg: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    bg: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    bg: "#000000",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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

function NavRow({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center justify-between py-2.5 cursor-pointer group"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-sm transition-colors group-hover:text-white"
          style={{ color: "rgba(232,226,208,0.7)" }}>{label}</span>
        <span className="text-xs group-hover:text-yellow-400"
          style={{ color: "rgba(232,226,208,0.25)" }}>›</span>
      </div>
    </Link>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(201,168,76,0.6),transparent)" }} />
      <span style={{ color: "#c9a84c", fontSize: 10, fontWeight: 700, letterSpacing: 3 }}>✦ {label} ✦</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(270deg,rgba(201,168,76,0.6),transparent)" }} />
    </div>
  );
}

function NavCard({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <SectionHeading label={title} />
      <nav className="mt-2">{links.map(l => <NavRow key={l.href + l.label} href={l.href} label={l.label} />)}</nav>
    </div>
  );
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
    <footer style={{ background: "#0f1f0f", color: "#e8e2d0" }}>

      {/* Gamusa stripe */}
      <div style={{ height: 5, background: "repeating-linear-gradient(90deg,#c9a84c 0,#c9a84c 8px,transparent 8px,transparent 14px,#2d6e3e 14px,#2d6e3e 16px,transparent 16px,transparent 22px)" }} />

      <div className="container mx-auto px-4 py-10 max-w-6xl">

        {/* ── BRAND ── */}
        <div className="flex items-center gap-3 mb-3">
          {/* Real logo — uses /logo.png from public folder */}
          <img
            src="/logo.png"
            alt="ApunBazar Logo"
            style={{ width: 48, height: 48, objectFit: "contain" }}
            onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/48x48/1a5c2a/ffffff?text=AB"; }}
          />
          <span style={{ fontFamily: "'Georgia',serif", fontSize: 24, fontWeight: 700 }}>
            <span style={{ color: "#7fcc93" }}>Apun</span>
            <span style={{ color: "#c9a84c" }}>Bazar</span>
          </span>
        </div>

        <p style={{ color: "rgba(232,226,208,0.55)", fontSize: 13, lineHeight: 1.75, maxWidth: 400, marginBottom: 20 }}>
          Bringing you the finest Assamese products –<br />
          Pure, Authentic &amp; Handmade with love from Assam.
        </p>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {TRUST_BADGES.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2 py-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <span style={{ fontSize: 28 }}>{icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(232,226,208,0.8)", lineHeight: 1.4 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Link grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <NavCard title="SHOP BY CATEGORY" links={SHOP_CATEGORIES} />
          <NavCard title="ABOUT APUNBAZAR"  links={ABOUT_LINKS} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <NavCard title="CUSTOMER SERVICE" links={CUSTOMER_SERVICE} />

          {/* Newsletter */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="p-5">
              <SectionHeading label="STAY UPDATED" />
              <p style={{ color: "rgba(232,226,208,0.55)", fontSize: 13, lineHeight: 1.7, margin: "12px 0 16px" }}>
                Subscribe to get exclusive offers, new arrivals &amp; festival deals.
              </p>
              {subscribed ? (
                <div style={{ background: "rgba(74,138,90,0.15)", border: "1px solid rgba(74,138,90,0.3)", borderRadius: 12, padding: "12px 16px", color: "#7fcc93", fontSize: 13 }}>
                  🎉 Subscribed! Welcome to the community.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 rounded-xl px-3"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)" }}>
                    <span style={{ fontSize: 14, opacity: 0.5 }}>✉️</span>
                    <input type="email" value={email} onChange={e => { setEmail(e.target.value); setEmailErr(""); }}
                      placeholder="Enter your email address"
                      style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 13, padding: "12px 0" }} />
                  </div>
                  {emailErr && <p style={{ color: "#f87171", fontSize: 11 }}>{emailErr}</p>}
                  <button type="submit" style={{ background: "#c9a84c", color: "#1a2e1a", border: "none", padding: "13px 20px", fontSize: 14, fontWeight: 700, borderRadius: 12, cursor: "pointer" }}>
                    Subscribe Now →
                  </button>
                </form>
              )}
            </div>
            <div style={{ height: 160, overflow: "hidden" }}>
              <img src="https://fluffy-turquoise-nrh4nnn6.edgeone.app/e6db8e17-808e-42bd-90d9-17accd20c999.png" alt="Assam tea"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          </div>
        </div>

        {/* ── FOLLOW US — real SVG icons, clickable ── */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <SectionHeading label="FOLLOW US" />
          <p style={{ color: "rgba(232,226,208,0.45)", fontSize: 11, marginTop: 6, marginBottom: 16 }}>
            Follow us for daily updates, offers &amp; Assamese culture
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {SOCIAL_DEFS.map(s => {
              const url = (socials as any)[s.key];
              const hasLink = !!url;
              return (
                <button
                  key={s.key}
                  onClick={() => handleSocialClick(s.key)}
                  aria-label={s.label}
                  title={hasLink ? `Open ${s.label}` : `${s.label} — Admin Settings me link add karein`}
                  style={{
                    width: 50, height: 50, borderRadius: 14,
                    background: s.bg,
                    border: hasLink ? "none" : "2px dashed rgba(255,255,255,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: hasLink ? "pointer" : "not-allowed",
                    opacity: hasLink ? 1 : 0.45,
                    transition: "transform 0.18s cubic-bezier(.34,1.56,.64,1), opacity 0.15s",
                    flexShrink: 0,
                    padding: 0,
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => { if (hasLink) (e.currentTarget as HTMLElement).style.transform = "scale(1.12) translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1) translateY(0)"; }}
                >
                  {s.icon}
                  {/* "ADD" overlay when link not set */}
                 
                </button>
              );
            })}
          </div>
          {!Object.values(socials).some(Boolean) && (
            <p style={{ color: "rgba(201,168,76,0.55)", fontSize: 10.5, marginTop: 12, fontStyle: "italic" }}>
              
            </p>
          )}
        </div>

        {/* Info bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {INFO_ITEMS.map(({ icon, title, lines }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2 py-5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(201,168,76,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
              <p style={{ fontWeight: 700, fontSize: 13, color: "#e8e2d0" }}>{title}</p>
              {lines.map(l => <p key={l} style={{ fontSize: 11, color: "rgba(232,226,208,0.5)", lineHeight: 1.6 }}>{l}</p>)}
            </div>
          ))}
        </div>

        {/* Payments */}
        <div className="flex flex-wrap items-center gap-3 justify-between rounded-2xl px-5 py-4 mb-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 16 }}>🔒</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,226,208,0.7)" }}>Secure Payments</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PAYMENTS.map(p => (
              <span key={p} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "rgba(232,226,208,0.8)" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container mx-auto px-4 py-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <p style={{ color: "rgba(232,226,208,0.35)", fontSize: 12 }}>© {new Date().getFullYear()} ApunBazar. All rights reserved.</p>
          <p style={{ color: "rgba(232,226,208,0.35)", fontSize: 12 }}>Made with ❤️ in Assam</p>
        </div>
      </div>

      {/* Space for mobile bottom nav */}
      <div style={{ height: 16 }} />
    </footer>
  );
}