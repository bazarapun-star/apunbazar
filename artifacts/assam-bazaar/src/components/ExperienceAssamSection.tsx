import { useRef, useState, useEffect } from "react";

const G = "#1a5a32";
const GOLD = "#c9a84c";
const BG = "#f5f0e8";

const COLLAGE_IMGS = [
  "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=75",
  "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&q=75",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=75",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=75",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=75",
];

const VIDEO_SRC = "https://your-cdn.com/assam-story.mp4";
const VIDEO_POSTER = COLLAGE_IMGS[0];

export default function ExperienceAssamSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [progress, setProgress] = useState(0);

  function handlePlay() {
    videoRef.current?.play();
    setShowOverlay(false);
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => { if (v.duration) setProgress(v.currentTime / v.duration * 100); };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

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

        /* ── LAYOUT ── */
        .ea-section {
          background: ${BG};
          padding: 32px 20px 28px;
          font-family: 'DM Sans', sans-serif;
        }
        .ea-inner {
          display: flex;
          gap: 24px;
          align-items: center;
          max-width: 900px;
          margin: 0 auto;
        }
        .ea-left  { flex: 0 0 36%; animation: ea-fadein .6s ease both; }
        .ea-right { flex: 1; animation: ea-fadein .6s ease .15s both; }

        /* Mobile: stack vertically, video below text */
        @media (max-width: 600px) {
          .ea-section { padding: 24px 14px 22px; }
          .ea-inner   { flex-direction: column; gap: 20px; }
          .ea-left    { flex: none; width: 100%; }
          .ea-right   { flex: none; width: 100%; }
        }
      `}</style>

      <section className="ea-section">
        <div className="ea-inner">

          {/* ── LEFT: TEXT ─────────────────────────────────── */}
          <div className="ea-left">

            {/* Badge */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:14 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill={G}>
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/>
              </svg>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:G, textTransform:"uppercase" }}>
                Experience Assam
              </span>
            </div>

            {/* Heading */}
            <h2 style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:"clamp(1.5rem,4vw,1.9rem)",
              fontWeight:800, color:"#0d2e10",
              lineHeight:1.2, marginBottom:14,
            }}>
              A Land of Heritage,<br />
              Craft &amp; Tradition
            </h2>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <div style={{ width:30, height:1.5, background:GOLD, borderRadius:2 }} />
              <svg width="9" height="9" viewBox="0 0 24 24" fill={GOLD}>
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/>
              </svg>
              <div style={{ width:30, height:1.5, background:GOLD, borderRadius:2 }} />
            </div>

            {/* Body */}
            <p style={{ fontSize:13, color:"#4b5563", lineHeight:1.75, marginBottom:24 }}>
              Watch our 30-second story and discover the journey of authentic Assamese
              products — from the lush tea gardens and skilled hands of artisans to
              reaching your home.
            </p>

            {/* CTA */}
            <button
              className="ea-watch-btn"
              onClick={handlePlay}
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
          </div>

          {/* ── RIGHT: VIDEO / COLLAGE ──────────────────────── */}
          <div className="ea-right">

            {/* Collage shown before play */}
            {showOverlay && (
              <div style={{ borderRadius:14, overflow:"hidden", position:"relative" }}>
                <div style={{
                  display:"grid",
                  gridTemplateColumns:"1fr 1fr 1fr",
                  gridTemplateRows:"130px 130px",
                  gap:3,
                }}>
                  {/* tall left */}
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

                {/* dark overlay */}
                <div style={{ position:"absolute", inset:0, background:"rgba(5,20,8,.36)", pointerEvents:"none" }} />

                {/* play button */}
                <div
                  style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:3 }}
                  onClick={handlePlay}
                >
                  <div className="ea-play-btn" style={{
                    width:58, height:58, borderRadius:"50%",
                    background:"rgba(255,255,255,.93)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={G}>
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Actual video */}
            {!showOverlay && (
              <video
                ref={videoRef}
                controls
                autoPlay
                preload="none"
                poster={VIDEO_POSTER}
                style={{ width:"100%", display:"block", borderRadius:14, background:"#0d2410" }}
              >
                {VIDEO_SRC && <source src={VIDEO_SRC} type="video/mp4" />}
              </video>
            )}

            {/* Control bar (decorative, shown before play) */}
            {showOverlay && (
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
                <div style={{ flex:1, height:3, background:"#e5e7eb", borderRadius:2, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${progress}%`, background:GOLD, borderRadius:2, transition:"width .3s" }} />
                </div>
                <span style={{ fontSize:10, color:"#9ca3af", whiteSpace:"nowrap" }}>0:00 / 0:30</span>
                {/* Volume */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 010 7.07"/>
                </svg>
                {/* Settings */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
                {/* Fullscreen */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
