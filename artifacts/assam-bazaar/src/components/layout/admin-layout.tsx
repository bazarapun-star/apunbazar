import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, ShoppingBag, Tag, ArrowLeft, LogOut, User, Settings, BarChart3, Ticket, Shield, SlidersHorizontal, Image, Layout, Users } from "lucide-react";
import { adminLogout, getAdminEmail, isAdminLoggedIn } from "@/lib/admin-auth";
import { useEffect, useRef } from "react";

const navItems = [
  { href: "/admin",                  label: "Dashboard",        icon: LayoutDashboard, exact: true },
  { href: "/admin/products",         label: "Products",         icon: Package },
  { href: "/admin/categories",       label: "Categories",       icon: Tag },
  { href: "/admin/orders",           label: "Orders",           icon: ShoppingBag },
  { href: "/admin/analytics",        label: "Analytics",        icon: BarChart3 },
  { href: "/admin/slider",           label: "Hero Slider",      icon: SlidersHorizontal, badge: "NEW", badgeClass: "bg-amber-500 text-black" },
  { href: "/admin/banners",          label: "Page Banners",     icon: Image,             badge: "NEW", badgeClass: "bg-amber-500 text-black" },
  { href: "/admin/category-banners", label: "Category Banners", icon: Layout,            badge: "NEW", badgeClass: "bg-amber-500 text-black" },
  { href: "/admin/staff",            label: "Staff",            icon: Users,             badge: "NEW", badgeClass: "bg-purple-500 text-white" },
  { href: "/admin/coupons",          label: "Coupons",          icon: Ticket },
  { href: "/admin/settings",         label: "Settings",         icon: Settings },
  { href: "/admin/security",         label: "Security",         icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) { navigate("/admin/login"); return; }
    const reset = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => { adminLogout(); navigate("/admin/login"); }, 30 * 60 * 1000);
    };
    reset();
    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("click", reset);
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("click", reset);
    };
  }, [location]);

  function handleLogout() { adminLogout(); navigate("/admin/login"); }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-56 flex-shrink-0 bg-gray-950 text-white flex flex-col border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <p className="font-serif font-bold text-white text-sm">Awesomeassam</p>
          <p className="text-gray-500 text-xs">Master Admin</p>
          <Link href="/">
            <p className="text-gray-500 text-xs mt-2 flex items-center gap-1 hover:text-gray-300 transition-colors cursor-pointer">
              <ArrowLeft className="h-3 w-3" /> Back to Store
            </p>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact ? location === item.href : location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}>
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Staff Portal shortcut */}
          <div className="pt-2 mt-2 border-t border-gray-800">
            <Link href="/staff/login">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-purple-400 hover:bg-purple-900/30 cursor-pointer transition-all">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">Staff Portal</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500 text-white flex-shrink-0">↗</span>
              </div>
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-gray-400 truncate">{getAdminEmail()}</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}