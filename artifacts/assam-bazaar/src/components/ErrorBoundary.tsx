import { Component, type ReactNode } from "react";
import { RefreshCw, Home, ShoppingBag } from "lucide-react";

const G = "#1a5c2a";
const GOLD = "#c9a84c";

const TEA_GARDEN_IMAGE =
  "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=2000&q=80";

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

// Injected once per page so the animations + Playfair Display font are
// available without adding a separate stylesheet or font dependency check.
function injectErrorBoundaryStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("ab-errorboundary-styles")) return;

  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap";
  document.head.appendChild(fontLink);

  const style = document.createElement("style");
  style.id = "ab-errorboundary-styles";
  style.textContent = `
    @keyframes ab-rise {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes ab-pan {
      0%   { transform: scale(1.08) translate(0, 0); }
      50%  { transform: scale(1.14) translate(-1.2%, -1%); }
      100% { transform: scale(1.08) translate(0, 0); }
    }
    @keyframes ab-float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-14px) rotate(4deg); }
    }
    @keyframes ab-float-rev {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(12px) rotate(-5deg); }
    }
    @keyframes ab-glow-spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes ab-shimmer-sweep {
      0%   { transform: translateX(-130%) skewX(-12deg); }
      100% { transform: translateX(230%) skewX(-12deg); }
    }
    @keyframes ab-spin {
      to { transform: rotate(360deg); }
    }
    @keyframes ab-pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(201,168,76,0.45); }
      70%  { box-shadow: 0 0 0 14px rgba(201,168,76,0); }
      100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
    }
    .ab-stage {
      opacity: 0;
      animation: ab-rise 0.85s cubic-bezier(.22,1,.36,1) forwards;
    }
    .ab-bg-pan { animation: ab-pan 26s ease-in-out infinite; }
    .ab-leaf-a { animation: ab-float 7s ease-in-out infinite; }
    .ab-leaf-b { animation: ab-float-rev 9s ease-in-out infinite; }
    .ab-leaf-c { animation: ab-float 8.5s ease-in-out infinite 1.2s; }
    .ab-ring-spin { animation: ab-glow-spin 18s linear infinite; }
    .ab-card-pulse { animation: ab-pulse-ring 2.6s ease-out infinite; }
    .ab-btn-primary { position: relative; overflow: hidden; }
    .ab-btn-primary::after {
      content: "";
      position: absolute;
      top: 0; left: 0;
      width: 45%; height: 100%;
      background: linear-gradient(115deg, transparent, rgba(255,255,255,0.55), transparent);
      transform: translateX(-130%) skewX(-12deg);
    }
    .ab-btn-primary:hover::after { animation: ab-shimmer-sweep 1.1s ease forwards; }
    .ab-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(201,168,76,0.5); }
    .ab-btn-primary:active { transform: translateY(0) scale(0.98); }
    .ab-btn-ghost:hover { transform: translateY(-2px); background: rgba(255,255,255,0.18) !important; }
    .ab-btn-ghost:active { transform: translateY(0) scale(0.98); }
    .ab-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(201,168,76,0.35); }
    .ab-btn-gold:active { transform: translateY(0) scale(0.98); }
    .ab-refresh-spin { animation: ab-spin 0.85s linear infinite; display: inline-flex; }
    @media (prefers-reduced-motion: reduce) {
      .ab-stage, .ab-bg-pan, .ab-leaf-a, .ab-leaf-b, .ab-leaf-c,
      .ab-ring-spin, .ab-card-pulse, .ab-btn-primary::after, .ab-refresh-spin {
        animation: none !important;
      }
      .ab-stage { opacity: 1; transform: none; }
    }
  `;
  document.head.appendChild(style);
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

  componentDidMount() {
    injectErrorBoundaryStyles();
  }

  componentDidUpdate() {
    if (this.state.hasError) injectErrorBoundaryStyles();
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

      const title = isChunkError ? "ApunBazar Updated" : "filding sete";
      const subtitle = isChunkError
        ? "A better shopping experience is ready for you."
        : "2 din baad ana.";
      const description = isChunkError
        ? "We've improved ApunBazar with faster performance, better security, and new features. Refresh once to continue shopping."
        : "Koi baat nahi — aisa kabhi-kabhi ho jaata hai. amejon eya fibcart se khelid lo bhai .";

      return (
        <div
          style={{
            position: "relative",
            minHeight: "100vh",
            width: "100%",
            overflow: "hidden",
            background: "#0c2913",
            fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif",
          }}
        >
          {/* Background: blurred tea garden + deep green overlay */}
          <div style={{ position: "absolute", inset: 0 }}>
            <div
              className="ab-bg-pan"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${TEA_GARDEN_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(6px) saturate(1.05)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(160deg, rgba(13,46,16,0.94) 0%, rgba(26,92,42,0.88) 45%, rgba(8,28,12,0.96) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 50% 38%, transparent 0%, rgba(5,18,8,0.35) 75%, rgba(3,12,5,0.65) 100%)",
              }}
            />
          </div>

          {/* Drifting tea-leaf motifs */}
          <svg className="ab-leaf-a" style={{ position: "absolute", left: "6%", top: "14%", opacity: 0.25 }} width="46" height="46" viewBox="0 0 24 24" fill={GOLD} aria-hidden="true">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z" />
          </svg>
          <svg className="ab-leaf-b" style={{ position: "absolute", right: "8%", top: "22%", opacity: 0.2 }} width="34" height="34" viewBox="0 0 24 24" fill="#e8d5a0" aria-hidden="true">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z" />
          </svg>
          <svg className="ab-leaf-c" style={{ position: "absolute", left: "12%", bottom: "16%", opacity: 0.15 }} width="40" height="40" viewBox="0 0 24 24" fill={GOLD} aria-hidden="true">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z" />
          </svg>
          <svg className="ab-leaf-b" style={{ position: "absolute", right: "10%", bottom: "20%", opacity: 0.15 }} width="28" height="28" viewBox="0 0 24 24" fill="#e8d5a0" aria-hidden="true">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z" />
          </svg>

          {/* Center stage */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              minHeight: "100vh",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 20px",
            }}
          >
            <div style={{ width: "100%", maxWidth: 440 }}>
              {/* Glassmorphism card */}
              <div
                className="ab-stage"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 32,
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "40px 28px",
                  textAlign: "center",
                  boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(24px) saturate(140%)",
                  WebkitBackdropFilter: "blur(24px) saturate(140%)",
                  animationDelay: "0.05s",
                }}
              >
                {/* Inner gold border glow */}
                <div
                  style={{
                    pointerEvents: "none",
                    position: "absolute",
                    inset: 0,
                    borderRadius: 32,
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 0 0 1px rgba(201,168,76,0.12)",
                  }}
                />

                {/* Rotating gold halo behind badge */}
                <div style={{ position: "relative", margin: "0 auto 24px", display: "flex", height: 80, width: 80, alignItems: "center", justifyContent: "center" }}>
                  <div
                    className="ab-ring-spin"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      opacity: 0.7,
                      background:
                        "conic-gradient(from 0deg, rgba(201,168,76,0.55), rgba(201,168,76,0) 30%, rgba(201,168,76,0) 70%, rgba(201,168,76,0.55))",
                      filter: "blur(2px)",
                    }}
                  />
                  <div
                    className="ab-card-pulse"
                    style={{
                      position: "relative",
                      display: "flex",
                      height: 64,
                      width: 64,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "linear-gradient(160deg, rgba(201,168,76,0.95), rgba(180,140,50,0.95))",
                      boxShadow: "0 8px 24px rgba(201,168,76,0.35)",
                    }}
                  >
                    <span style={{ fontSize: 30 }} role="img" aria-label="leaf">🌿</span>
                  </div>
                </div>

                {/* Title */}
                <h2
                  className="ab-stage"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.7rem",
                    fontWeight: 800,
                    lineHeight: 1.25,
                    color: "#fff",
                    margin: "0 0 10px",
                    animationDelay: "0.16s",
                  }}
                >
                  {title}
                </h2>

                {/* Subtitle */}
                <p
                  className="ab-stage"
                  style={{
                    fontSize: "0.97rem",
                    fontWeight: 500,
                    color: "#e8d5a0",
                    margin: "0 0 16px",
                    animationDelay: "0.24s",
                  }}
                >
                  {subtitle}
                </p>

                {/* Divider */}
                <div
                  className="ab-stage"
                  style={{
                    margin: "0 auto 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    animationDelay: "0.3s",
                  }}
                >
                  <span style={{ height: 1, width: 40, background: `linear-gradient(to right, transparent, ${GOLD}b3)` }} />
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={GOLD} aria-hidden="true">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z" />
                  </svg>
                  <span style={{ height: 1, width: 40, background: `linear-gradient(to left, transparent, ${GOLD}b3)` }} />
                </div>

                {/* Description */}
                <p
                  className="ab-stage"
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.75)",
                    margin: "0 0 30px",
                    animationDelay: "0.36s",
                  }}
                >
                  {description}
                </p>

                {/* Buttons */}
                <div className="ab-stage" style={{ marginBottom: 26, display: "flex", flexDirection: "column", gap: 12, animationDelay: "0.44s" }}>
                  <button
                    onClick={this.handleReload}
                    className="ab-btn-primary"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      width: "100%", border: "none", borderRadius: 16,
                      padding: "14px 24px", fontSize: "0.95rem", fontWeight: 700,
                      color: "#0c2913", cursor: "pointer",
                      fontFamily: "'DM Sans', 'Nunito', sans-serif",
                      background: "linear-gradient(135deg, #e8d5a0 0%, #c9a84c 55%, #b8923c 100%)",
                      boxShadow: "0 10px 28px rgba(201,168,76,0.4)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                  >
                    <RefreshCw size={16} />
                    Refresh Now
                  </button>

                  <button
                    onClick={() => { window.location.href = "/"; }}
                    className="ab-btn-ghost"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      width: "100%", borderRadius: 16,
                      padding: "14px 24px", fontSize: "0.95rem", fontWeight: 600,
                      color: "#fff", cursor: "pointer",
                      fontFamily: "'DM Sans', 'Nunito', sans-serif",
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(4px)",
                      transition: "transform 0.2s, background 0.2s",
                    }}
                  >
                    <Home size={16} />
                    Back To Home
                  </button>

                  {!isChunkError && (
                    <button
                      onClick={() => { window.location.href = "/products"; }}
                      className="ab-btn-gold"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        width: "100%", borderRadius: 16,
                        padding: "14px 24px", fontSize: "0.95rem", fontWeight: 600,
                        color: "#3d2e0a", cursor: "pointer",
                        fontFamily: "'DM Sans', 'Nunito', sans-serif",
                        background: "rgba(232,213,160,0.92)",
                        border: "1px solid rgba(201,168,76,0.6)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                    >
                      <ShoppingBag size={16} />
                      Shopping Karo
                    </button>
                  )}
                </div>

                {/* Trust row */}
                <div
                  className="ab-stage"
                  style={{
                    display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
                    gap: "8px 16px",
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    paddingTop: 18,
                    fontSize: "0.72rem", fontWeight: 500, color: "rgba(255,255,255,0.65)",
                    animationDelay: "0.52s",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#7ec850" }}>✓</span> Faster Loading
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#7ec850" }}>✓</span> Improved Security
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#7ec850" }}>✓</span> Better Shopping Experience
                  </span>
                </div>
              </div>

              {/* Footer quote */}
              <p
                className="ab-stage"
                style={{
                  marginTop: 28,
                  textAlign: "center",
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.55)",
                  animationDelay: "0.6s",
                }}
              >
                "From Assam's Tea Gardens To Your Home ❤️"
              </p>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
