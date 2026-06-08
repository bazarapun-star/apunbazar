import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 page-enter">
      <div className="text-center max-w-sm">
        <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
          style={{ background: "linear-gradient(135deg,rgba(26,90,50,.12),rgba(193,123,62,.12))" }}>
          🌿
        </div>
        <h1 className="font-serif font-bold mb-2" style={{ fontSize: 72, color: "#1a5c2a", lineHeight: 1 }}>404</h1>
        <h2 className="font-serif text-2xl font-bold mb-3">Page nahi mili</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
          Yeh page Assam ke tea gardens mein kho gayi hai. Chalo wapas chalte hain!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto"><Home className="h-4 w-4" /> Home par jao</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Search className="h-4 w-4" /> Products browse karo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
