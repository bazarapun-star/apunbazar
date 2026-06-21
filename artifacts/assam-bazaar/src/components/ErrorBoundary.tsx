import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, ShoppingBag } from "lucide-react";

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error; isChunkError: boolean }

const RELOAD_FLAG_KEY = "apunbazar_chunk_reload_attempted";

function isChunkLoadError(error?: Error): boolean {
  if (!error) return false;
  const msg = error.message || "";
  return (
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Loading chunk") ||
    msg.includes("Loading CSS chunk") ||
    msg.includes("error loading dynamically imported module") ||
    msg.includes("Importing a module script failed")
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isChunkError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isChunkError: isChunkLoadError(error) };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info);

    // Stale JS chunk after a new deploy — auto-reload once, silently.
    // This is the #1 cause of "Failed to fetch dynamically imported module".
    if (isChunkLoadError(error)) {
      const alreadyTried = sessionStorage.getItem(RELOAD_FLAG_KEY);
      if (!alreadyTried) {
        sessionStorage.setItem(RELOAD_FLAG_KEY, "1");
        window.location.reload();
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem(RELOAD_FLAG_KEY);
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const { isChunkError } = this.state;

      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 page-enter">
          <div className="text-center max-w-sm">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
              style={{ background: "linear-gradient(135deg,rgba(26,90,50,.12),rgba(193,123,62,.12))" }}
            >
              🌿
            </div>

            <h1
              className="font-serif font-bold mb-2"
              style={{ fontSize: 56, color: "#1a5c2a", lineHeight: 1 }}
            >
              Oops!
            </h1>

            <h2 className="font-serif text-2xl font-bold mb-3">
              {isChunkError ? "Naya update aaya hai" : "Kuch galat ho gaya"}
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
              {isChunkError
                ? "Lagta hai page ka naya version aa gaya hai. Bas ek baar refresh karo, sab theek ho jaayega."
                : "Yeh page Assam ke tea gardens mein kho gaya hai. Chalo wapas chalte hain!"}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReload} className="gap-2 w-full sm:w-auto">
                <RefreshCw className="h-4 w-4" /> {isChunkError ? "Refresh karo" : "Home par jao"}
              </Button>
              {!isChunkError && (
                <Button
                  variant="outline"
                  className="gap-2 w-full sm:w-auto"
                  onClick={() => { window.location.href = "/products"; }}
                >
                  <ShoppingBag className="h-4 w-4" /> Continue Shopping
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
