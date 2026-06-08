import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import {
  getStaffSession, staffLogout, hasPermission,
  ROLE_LABELS, ROLE_COLORS, ROLE_DESCRIPTIONS,
  PERMISSION_LABELS, loadActivities, type Permission,
} from "@/lib/staff-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut, LayoutDashboard, Package, ShoppingBag, BarChart3,
  Truck, Users, Image, SlidersHorizontal, Ticket, Settings,
  Shield, Tag, Megaphone, HeadphonesIcon, FileText,
  Clock, AlertCircle, CheckCircle2,
} from "lucide-react";

// All nav items with required permission
const ALL_NAV = [
  { p: "products"       as Permission, label: "Products",     icon: Package,          href: "/admin/products",          color: "#0369a1", desc: "Add/edit products" },
  { p: "categories"     as Permission, label: "Categories",   icon: Tag,              href: "/admin/categories",        color: "#7c3aed", desc: "Manage categories" },
  { p: "orders"         as Permission, label: "Orders",       icon: ShoppingBag,      href: "/admin/orders",            color: "#c2410c", desc: "View & manage orders" },
  { p: "analytics"      as Permission, label: "Analytics",    icon: BarChart3,        href: "/admin/analytics",         color: "#0f766e", desc: "Sales analytics" },
  { p: "coupons"        as Permission, label: "Coupons",      icon: Ticket,           href: "/admin/coupons",           color: "#be185d", desc: "Discount coupons" },
  { p: "slider"         as Permission, label: "Hero Slider",  icon: SlidersHorizontal,href: "/admin/slider",            color: "#854d0e", desc: "Homepage slider" },
  { p: "banners"        as Permission, label: "Banners",      icon: Image,            href: "/admin/banners",           color: "#1d4ed8", desc: "Page banners" },
  { p: "staff"          as Permission, label: "Staff",        icon: Users,            href: "/admin/staff",             color: "#6d28d9", desc: "Manage staff" },
  { p: "delivery"       as Permission, label: "Delivery",     icon: Truck,            href: "/admin/orders",            color: "#b45309", desc: "Delivery tracking" },
  { p: "campaigns"      as Permission, label: "Campaigns",    icon: Megaphone,        href: "/admin/banners",           color: "#be185d", desc: "Marketing campaigns" },
  { p: "support_tickets"as Permission, label: "Support",      icon: HeadphonesIcon,   href: "/admin/orders",            color: "#0f766e", desc: "Customer support" },
  { p: "reports"        as Permission, label: "Reports",      icon: FileText,         href: "/admin/analytics",         color: "#374151", desc: "Business reports" },
  { p: "settings"       as Permission, label: "Settings",     icon: Settings,         href: "/admin/settings",          color: "#6b7280", desc: "Store settings" },
  { p: "security"       as Permission, label: "Security",     icon: Shield,           href: "/admin/security",          color: "#dc2626", desc: "Security settings" },
];

export default function StaffDashboard() {
  const [, navigate]    = useLocation();
  const session         = getStaffSession();
  const [activities, setActivities] = useState(loadActivities().slice(0, 5));

  useEffect(() => {
    if (!session) navigate("/staff/login");
  }, []);

  if (!session) return null;

  const allowed  = ALL_NAV.filter(n => hasPermission(n.p));
  const blocked  = ALL_NAV.filter(n => !hasPermission(n.p));
  const roleColor = ROLE_COLORS[session.role];

  return (
    <div className="min-h-screen" style={{ background: "#f8f9fa" }}>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: roleColor }}>
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">{session.name}</p>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded"
                style={{ background: `${roleColor}18`, color: roleColor }}>
                {ROLE_LABELS[session.role]}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </span>
            <Button size="sm" variant="ghost"
              onClick={() => { staffLogout(); navigate("/staff/login"); }}
              className="gap-1.5 text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Welcome card */}
        <div className="rounded-2xl p-5 text-white relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}cc)` }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
            style={{ background: "white", transform: "translate(30%, -30%)" }} />
          <h1 className="font-serif text-xl font-bold mb-1">
            Namaste, {session.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-sm opacity-80 mb-3">{ROLE_DESCRIPTIONS[session.role]}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5 font-medium">
              ✓ {allowed.length} sections accessible
            </span>
            {blocked.length > 0 && (
              <span className="text-xs bg-white/10 rounded-full px-2 py-0.5">
                🔒 {blocked.length} restricted
              </span>
            )}
          </div>
        </div>

        {/* Permissions badges */}
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Aapke Permissions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {session.permissions.map(p => (
              <span key={p}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: `${roleColor}15`, color: roleColor }}>
                <CheckCircle2 className="h-3 w-3" />
                {PERMISSION_LABELS[p]}
              </span>
            ))}
          </div>
        </div>

        {/* Allowed sections */}
        {allowed.length > 0 && (
          <div>
            <p className="text-sm font-bold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Quick Access
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {allowed.map(item => (
                <Link key={item.p} href={item.href}>
                  <div className="bg-white border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/30">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
                      style={{ background: `${item.color}15` }}>
                      <item.icon className="h-5 w-5 transition-transform group-hover:scale-110"
                        style={{ color: item.color }} />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Restricted sections */}
        {blocked.length > 0 && (
          <div>
            <p className="text-sm font-bold mb-3 flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Restricted ({blocked.length}) — Admin se request karo
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {blocked.map(item => (
                <div key={item.p}
                  className="bg-muted/30 border border-dashed rounded-xl p-4 opacity-50 cursor-not-allowed">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-muted">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">Access restricted</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No access */}
        {allowed.length === 0 && (
          <div className="text-center py-16 bg-white border rounded-2xl">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
            <h2 className="font-serif text-lg font-bold mb-2">Koi access nahi</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Aapko abhi koi section access nahi diya gaya. Admin se contact karo aur permissions request karo.
            </p>
          </div>
        )}

        {/* Recent activity */}
        {activities.length > 0 && (
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" /> Recent Activity
            </p>
            <div className="space-y-2">
              {activities.filter(a => a.staffId === session.staffId).slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center gap-3 text-sm py-1.5 border-b last:border-0">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                    {a.action}
                  </span>
                  <span className="text-muted-foreground flex-1">{a.details}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {new Date(a.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
