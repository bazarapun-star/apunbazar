import { Component, type ReactNode } from "react";
import { RefreshCw, ShoppingBag } from "lucide-react";

const G = "#1a5c2a";

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
        <div style={{
          background: "#faf8f3", minHeight: "70vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px 16px", fontFamily: "'Nunito', sans-serif",
        }}>
          <div style={{
            maxWidth: 420, width: "100%", borderRadius: 24, overflow: "hidden",
            background: "#fff", border: "1px solid #ece6d8",
            boxShadow: "0 10px 36px rgba(0,0,0,0.07)",
          }}>
            <div style={{ position: "relative", height: 130 }}>
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=75"
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />
            </div>
            <div style={{ padding: "26px 24px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🌿</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#2a2018", margin: "0 0 10px" }}>
                {isChunkError ? "Naya update aaya hai" : "Kuch galat ho gaya"}
              </h2>
              <p style={{ fontSize: 13, color: "#6b6253", lineHeight: 1.6, margin: "0 0 22px" }}>
                {isChunkError
                  ? "Lagta hai page ka naya version aa gaya hai. Bas ek baar refresh karo, sab theek ho jaayega."
                  : "Yeh page Assam ke tea gardens mein kho gaya hai. Chalo wapas chalte hain!"}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                <button
                  onClick={this.handleReload}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: G, color: "#fff", border: "none",
                    borderRadius: 10, padding: "11px 20px",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  <RefreshCw size={15} />
                  {isChunkError ? "Refresh karo" : "Refresh karo"}
                </button>
                <button
                  onClick={() => { window.location.href = "/"; }}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "#fff", color: G,
                    border: `1.5px solid ${G}`, borderRadius: 10,
                    padding: "11px 20px", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  🏠 Home par jao
                </button>
                {!isChunkError && (
                  <button
                    onClick={() => { window.location.href = "/products"; }}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      background: "#fff3d6", color: "#b07a0d",
                      border: "1.5px solid #e8c84a", borderRadius: 10,
                      padding: "11px 20px", fontSize: 13, fontWeight: 700,
                      cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    <ShoppingBag size={15} /> Shopping karo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
