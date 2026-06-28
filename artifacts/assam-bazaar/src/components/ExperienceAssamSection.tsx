import { useRef, useState, useEffect } from "react";

const G    = "#1a5a32";
const GOLD = "#c9a84c";
const BG   = "#f5f0e8";

const COLLAGE_IMGS = [
  "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=75",
  "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=75",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=75",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=75",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=75",
];

// ── Add your YouTube video IDs here ──────────────────────────────────────────
const STORY_VIDEOS = [
  {
    id: "tdljGhkH0jY",
    title: "Our Assam Story",
    desc: "Journey from Assam's lush gardens to your home",
    thumb: "https://img.youtube.com/vi/tdljGhkH0jY/hqdefault.jpg",
  },
  {
    id: "3JZ_D3ELwOQ",
    title: "Artisan Crafts",
    desc: "Handloom weavers preserving centuries of tradition",
    thumb: "https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
  },
  {
    id: "3nQNiWdeH2Q",
    title: "Tea Gardens of Assam",
    desc: "First flush to your cup — the golden journey",
    thumb: "https://img.youtube.com/vi/3nQNiWdeH2Q/hqdefault.jpg",
  },
];

// ── Video Modal ───────────────────────────────────────────────────────────────
function VideoModal({
  open,
  onClose,
  activeIdx,
  setActiveIdx,
}: {
  open: boolean;
  onClose: () => void;
  activeIdx: number;
  setActiveIdx: (i: number) => void;
}) {
  const video = STORY_VIDEOS[activeIdx];

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes modal-fadein {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .story-modal-inner { animation: modal-fadein 0.32s cubic-bezier(0.22,1,0.36,1) both; }
        .story-thumb-btn { transition: transform .2s, box-shadow .2s; }
        .story-thumb-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.3); }
        .story-thumb-btn.active { box-shadow: 0 0 0 3px ${GOLD}, 0 8px 20px rgba(0,0,0,.3); }
        .story-close-btn { transition: background .2s, transform .2s; }
        .story-close-btn:hover { background: rgba(255,255,255,.25) !important; transform: scale(1.1); }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      {/* Modal */}
      <div
        className="story-modal-inner"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 760,
            background: "#0d1f10",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(201,168,76,0.25)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
            pointerEvents: "all",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: GOLD, textTransform: "uppercase", marginBottom: 2 }}>
                🌿 ApunBazar Stories
              </p>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>
                {video.title}
              </h3>
            </div>
            <button
              className="story-close-btn"
              onClick={onClose}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,.12)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", flexShrink: 0,
              }}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* YouTube Embed */}
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#000" }}>
            <iframe
              key={video.id}
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                border: "none",
              }}
            />
          </div>

          {/* Video Description */}
          <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", margin: 0 }}>{video.desc}</p>
          </div>

          {/* Playlist — other videos */}
          {STORY_VIDEOS.length > 1 && (
            <div style={{ padding: "12px 18px 16px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 10 }}>
                More Videos
              </p>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" }}>
                {STORY_VIDEOS.map((v, i) => (
                  <button
                    key={v.id}
                    className={`story-thumb-btn ${i === activeIdx ? "active" : ""}`}
                    onClick={() => setActiveIdx(i)}
                    style={{
                      flexShrink: 0, width: 130,
                      background: "transparent", border: "none",
                      cursor: "pointer", textAlign: "left", padding: 0,
                      borderRadius: 10, overflow: "hidden",
                      opacity: i === activeIdx ? 1 : 0.7,
                    }}
                  >
                    <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#111" }}>
                      <img
                        src={v.thumb}
                        alt={v.title}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      {i === activeIdx && (
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "rgba(0,0,0,0.4)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: "50%",
                            background: GOLD, display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="#111">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "6px 4px 4px" }}>
                      <p style={{ fontSize: 10.5, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.3 }}>{v.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hint */}
        <p style={{ marginTop: 14, fontSize: 11, color: "rgba(255,255,255,0.3)", pointerEvents: "none" }}>
          Press <kbd style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, padding: "1px 5px" }}>ESC</kbd> or tap outside to close
        </p>
      </div>
    </>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function ExperienceAssamSection() {
  const [modalOpen, setModalOpen]   = useState(false);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [progress, setProgress]     = useState(0);

  function openModal(idx = 0) {
    setActiveIdx(idx);
    setModalOpen(true);
  }

  return (
    <>
      <style>{`
        @keyframes ea-pulse {
          0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(255,255,255,.5); }
          60%      { transform:scale(1.1); box-shadow:0 0 0 12px rgba(255,255,255,0); }
        }
        @keyframes ea-fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .ea-play-btn { animation: ea-pulse 2.4s ease-in-out infinite; }
        .ea-play-btn:hover { transform: scale(1.12) !important; }
        .ea-watch-btn { transition: background .2s, transform .18s; }
        .ea-watch-btn:hover { background: #135228 !important; transform: scale(1.03); }
        .ea-img { width:100%; height:100%; object-fit:cover; display:block; }

        .ea-section { background: ${BG}; padding: 32px 20px 28px; font-family: 'DM Sans', sans-serif; }
        .ea-inner { display: flex; gap: 24px; align-items: center; max-width: 900px; margin: 0 auto; }
        .ea-left  { flex: 0 0 36%; animation: ea-fadein .6s ease both; }
        .ea-right { flex: 1; animation: ea-fadein .6s ease .15s both; }

        @media (max-width: 600px) {
          .ea-section { padding: 24px 14px 22px; }
          .ea-inner   { flex-direction: column; gap: 20px; }
          .ea-left    { flex: none; width: 100%; }
          .ea-right   { flex: none; width: 100%; }
        }
      `}</style>

      {/* Video Modal */}
      <VideoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
      />

      <section className="ea-section">
        <div className="ea-inner">

          {/* ── LEFT: TEXT ── */}
          <div className="ea-left">
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:14 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill={G}>
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/>
              </svg>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:G, textTransform:"uppercase" }}>
                Experience Assam
              </span>
            </div>

            <h2 style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:"clamp(1.5rem,4vw,1.9rem)",
              fontWeight:800, color:"#0d2e10",
              lineHeight:1.2, marginBottom:14,
            }}>
              A Land of Heritage,<br />
              Craft &amp; Tradition
            </h2>

            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <div style={{ width:30, height:1.5, background:GOLD, borderRadius:2 }} />
              <svg width="9" height="9" viewBox="0 0 24 24" fill={GOLD}>
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/>
              </svg>
              <div style={{ width:30, height:1.5, background:GOLD, borderRadius:2 }} />
            </div>

            <p style={{ fontSize:13, color:"#4b5563", lineHeight:1.75, marginBottom:24 }}>
              Watch our stories and discover the journey of authentic Assamese
              products — from the lush tea gardens and skilled hands of artisans to
              reaching your home.
            </p>

            {/* CTA */}
            <button
              className="ea-watch-btn"
              onClick={() => openModal(0)}
              style={{
                display:"inline-flex", alignItems:"center", gap:9,
                background:G, color:"#fff",
                border:"none", borderRadius:50,
                padding:"13px 24px",
                fontFamily:"'DM Sans', sans-serif",
                fontSize:14, fontWeight:700, cursor:"pointer",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Our Story
            </button>

            {/* Video count badge */}
            <p style={{ marginTop: 10, fontSize: 11, color: "#9ca3af", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill={GOLD}><path d="M8 5v14l11-7z"/></svg>
              {STORY_VIDEOS.length} videos available
            </p>
          </div>

          {/* ── RIGHT: COLLAGE with play button ── */}
          <div className="ea-right">
            <div style={{ borderRadius:14, overflow:"hidden", position:"relative", cursor:"pointer" }} onClick={() => openModal(0)}>
              <div style={{
                display:"grid",
                gridTemplateColumns:"1fr 1fr 1fr",
                gridTemplateRows:"130px 130px",
                gap:3,
              }}>
                <div style={{ gridColumn:"1", gridRow:"1/3", overflow:"hidden" }}>
                  <img className="ea-img" src={COLLAGE_IMGS[0]} alt="Tea garden" style={{ height:263 }} />
                </div>
                <div style={{ gridColumn:"2", gridRow:"1", overflow:"hidden" }}>
                  <img className="ea-img" src={COLLAGE_IMGS[1]} alt="Weaver" />
                </div>
                <div style={{ gridColumn:"3", gridRow:"1", overflow:"hidden" }}>
                  <img className="ea-img" src={COLLAGE_IMGS[2]} alt="Craft" />
                </div>
                <div style={{ gridColumn:"2", gridRow:"2", overflow:"hidden" }}>
                  <img className="ea-img" src={COLLAGE_IMGS[3]} alt="Pour" />
                </div>
                <div style={{ gridColumn:"3", gridRow:"2", overflow:"hidden", background:"#1a3a1a" }}>
                  <img className="ea-img" src={COLLAGE_IMGS[4]} alt="ApunBazar" />
                </div>
              </div>

              {/* Overlay */}
              <div style={{ position:"absolute", inset:0, background:"rgba(5,20,8,.42)", pointerEvents:"none" }} />

              {/* Play button */}
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:3 }}>
                <div className="ea-play-btn" style={{
                  width:62, height:62, borderRadius:"50%",
                  background:"rgba(255,255,255,.93)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={G}>
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>

              {/* Bottom label */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                padding: "20px 14px 10px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                zIndex: 3,
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Our Story</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: G,
                  background: GOLD, borderRadius: 20, padding: "3px 10px",
                }}>
                  ▶ {STORY_VIDEOS.length} Videos
                </span>
              </div>
            </div>

            {/* Decorative control bar */}
            <div style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"7px 12px",
              background:"#fff",
              borderRadius:"0 0 14px 14px",
              borderTop:"1px solid #eee",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill={G}>
                <path d="M8 5v14l11-7z"/>
              </svg>
              <div style={{ flex:1, height:3, background:"#e5e7eb", borderRadius:2 }} />
              <span style={{ fontSize:10, color:"#9ca3af", whiteSpace:"nowrap" }}>Click to play</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
