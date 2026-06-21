import { Link, useLocation } from "wouter";
import { useCart, useWishlist } from "@/hooks/use-shop-data";
import { ShoppingCart, Heart, Menu, ChevronDown, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const G    = "#1a5a32";
const GOLD = "#c9a84c";

export default function Navbar() {
  const { cart }             = useCart();
  const { wishlist }         = useWishlist();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [hoveredMain, setHoveredMain] = useState<number | null>(null);
  const [scrolled, setScrolled]       = useState(false);

  const { data: tree = [] } = useQuery({
    queryKey: ["categories-tree"],
    queryFn: async () => {
      const r = await fetch("/api/categories/tree");
      return r.ok ? r.json() : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const cartCount = cart?.itemCount || 0;
  const wishCount = (wishlist as any[])?.length || 0;

  return (
    <>
      <style>{`
        .nb-icon-btn {
          width: 38px; height: 38px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid rgba(0,0,0,0.09);
          background: #fff;
          cursor: pointer; position: relative;
          transition: border-color .2s, box-shadow .2s, transform .15s;
          -webkit-tap-highlight-color: transparent;
        }
        .nb-icon-btn:hover { border-color: rgba(0,0,0,0.18); box-shadow: 0 2px 10px rgba(0,0,0,0.08); transform: scale(1.04); }
        .nb-badge { position:absolute; top:-4px; right:-4px; min-width:17px; height:17px; border-radius:9px; font-size:9px; font-weight:800; color:#fff; display:flex; align-items:center; justify-content:center; padding:0 3px; border:2px solid #fff; }
        @keyframes nb-pop { 0%{transform:scale(.6)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
        .nb-badge { animation: nb-pop .3s cubic-bezier(.34,1.56,.64,1); }
      `}</style>

      {/* Announcement bar — desktop only */}
      <div
        className="hidden sm:flex items-center justify-center gap-6 py-1.5 px-4 text-[11px] font-medium tracking-wide"
        style={{ background: "#1a3a1a", color: "rgba(255,255,255,.75)" }}
      >
        <span>🚚 Free shipping above ₹499</span>
        <span style={{ color: "rgba(255,255,255,.2)" }}>|</span>
        <span>🌿 100% authentic Assamese products</span>
        <span style={{ color: "rgba(255,255,255,.2)" }}>|</span>
        <Link href="/products">
          <span className="underline underline-offset-2 cursor-pointer" style={{ color: GOLD }}>
            Shop Now →
          </span>
        </Link>
      </div>

      {/* Main header */}
      <header
        className="sticky top-0 z-50 w-full transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,.97)" : "#fff",
          boxShadow: scrolled
            ? "0 2px 20px rgba(0,0,0,.09)"
            : "0 1px 0 rgba(0,0,0,.06)",
          backdropFilter: scrolled ? "blur(14px)" : "none",
        }}
      >
        <div
          className="flex items-center justify-between px-3"
          style={{ height: 60 }}
        >
          {/* Left — hamburger (mobile) */}
          <button
            onClick={() => setMobileOpen(true)}
            className="nb-icon-btn lg:hidden"
            aria-label="Menu"
          >
            <Menu style={{ width: 18, height: 18, color: "#333" }} />
          </button>

          {/* Desktop left nav */}
          <nav className="hidden lg:flex items-center gap-0.5 text-sm font-medium">
            <Link href="/products">
              <span className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                location === "/products"
                  ? "font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`} style={location === "/products" ? { color: G } : {}}>
                Shop All
              </span>
            </Link>
            {(tree as any[]).slice(0, 5).map((main: any) => (
              <div
                key={main.id}
                className="relative"
                onMouseEnter={() => setHoveredMain(main.id)}
                onMouseLeave={() => setHoveredMain(null)}
              >
                <Link href={`/category/${main.slug}`}>
                  <span className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    location.includes(main.slug)
                      ? "font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`} style={location.includes(main.slug) ? { color: G } : {}}>
                    {main.name}
                    {main.subCategories?.length > 0 && <ChevronDown className="h-3.5 w-3.5 opacity-50" />}
                  </span>
                </Link>
                {hoveredMain === main.id && main.subCategories?.length > 0 && (
                  <div
                    className="absolute top-full left-0 bg-white border rounded-xl py-2 min-w-48 z-50"
                    style={{ boxShadow: "0 16px 48px rgba(0,0,0,.12)" }}
                  >
                    {main.subCategories.map((sub: any) => (
                      <Link key={sub.id} href={`/category/${sub.slug}`}>
                        <span className="block px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors cursor-pointer font-medium">
                          {sub.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Center — Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 select-none"
          >
            <img
              src="/logo.png"
              alt="ApunBazar"
              style={{ height: 40, width: "auto", objectFit: "contain" }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            {/* Fallback text logo if image fails */}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800, fontSize: "1.25rem", lineHeight: 1,
              }}
            >
              <span style={{ color: G }}>Apun</span>
              <span style={{ color: "#e8920a" }}>Bazar</span>
            </span>
          </Link>

          {/* Right — Wishlist + Cart */}
          <div className="flex items-center gap-2">
            <Link href="/wishlist">
              <button className="nb-icon-btn" aria-label="Wishlist">
                <Heart
                  style={{
                    width: 18, height: 18,
                    color:  wishCount > 0 ? "#f43f5e" : "#444",
                    fill:   wishCount > 0 ? "#f43f5e" : "none",
                    transition: "all .2s",
                  }}
                />
                {wishCount > 0 && (
                  <span className="nb-badge" style={{ background: "#f43f5e" }}>
                    {wishCount > 9 ? "9+" : wishCount}
                  </span>
                )}
              </button>
            </Link>

            <Link href="/cart">
              <button className="nb-icon-btn" aria-label="Cart">
                <ShoppingCart style={{ width: 18, height: 18, color: "#444" }} />
                {cartCount > 0 && (
                  <span className="nb-badge" style={{ background: G }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-16 border-b flex-shrink-0">
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: "1.15rem" }}>
                <span style={{ color: G }}>Apun</span>
                <span style={{ color: "#e8920a" }}>Bazar</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-3 px-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Browse</p>
              <Link href="/products">
                <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted transition-colors mb-0.5" style={{ color: G }}>
                  🛍️ All Products
                </span>
              </Link>
              {(tree as any[]).map((main: any) => (
                <div key={main.id}>
                  <Link href={`/category/${main.slug}`}>
                    <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors mb-0.5">
                      {main.name}
                    </span>
                  </Link>
                  {main.subCategories?.slice(0, 3).map((sub: any) => (
                    <Link key={sub.id} href={`/category/${sub.slug}`}>
                      <span className="block pl-8 pr-3 py-2 text-xs text-muted-foreground hover:bg-muted rounded-lg mb-0.5">
                        · {sub.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}

              <div className="mt-4 pt-4 border-t">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Account</p>
                {[
                  { href: "/orders",   label: "📦 My Orders" },
                  { href: "/wishlist", label: "❤️ Wishlist"  },
                  { href: "/cart",     label: "🛒 Cart"      },
                ].map(l => (
                  <Link key={l.href} href={l.href}>
                    <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors mb-0.5">
                      {l.label}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Info</p>
                {[
                  { href: "/about",         label: "About Us"      },
                  { href: "/contact",       label: "Contact"       },
                  { href: "/refund-policy", label: "Refund Policy" },
                ].map(l => (
                  <Link key={l.href} href={l.href}>
                    <span className="block px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg mb-0.5">
                      {l.label}
                    </span>
                  </Link>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t bg-muted/30 flex-shrink-0">
              <p className="text-xs text-muted-foreground">📍 Delivering across India from Assam 🌿</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
