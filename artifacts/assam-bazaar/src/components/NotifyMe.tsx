import { useState } from "react";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  productId: number;
  productName: string;
}

export function NotifyMe({ productId, productName }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      const key = "apunbazar_notify";
      const notifs = JSON.parse(localStorage.getItem(key) ?? "[]");
      // Avoid duplicate
      const already = notifs.some((n: any) => n.productId === productId && n.email === email);
      if (!already) {
        notifs.push({ productId, productName, email, date: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(notifs));
      }
      setSent(true);
      toast({ title: "We will notify you! 🔔", description: "We will let you know when this product is back in stock" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  }

  if (sent) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium"
        style={{ background: "rgba(26,92,42,0.08)", color: "#1a5c2a" }}>
        <Bell className="w-4 h-4 flex-shrink-0" />
        <span>✅ We will notify you when this is available!</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border-2 border-dashed border-muted-foreground/20">
      <p className="text-sm font-semibold mb-1 flex items-center gap-2">
        <Bell className="w-4 h-4" />
        Abhi out of stock hai
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        Enter your email and we will notify you when it is back in stock.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="aapka@email.com"
          required
          className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "#1a5c2a" }}
        >
          Notify 🔔
        </button>
      </form>
    </div>
  );
}
