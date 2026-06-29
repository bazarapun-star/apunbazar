import { useState } from "react";

const G    = "#1a5a32";
const GOLD = "#c9a84c";
const BG   = "#f5f0e8";

// 3 wide cinematic images — left, center, right
const BANNER_IMGS = [
  "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80", // tea picker
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",   // handloom weaver
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",   // tea pour
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

export default function ExperienceAssamSection() {
  const [playing, setPlaying]       = useState(false);
  const [activeIdx, setActiveIdx]   = useState(0);

  const video = STORY_VIDEOS[activeIdx];

  return (
    <>
      <style>{`
        @keyframes ea-pulse {
          0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,.55); }
          60%      { transform: scale(1.08); box-shadow: 0 0 0 16px rgba(255,255,255,0); }
        }
        @keyframes ea-slidein {
          from { opacity:0; transform:scale(0.97); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes ea-arrowin {
          0%,100% { transform: translateY(0) rotate(10deg); opacity:.7; }
          50%      { transform: translateY(5px) rotate(10deg); opacity:1; }
        }
        .ea-play-ring { animation: ea-pulse 2.4s ease-in-out infinite; }
        .ea-play-ring:hover { transform: scale(1.12) !important; cursor: pointer; }
        .ea-video-wrap { animation: ea-slidein 0.38s cubic-bezier(0.22,1,0.36,1) both; }
        .ea-arrow { animation: ea-arrowin 1.8s ease-in-out infinite; }
        .ea-thumb { transition: transform .2s, opacity .2s; border:none; padding:0; background:transparent; cursor:pointer; }
        .ea-thumb:hover { transform: translateY(-2px); opacity: 1 !important; }
      `}</style>

      <section style={{ background: "#000", fontFamily:"'DM Sans',sans-serif" }}>

        {/* ── CINEMATIC BANNER ── */}
        {!playing && (
          <div style={{ position:"relative", width:"100%", overflow:"hidden" }}>

            {/* 3-panel image strip */}
            <div style={{ display:"flex", height:"clamp(220px,48vw,420px)" }}>
              {BANNER_IMGS.map((src, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    position: "relative",
                    // diagonal clip between panels
                    clipPath: i === 0
                      ? "polygon(0 0, calc(100% - 18px) 0, 100% 100%, 0 100%)"
                      : i === 2
                      ? "polygon(18px 0, 100% 0, 100% 100%, 0 100%)"
                      : "polygon(18px 0, calc(100% - 18px) 0, 100% 100%, 0 100%)",
                    marginLeft: i > 0 ? -18 : 0,
                    zIndex: i === 1 ? 2 : 1,
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                    onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                  />
                  {/* dark vignette */}
                  <div style={{
                    position:"absolute", inset:0,
                    background: i === 1
                      ? "linear-gradient(to bottom, rgba(0,0,0,.35) 0%, rgba(0,0,0,.55) 100%)"
                      : "rgba(0,0,0,0.45)",
                  }}/>
                </div>
              ))}
            </div>

            {/* Center overlay text + play */}
            <div style={{
              position:"absolute", inset:0, zIndex:10,
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              gap:0,
            }}>
              {/* Headline */}
              <h2 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(1.4rem,5vw,2.8rem)",
                fontWeight:800,
                color:"#fff",
                textAlign:"center",
                lineHeight:1.15,
                margin:"0 0 4px",
                textShadow:"0 2px 18px rgba(0,0,0,0.6)",
              }}>
                Authentic.<br />Handcrafted.
              </h2>
              <h2 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(1.4rem,5vw,2.8rem)",
                fontWeight:800,
                color:GOLD,
                textAlign:"center",
                lineHeight:1.1,
                margin:"0 0 14px",
                textShadow:"0 2px 18px rgba(0,0,0,0.5)",
              }}>
                Proudly Assamese.
              </h2>

              {/* Gold leaf divider */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
                <div style={{ width:40, height:1, background:GOLD, opacity:.7 }} />
                <svg width="12" height="12" viewBox="0 0 24 24" fill={GOLD}>
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/>
                </svg>
                <div style={{ width:40, height:1, background:GOLD, opacity:.7 }} />
              </div>

              {/* Play button */}
              <div
                className="ea-play-ring"
                onClick={() => setPlaying(true)}
                style={{
                  width:60, height:60, borderRadius:"50%",
                  border:"2.5px solid rgba(255,255,255,0.9)",
                  background:"rgba(0,0,0,0.35)",
                  backdropFilter:"blur(6px)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  marginBottom:10,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>

              {/* Watch Our Story label */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                <span style={{
                  fontFamily:"'Playfair Display',serif",
                  fontStyle:"italic",
                  fontSize:"clamp(12px,2.5vw,15px)",
                  color:"rgba(255,255,255,0.88)",
                  letterSpacing:0.5,
                }}>
                  Watch Our Story
                </span>
                {/* animated arrow */}
                <svg className="ea-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </div>
            </div>

            {/* Fake video controls bar */}
            <div style={{
              position:"absolute", bottom:0, left:0, right:0,
              background:"rgba(0,0,0,0.7)",
              backdropFilter:"blur(4px)",
              padding:"8px 16px",
              display:"flex", alignItems:"center", gap:10,
              zIndex:11,
            }}>
              {/* Play icon */}
              <button
                onClick={() => setPlaying(true)}
                style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
              </button>

              {/* Time */}
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)", whiteSpace:"nowrap" }}>0:00 / 0:30</span>

              {/* Progress bar */}
              <div style={{ flex:1, height:3, background:"rgba(255,255,255,0.2)", borderRadius:2, position:"relative" }}>
                <div style={{ width:"0%", height:"100%", background:GOLD, borderRadius:2 }} />
                <div style={{
                  position:"absolute", left:0, top:"50%", transform:"translateY(-50%)",
                  width:10, height:10, borderRadius:"50%", background:GOLD,
                }}/>
              </div>

              {/* Right controls */}
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
              </div>
            </div>
          </div>
        )}

        {/* ── YOUTUBE PLAYER (same spot, after click) ── */}
        {playing && (
          <div className="ea-video-wrap">
            {/* YouTube iframe */}
            <div style={{ position:"relative", width:"100%", paddingBottom:"42%" }}>
              <iframe
                key={video.id}
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
              />
            </div>

            {/* Bottom bar — playlist + close */}
            <div style={{
              background:"#0d1a0f",
              padding:"10px 16px",
              display:"flex", alignItems:"center", gap:10,
              borderTop:"1px solid rgba(201,168,76,0.2)",
            }}>
              {/* Playlist thumbnails */}
              <div style={{ display:"flex", gap:8, flex:1, overflowX:"auto", scrollbarWidth:"none" }}>
                {STORY_VIDEOS.map((v, i) => (
                  <button
                    key={v.id}
                    className="ea-thumb"
                    onClick={() => setActiveIdx(i)}
                    style={{
                      flexShrink:0, width:90, borderRadius:8, overflow:"hidden",
                      opacity: i === activeIdx ? 1 : 0.5,
                      outline: i === activeIdx ? `2px solid ${GOLD}` : "none",
                    }}
                  >
                    <div style={{ position:"relative", paddingBottom:"56.25%", background:"#111" }}>
                      <img
                        src={v.thumb}
                        alt={v.title}
                        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      {i === activeIdx && (
                        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={GOLD}><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize:9, color:"rgba(255,255,255,0.8)", margin:"3px 3px 5px", lineHeight:1.3, textAlign:"left" }}>{v.title}</p>
                  </button>
                ))}
              </div>

              {/* Close button */}
              <button
                onClick={() => setPlaying(false)}
                style={{
                  flexShrink:0, width:32, height:32, borderRadius:"50%",
                  background:"rgba(255,255,255,0.1)", border:"none",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", color:"#fff",
                }}
                title="Back to banner"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
            }
import { useState } from "react";

const G    = "#1a5a32";
const GOLD = "#c9a84c";
const BG   = "#f5f0e8";

// 3 wide cinematic images — left, center, right
const BANNER_IMGS = [
  "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80", // tea picker
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",   // handloom weaver
  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",   // tea pour
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

export default function ExperienceAssamSection() {
  const [playing, setPlaying]       = useState(false);
  const [activeIdx, setActiveIdx]   = useState(0);

  const video = STORY_VIDEOS[activeIdx];

  return (
    <>
      <style>{`
        @keyframes ea-pulse {
          0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,.55); }
          60%      { transform: scale(1.08); box-shadow: 0 0 0 16px rgba(255,255,255,0); }
        }
        @keyframes ea-slidein {
          from { opacity:0; transform:scale(0.97); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes ea-arrowin {
          0%,100% { transform: translateY(0) rotate(10deg); opacity:.7; }
          50%      { transform: translateY(5px) rotate(10deg); opacity:1; }
        }
        .ea-play-ring { animation: ea-pulse 2.4s ease-in-out infinite; }
        .ea-play-ring:hover { transform: scale(1.12) !important; cursor: pointer; }
        .ea-video-wrap { animation: ea-slidein 0.38s cubic-bezier(0.22,1,0.36,1) both; }
        .ea-arrow { animation: ea-arrowin 1.8s ease-in-out infinite; }
        .ea-thumb { transition: transform .2s, opacity .2s; border:none; padding:0; background:transparent; cursor:pointer; }
        .ea-thumb:hover { transform: translateY(-2px); opacity: 1 !important; }
      `}</style>

      <section style={{ background: "#000", fontFamily:"'DM Sans',sans-serif" }}>

        {/* ── CINEMATIC BANNER ── */}
        {!playing && (
          <div style={{ position:"relative", width:"100%", overflow:"hidden" }}>

            {/* 3-panel image strip */}
            <div style={{ display:"flex", height:"clamp(220px,48vw,420px)" }}>
              {BANNER_IMGS.map((src, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    position: "relative",
                    // diagonal clip between panels
                    clipPath: i === 0
                      ? "polygon(0 0, calc(100% - 18px) 0, 100% 100%, 0 100%)"
                      : i === 2
                      ? "polygon(18px 0, 100% 0, 100% 100%, 0 100%)"
                      : "polygon(18px 0, calc(100% - 18px) 0, 100% 100%, 0 100%)",
                    marginLeft: i > 0 ? -18 : 0,
                    zIndex: i === 1 ? 2 : 1,
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                    onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                  />
                  {/* dark vignette */}
                  <div style={{
                    position:"absolute", inset:0,
                    background: i === 1
                      ? "linear-gradient(to bottom, rgba(0,0,0,.35) 0%, rgba(0,0,0,.55) 100%)"
                      : "rgba(0,0,0,0.45)",
                  }}/>
                </div>
              ))}
            </div>

            {/* Center overlay text + play */}
            <div style={{
              position:"absolute", inset:0, zIndex:10,
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              gap:0,
            }}>
              {/* Headline */}
              <h2 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(1.4rem,5vw,2.8rem)",
                fontWeight:800,
                color:"#fff",
                textAlign:"center",
                lineHeight:1.15,
                margin:"0 0 4px",
                textShadow:"0 2px 18px rgba(0,0,0,0.6)",
              }}>
                Authentic.<br />Handcrafted.
              </h2>
              <h2 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(1.4rem,5vw,2.8rem)",
                fontWeight:800,
                color:GOLD,
                textAlign:"center",
                lineHeight:1.1,
                margin:"0 0 14px",
                textShadow:"0 2px 18px rgba(0,0,0,0.5)",
              }}>
                Proudly Assamese.
              </h2>

              {/* Gold leaf divider */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
                <div style={{ width:40, height:1, background:GOLD, opacity:.7 }} />
                <svg width="12" height="12" viewBox="0 0 24 24" fill={GOLD}>
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s1-3 3-4c-4 0-6 2-6 2S5 3 5 6c0 2.23 1.93 3.42 2 5z"/>
                </svg>
                <div style={{ width:40, height:1, background:GOLD, opacity:.7 }} />
              </div>

              {/* Play button */}
              <div
                className="ea-play-ring"
                onClick={() => setPlaying(true)}
                style={{
                  width:60, height:60, borderRadius:"50%",
                  border:"2.5px solid rgba(255,255,255,0.9)",
                  background:"rgba(0,0,0,0.35)",
                  backdropFilter:"blur(6px)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  marginBottom:10,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>

              {/* Watch Our Story label */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                <span style={{
                  fontFamily:"'Playfair Display',serif",
                  fontStyle:"italic",
                  fontSize:"clamp(12px,2.5vw,15px)",
                  color:"rgba(255,255,255,0.88)",
                  letterSpacing:0.5,
                }}>
                  Watch Our Story
                </span>
                {/* animated arrow */}
                <svg className="ea-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </div>
            </div>

            {/* Fake video controls bar */}
            <div style={{
              position:"absolute", bottom:0, left:0, right:0,
              background:"rgba(0,0,0,0.7)",
              backdropFilter:"blur(4px)",
              padding:"8px 16px",
              display:"flex", alignItems:"center", gap:10,
              zIndex:11,
            }}>
              {/* Play icon */}
              <button
                onClick={() => setPlaying(true)}
                style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
              </button>

              {/* Time */}
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)", whiteSpace:"nowrap" }}>0:00 / 0:30</span>

              {/* Progress bar */}
              <div style={{ flex:1, height:3, background:"rgba(255,255,255,0.2)", borderRadius:2, position:"relative" }}>
                <div style={{ width:"0%", height:"100%", background:GOLD, borderRadius:2 }} />
                <div style={{
                  position:"absolute", left:0, top:"50%", transform:"translateY(-50%)",
                  width:10, height:10, borderRadius:"50%", background:GOLD,
                }}/>
              </div>

              {/* Right controls */}
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
              </div>
            </div>
          </div>
        )}

        {/* ── YOUTUBE PLAYER (same spot, after click) ── */}
        {playing && (
          <div className="ea-video-wrap">
            {/* YouTube iframe */}
            <div style={{ position:"relative", width:"100%", paddingBottom:"42%" }}>
              <iframe
                key={video.id}
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
              />
            </div>

            {/* Bottom bar — playlist + close */}
            <div style={{
              background:"#0d1a0f",
              padding:"10px 16px",
              display:"flex", alignItems:"center", gap:10,
              borderTop:"1px solid rgba(201,168,76,0.2)",
            }}>
              {/* Playlist thumbnails */}
              <div style={{ display:"flex", gap:8, flex:1, overflowX:"auto", scrollbarWidth:"none" }}>
                {STORY_VIDEOS.map((v, i) => (
                  <button
                    key={v.id}
                    className="ea-thumb"
                    onClick={() => setActiveIdx(i)}
                    style={{
                      flexShrink:0, width:90, borderRadius:8, overflow:"hidden",
                      opacity: i === activeIdx ? 1 : 0.5,
                      outline: i === activeIdx ? `2px solid ${GOLD}` : "none",
                    }}
                  >
                    <div style={{ position:"relative", paddingBottom:"56.25%", background:"#111" }}>
                      <img
                        src={v.thumb}
                        alt={v.title}
                        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      {i === activeIdx && (
                        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={GOLD}><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize:9, color:"rgba(255,255,255,0.8)", margin:"3px 3px 5px", lineHeight:1.3, textAlign:"left" }}>{v.title}</p>
                  </button>
                ))}
              </div>

              {/* Close button */}
              <button
                onClick={() => setPlaying(false)}
                style={{
                  flexShrink:0, width:32, height:32, borderRadius:"50%",
                  background:"rgba(255,255,255,0.1)", border:"none",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", color:"#fff",
                }}
                title="Back to banner"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
                      }
