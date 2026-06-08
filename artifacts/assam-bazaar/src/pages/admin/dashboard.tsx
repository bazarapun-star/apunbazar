import {
  useGetAdminStats,
  useGetRecentOrders,
  useGetTopProducts,
  useGetSalesByCategory,
  getGetAdminStatsQueryKey,
  getGetRecentOrdersQueryKey,
  getGetTopProductsQueryKey,
  getGetSalesByCategoryQueryKey,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ShoppingBag, Package, Users, IndianRupee, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const CHART_COLORS = ["#2d6a4f", "#e05c2f", "#f4a22a", "#3b82f6", "#a855f7"];

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats({
    query: { queryKey: getGetAdminStatsQueryKey() },
  });
  const { data: recentOrders } = useGetRecentOrders(
    { limit: 8 },
    { query: { queryKey: getGetRecentOrdersQueryKey({ limit: 8 }) } }
  );
  const { data: topProducts } = useGetTopProducts(
    { limit: 5 },
    { query: { queryKey: getGetTopProductsQueryKey({ limit: 5 }) } }
  );
  const { data: salesByCategory } = useGetSalesByCategory({
    query: { queryKey: getGetSalesByCategoryQueryKey() },
  });

  const salesData = Array.isArray(salesByCategory)
    ? salesByCategory
    : (salesByCategory as any)?.data ?? [];

  const recentOrdersData = Array.isArray(recentOrders)
    ? recentOrders
    : (recentOrders as any)?.data ?? [];

  const topProductsData = Array.isArray(topProducts)
    ? topProducts
    : (topProducts as any)?.data ?? [];

  const statCards = [
    { label: "Total Revenue", value: `₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-primary" },
    { label: "Total Orders", value: stats?.totalOrders, icon: ShoppingBag, color: "text-secondary" },
    { label: "Products", value: stats?.totalProducts, icon: Package, color: "text-accent" },
    { label: "Customers", value: stats?.totalCustomers, icon: Users, color: "text-chart-4" },
    { label: "Pending Orders", value: stats?.pendingOrders, icon: Clock, color: "text-yellow-600" },
    { label: "This Month", value: `₹${(stats?.revenueThisMonth ?? 0).toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="page-enter p-6 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back. Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-xs font-medium">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              {statsLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                <p className="font-serif text-2xl font-bold" data-testid={`stat-${stat.label.toLowerCase().replace(/ /g, "-")}`}>
                  {stat.value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales by Category Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={salesData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="categoryName"
                    tick={{ fontSize: 11 }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    formatter={(val: number) => [`₹${(val ?? 0).toLocaleString("en-IN")}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {salesData.map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-muted-foreground text-sm">
                No sales data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProductsData.map((product: any, i: number) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs font-bold w-4">{i + 1}</span>
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-tight line-clamp-1">{product.name}</p>
                    <p className="text-muted-foreground text-xs">{product.categoryName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₹{(product.revenue ?? 0).toLocaleString("en-IN")}</p>
                    <p className="text-muted-foreground text-xs">{product.totalSold ?? 0} sold</p>
                  </div>
                </div>
              ))}
              {topProductsData.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-6">No products yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
          <Link href="/admin/orders">
            <span className="text-primary text-xs font-medium hover:underline cursor-pointer">View all</span>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 pr-4 font-medium">Order</th>
                  <th className="text-left py-2 pr-4 font-medium">Customer</th>
                  <th className="text-left py-2 pr-4 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-left py-2 pr-4 font-medium">Status</th>
                  <th className="text-right py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrdersData.map((order: any) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors" data-testid={`row-order-${order.id}`}>
                    <td className="py-3 pr-4">
                      <Link href={`/admin/orders`}>
                        <span className="font-medium text-primary hover:underline cursor-pointer">{order.orderNumber}</span>
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-muted-foreground text-xs">{order.customerEmail}</p>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell text-muted-foreground text-xs">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "N/A"}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge className={`text-xs ${statusColors[order.status] ?? ""}`} variant="outline">
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown"}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-semibold">₹{(order.total ?? 0).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
                {recentOrdersData.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}