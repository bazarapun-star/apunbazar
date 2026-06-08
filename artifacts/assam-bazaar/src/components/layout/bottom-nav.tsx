import { Link, useLocation } from "wouter";
import { Home, ShoppingCart, Heart, Package, Search } from "lucide-react";
import { useCart, useWishlist } from "@/hooks/use-shop-data";

const NAV_ITEMS = [
  { href: "/",         icon: Home,         label: "Home" },
  { href: "/products", icon: Search,       label: "Shop" },
  { href: "/cart",     icon: ShoppingCart, label: "Cart" },
  { href: "/wishlist", icon: Heart,        label: "Saved" },
  { href: "/orders",   icon: Package,      label: "Orders" },
];

export default function BottomNav() {
  const [location] = useLocation();
  const { cart }    = useCart();
  const { wishlist } = useWishlist();

  const cartCount = cart?.itemCount || 0;
  const wishCount = (wishlist as any[])?.length || 0;

  // Admin/staff pages pe bottom nav nahi dikhega
  if (location.startsWith("/admin") || location.startsWith("/staff")) return null;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive =
          href === "/" ? location === "/" : location.startsWith(href);
        const isBadged = href === "/cart" && cartCount > 0;
        const isWishBadged = href === "/wishlist" && wishCount > 0;

        return (
          <Link key={href} href={href} className="flex-1">
            <div
              className="flex flex-col items-center justify-center gap-0.5 py-2 w-full h-full transition-all duration-200"
              style={{ color: isActive ? "#1a5c2a" : "rgba(0,0,0,0.4)" }}
            >
              <div className="relative">
                <Icon
                  className="h-[22px] w-[22px] transition-all duration-200"
                  style={{
                    strokeWidth: isActive ? 2.2 : 1.6,
                    fill: isActive && (href === "/wishlist" && wishCount > 0)
                      ? "#f43f5e" : "none",
                    color: isActive
                      ? "#1a5c2a"
                      : (href === "/wishlist" && wishCount > 0)
                        ? "#f43f5e" : "rgba(0,0,0,0.4)",
                  }}
                />
                {(isBadged || isWishBadged) && (
                  <span
                    className="absolute -top-1 -right-1.5 h-4 w-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                    style={{ background: isBadged ? "#1a5c2a" : "#f43f5e" }}
                  >
                    {isBadged ? (cartCount > 9 ? "9+" : cartCount) : (wishCount > 9 ? "9+" : wishCount)}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-medium leading-none"
                style={{ color: isActive ? "#1a5c2a" : "rgba(0,0,0,0.4)" }}
              >
                {label}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-0 h-0.5 w-8 rounded-full"
                  style={{ background: "#1a5c2a" }}
                />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
