import { BarChart3, TrendingUp, ShoppingBag, Users, DollarSign, Package } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "₹1,24,500", change: "+12%", icon: DollarSign, color: "#1a5c2a" },
  { label: "Total Orders", value: "342", change: "+8%", icon: ShoppingBag, color: "#e8920a" },
  { label: "Total Products", value: "48", change: "+3%", icon: Package, color: "#2563eb" },
  { label: "Total Users", value: "1,204", change: "+18%", icon: Users, color: "#7c3aed" },
];

export default function AdminAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Store performance overview</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: s.color + "20"}}>
                <s.icon className="h-5 w-5" style={{color: s.color}} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{s.change}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Revenue This Month</h3>
          <div className="space-y-3">
            {["Week 1", "Week 2", "Week 3", "Week 4"].map((w, i) => {
              const widths = [45, 72, 58, 88];
              return (
                <div key={w} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12">{w}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full bg-primary" style={{width: `${widths[i]}%`}} />
                  </div>
                  <span className="text-xs font-medium">₹{[28000, 45000, 32000, 19500][i].toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Top Categories</h3>
          <div className="space-y-3">
            {[
              { name: "Assam Tea", pct: 38, color: "#1a5c2a" },
              { name: "Handloom", pct: 28, color: "#e8920a" },
              { name: "Handicrafts", pct: 20, color: "#2563eb" },
              { name: "Organic Food", pct: 14, color: "#7c3aed" },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-24">{c.name}</span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="h-2 rounded-full" style={{width: `${c.pct}%`, background: c.color}} />
                </div>
                <span className="text-xs font-medium">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}