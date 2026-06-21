import { useRef, useState, useEffect } from "react";

const G = "#1a5a32";
const GOLD = "#c9a84c";

// ─── FEATURE ICONS ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    label: "From Assam's\nTea Gardens",
    sub: "Pure & Natural",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z" />
      </svg>
    ),
  },
  {
    label: "Handcrafted by\nSkilled Artisans",
    sub: "Tradition & Heritage",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
      </svg>
    ),
  },
  {
    label: "Sustainable &\nEco-Friendly",
    sub: "Better for Nature",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12M12 12C12 12 7 10 4 6c5 0 8 3 8 6zM12 12c0 0 5-2 8-6-5 0-8 3-8 6z" />
      </svg>
    ),
  },
  {
    label: "Beautifully\nPackaged",
    sub: "With Love from Assam",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    label: "Delivered\nAcross India",
    sub: "Fast & Reliable",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1.5" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
];

const SCENE_LABELS = [
  "Tea Gardens", "Harvest", "Weaving", "Craft", "Pour", "Pack", "Deliver", "Assam",
];

// Replace with your actual hosted video URL
const VIDEO_SRC = "";
const POSTER_SRC = "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=900&q=75";

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ExperienceAssamSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);

  function handlePlay() {
    videoRef.current?.play();
    setPlaying(true);
    setOverlayVisible(false);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    };
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes ea-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.18);opacity:.7} }
        @keyframes ea-shimmer { 0%{background-position:-400% center} 100%{background-position:400% center} }
        @keyframes ea-fadein { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ea-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes ea-glow { 0%,100%{opacity:.55} 50%{opacity:1} }
        .ea-play-ring { animation: ea-pulse 2.2s ease-in-out infinite; }
        .ea-gold-text {
          background: linear-gradient(90deg, #c9a84c 0%, #f0d278 40%, #c9a84c 80%);
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: ea-shimmer 3.5s linear infinite;
        }
        .ea-feat-item { transition: transform .2s; }
        .ea-feat-item:hover { transform: translateY(-3px); }
        .ea-play-outer { transition: transform .2s; }
        .ea-play-outer:hover { transform: scale(1.08); }
        .ea-cta-btn-main {
          display: inline-flex; align-items: center; gap: 9px;
          background: #1a5a32; color: #fff;
          border: none; border-radius: 50px;
          padding: 13px 28px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: background .2s, transform .2s;
        }
        .ea-cta-btn-main:hover { background: #22713f; transform: scale(1.04); }
      `}</style>

      <section style={{ background: "#0b2410", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>

        {/* ── TOP HEADER ─────────────────────────────────────────────── */}
        <div style={{ position: "relative", padding: "44px 22px 38px", textAlign: "center" }}>

          {/* Dot pattern BG */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}>
            <defs>
              <pattern id="ea-leaf-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 4C12 6 10 14 8 20 6 26 8 36 20 36 32 36 34 26 32 20 30 14 28 6 20 4Z" fill={GOLD} opacity=".8" />
                <path d="M20 4 Q22 16 20 36" stroke="#0b2410" strokeWidth="1.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ea-leaf-pat)" />
          </svg>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: `${GOLD}22`, border: `1px solid ${GOLD}44`,
            borderRadius: 50, padding: "5px 16px", marginBottom: 22,
            position: "relative",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" />
              <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
            </svg>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "2.5px", color: GOLD, textTransform: "uppercase" }}>
              Experience Assam
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 7vw, 2.8rem)",
            fontWeight: 800, color: "#fff", lineHeight: 1.1,
            marginBottom: 18,
          }}>
            See. Feel. Believe in <span className="ea-gold-text">Assam.</span>
          </h2>

          {/* Gold divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 44, height: 1.5, background: GOLD, borderRadius: 2 }} />
            <svg width="12" height="12" viewBox="0 0 24 24" fill={GOLD}>
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z" />
            </svg>
            <div style={{ width: 44, height: 1.5, background: GOLD, borderRadius: 2 }} />
          </div>

          <p style={{
            fontSize: 13.5, color: "rgba(255,255,255,.65)",
            lineHeight: 1.75, maxWidth: 460, margin: "0 auto 30px",
          }}>
            Watch our 30-second cinematic story and discover the beauty, craftsmanship, and culture behind every ApunBazar product.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button className="ea-cta-btn-main" onClick={handlePlay}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              Watch Our Story
            </button>
            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.4)", fontSize: 12 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              0:30 min
            </span>
          </div>
        </div>

        {/* ── VIDEO PLAYER ───────────────────────────────────────────── */}
        <div style={{ position: "relative", background: "#000" }}>
          <video
            ref={videoRef}
            style={{ width: "100%", display: "block", minHeight: 220, objectFit: "cover", background: "#081a0c" }}
            controls
            preload="none"
            poster={POSTER_SRC}
          >
            {VIDEO_SRC && <source src={VIDEO_SRC} type="video/mp4" />}
          </video>

          {/* Custom overlay */}
          {overlayVisible && (
            <div
              style={{
                position: "absolute", inset: 0,
                background: "rgba(5,18,8,.52)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 18, cursor: "pointer",
              }}
              onClick={handlePlay}
            >
              {/* Animated dots */}
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: GOLD,
                    animation: `ea-bounce .9s ease infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }} />
                ))}
              </div>

              <div style={{
                fontSize: 10, letterSpacing: 2.5, fontWeight: 700,
                color: "rgba(255,255,255,.6)", textTransform: "uppercase",
                animation: "ea-glow 2.5s ease-in-out infinite",
              }}>
                Cinematic Story
              </div>

              {/* Play button */}
              <div className="ea-play-outer" style={{
                width: 68, height: 68, borderRadius: "50%",
                border: `2px solid ${GOLD}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div className="ea-play-ring" style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: `${GOLD}ee`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0b2410"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>

              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.1rem, 4vw, 1.55rem)",
                color: "#fff", fontWeight: 700, fontStyle: "italic",
                textAlign: "center", lineHeight: 1.4, maxWidth: 320, padding: "0 20px",
              }}>
                "Authentic. Handcrafted.<br />
                <span style={{ color: GOLD }}>Proudly Assamese.</span>"
              </p>

              <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 500 }}>
                30 seconds · No sound required
              </span>
            </div>
          )}

          {/* Scene labels + progress bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "10px 12px 8px",
            background: "linear-gradient(to top, rgba(5,18,8,.88), transparent)",
            pointerEvents: "none",
          }}>
            <div style={{ display: "flex", gap: 4 }}>
              {SCENE_LABELS.map(label => (
                <div key={label} style={{ flex: 1, textAlign: "center", fontSize: 8.5, color: "rgba(255,255,255,.45)", fontWeight: 600, letterSpacing: 0.5 }}>
                  {label}
                </div>
              ))}
            </div>
            <div style={{ position: "relative", height: 2, background: "rgba(255,255,255,.1)", borderRadius: 2, marginTop: 5, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", background: GOLD, borderRadius: 2, width: `${progress}%`, transition: "width .3s" }} />
            </div>
          </div>
        </div>

        {/* ── FEATURE ICONS ─────────────────────────────────────────── */}
        <div style={{ background: "#071a09", padding: "22px 16px 24px" }}>
          <p style={{
            textAlign: "center", fontSize: 9, letterSpacing: 3, fontWeight: 700,
            color: `${GOLD}99`, textTransform: "uppercase", marginBottom: 18,
          }}>
            What Goes Into Every Product
          </p>

          <div style={{ display: "flex", gap: 8, justifyContent: "space-between", flexWrap: "wrap" }}>
            {FEATURES.map(f => (
              <div key={f.sub} className="ea-feat-item" style={{ flex: "1 1 18%", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%",
                  background: `${GOLD}14`, border: `1px solid ${GOLD}28`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {f.icon}
                </div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,.72)", fontWeight: 600, lineHeight: 1.35, whiteSpace: "pre-line" }}>{f.label}</p>
                <p style={{ fontSize: 9, color: `${GOLD}88`, fontWeight: 500 }}>{f.sub}</p>
              </div>
            ))}
          </div>

          {/* Bottom strip */}
          <div style={{
            marginTop: 20, padding: "14px 18px",
            background: `${GOLD}0d`, border: `1px solid ${GOLD}20`,
            borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap",
          }}>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 3 }}>
                ApunBazar — Bringing Assam to You
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,.38)" }}>
                500+ artisans · 1200+ products · Pan India delivery
              </p>
            </div>
            <a href="/products" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: G, color: "#fff", borderRadius: 50,
              padding: "9px 20px", fontSize: 12.5, fontWeight: 600,
              textDecoration: "none",
            }}>
              Shop Now
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
