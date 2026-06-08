import { CounterAnimation } from "@/components/animations/CounterAnimation";
import { useRef, useEffect, useState } from "react";

const GOLD    = "#c9a84c";
const GOLD_LT = "#e8c96a";
const DARK    = "#071a0c";
const MID     = "#0f3318";
const GREEN   = "#1a5432";

export function StatsSection() {
  const stats = [
    { value: 1200,  suffix: "+", label: "Authentic\nProducts",  emoji: "🛍️" },
    { value: 500,   suffix: "+", label: "Assamese\nArtisans",   emoji: "🧑‍🎨" },
    { value: 50,    suffix: "+", label: "Districts\nCovered",   emoji: "🎈" },
    { value: 10000, suffix: "+", label: "Happy\nCustomers",     emoji: "😊" },
    { value: 100,   suffix: "%", label: "Pure &\nTrustworthy",  emoji: "🛡️" },
  ];

  const tags = [
    { label: "Assam Tea",        img: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=80&q=80" },
    { label: "Gamosa",           img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&q=80" },
    { label: "Mekhela Chador",   img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=80" },
    { label: "Handicrafts",      img: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=80&q=80" },
    { label: "Organic Goodness", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&q=80" },
  ];

  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "20px 14px 36px", background: "#f5f0e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap');

        @keyframes ss-up     { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ss-pop    { from{opacity:0;transform:scale(0.82) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes ss-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes ss-glow   { 0%,100%{opacity:.4} 50%{opacity:.9} }
        @keyframes ss-spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        /* ── STAT CARD ── */
        .ss-card {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column; align-items: center;
          padding: 14px 6px 12px;
          border-radius: 20px;
          background: linear-gradient(160deg, rgba(255,255,255,.09) 0%, rgba(255,255,255,.04) 100%);
          border: 1px solid rgba(201,168,76,.32);
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: transform .32s cubic-bezier(.34,1.56,.64,1),
                      box-shadow .32s ease,
                      background .25s ease;
          cursor: default;
        }
        .ss-card::before {
          content:'';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(to right, transparent, ${GOLD_LT}88, transparent);
        }
        .ss-card:hover {
          transform: translateY(-7px) scale(1.06);
          box-shadow: 0 18px 40px rgba(0,0,0,.38), 0 0 20px rgba(201,168,76,.18);
          background: linear-gradient(160deg, rgba(255,255,255,.15) 0%, rgba(255,255,255,.07) 100%);
        }

        /* ── EMOJI RING ── */
        .ss-ring {
          width: 46px; height: 46px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(201,168,76,.22), rgba(0,0,0,.45));
          border: 1.5px solid rgba(201,168,76,.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 8px; flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.08);
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .ss-card:hover .ss-ring { transform: scale(1.18) rotate(8deg); }

        /* ── GOLD DIVIDER ── */
        .ss-div {
          display: flex; align-items: center; gap: 4px;
          margin: 5px auto 6px;
        }
        .ss-div::before, .ss-div::after {
          content: ''; display: block;
          width: 14px; height: 1px;
          background: linear-gradient(to right, transparent, ${GOLD});
          opacity: .65;
        }
        .ss-div::after { background: linear-gradient(to left, transparent, ${GOLD}); }

        /* ── MARQUEE ── */
        .ss-track {
          display: flex; width: max-content; align-items: center;
          animation: ss-scroll 32s linear infinite;
        }
        .ss-track:hover { animation-play-state: paused; }

        .ss-timg {
          width: 32px; height: 32px; border-radius: 50%;
          overflow: hidden;
          border: 1.5px solid ${GOLD}66;
          box-shadow: 0 2px 8px rgba(0,0,0,.35);
          flex-shrink: 0;
        }
        .ss-timg img { width:100%; height:100%; object-fit:cover; display:block; }

        .ss-pipe {
          width: 1px; height: 18px;
          background: linear-gradient(to bottom, transparent, ${GOLD}55, transparent);
          margin: 0 4px; flex-shrink: 0;
        }
      `}</style>

      {/* ══ OUTER WRAPPER — gold border via box-shadow + border-radius ══ */}
      <div style={{
        position: "relative",
        borderRadius: 26,
        /* layered gold glow + sharp border */
        boxShadow: `
          0 0 0 1.5px ${GOLD}bb,
          0 0 0 3px   ${GOLD}22,
          0 0 18px 4px ${GOLD}18,
          0 28px 70px rgba(0,0,0,.38)
        `,
        opacity: visible ? 1 : 0,
        animation: visible ? "ss-up .7s cubic-bezier(.16,1,.3,1) both" : "none",
      }}>

        {/* ══ MAIN GREEN CARD ══ */}
        <div style={{
          background: `radial-gradient(ellipse at 55% 35%, #1d5c38 0%, #0c2e14 55%, ${DARK} 100%)`,
          borderRadius: 26,
          overflow: "hidden",
          position: "relative",
        }}>

          {/* noise / grain texture */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          }}/>

          {/* vignette corners */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,.45) 100%)", pointerEvents:"none" }}/>

          {/* top-right gold radial glow */}
          <div style={{ position:"absolute", top:"-30%", right:"-10%", width:"60%", height:"160%", background:`radial-gradient(ellipse, ${GOLD}12 0%, transparent 70%)`, pointerEvents:"none" }}/>

          {/* ── DECORATIVE LEFT ILLUSTRATION ── */}
          <div style={{ position:"absolute", bottom:0, left:0, width:"42%", height:"68%", pointerEvents:"none", overflow:"hidden" }}>
            <svg viewBox="0 0 200 180" style={{ width:"100%", height:"100%" }}>
              <defs>
                <linearGradient id="hillg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a6b30" stopOpacity=".7"/>
                  <stop offset="100%" stopColor="#0a2010" stopOpacity=".4"/>
                </linearGradient>
                <linearGradient id="hutg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD_LT} stopOpacity=".75"/>
                  <stop offset="100%" stopColor={GOLD}   stopOpacity=".45"/>
                </linearGradient>
              </defs>
              {/* distant mountains */}
              <path d="M0,140 Q30,90 70,110 Q110,130 150,100 Q170,88 200,110 L200,180 L0,180 Z" fill="url(#hillg)" opacity=".5"/>
              <path d="M0,155 Q40,125 80,140 Q120,155 160,138 Q180,130 200,145 L200,180 L0,180 Z" fill="#0a2810" opacity=".6"/>

              {/* STILTED HUT */}
              {/* stilts */}
              {[38,55,72,89].map(x => (
                <line key={x} x1={x} y1="135" x2={x} y2="162" stroke={`${GOLD}88`} strokeWidth="2.5" strokeLinecap="round"/>
              ))}
              {/* cross bracing */}
              <line x1="38" y1="145" x2="55" y2="158" stroke={`${GOLD}44`} strokeWidth="1"/>
              <line x1="55" y1="145" x2="38" y2="158" stroke={`${GOLD}44`} strokeWidth="1"/>
              <line x1="72" y1="145" x2="89" y2="158" stroke={`${GOLD}44`} strokeWidth="1"/>
              <line x1="89" y1="145" x2="72" y2="158" stroke={`${GOLD}44`} strokeWidth="1"/>
              {/* floor platform */}
              <rect x="33" y="133" width="62" height="4" rx="2" fill={`${GOLD}77`}/>
              {/* hut body */}
              <rect x="34" y="95" width="60" height="40" rx="3" fill="url(#hutg)" stroke={`${GOLD}99`} strokeWidth="1"/>
              {/* planks detail */}
              {[105,112,120,127].map(y => (
                <line key={y} x1="34" y1={y} x2="94" y2={y} stroke={`${GOLD}22`} strokeWidth=".5"/>
              ))}
              {/* roof */}
              <polygon points="24,95 104,95 64,62" fill={`${GOLD_LT}88`} stroke={`${GOLD}bb`} strokeWidth="1.2"/>
              {/* roof ridge */}
              <line x1="64" y1="62" x2="64" y2="95" stroke={`${GOLD}66`} strokeWidth="1"/>
              {/* eave line */}
              <line x1="24" y1="95" x2="104" y2="95" stroke={`${GOLD}55`} strokeWidth="1"/>
              {/* door */}
              <rect x="56" y="112" width="13" height="23" rx="2" fill={`${GOLD}33`} stroke={`${GOLD}88`} strokeWidth="1"/>
              <circle cx="67" cy="124" r="1.5" fill={`${GOLD}cc`}/>
              {/* windows */}
              <rect x="37" y="101" width="11" height="9" rx="1.5" fill={`${GOLD}22`} stroke={`${GOLD}77`} strokeWidth=".8"/>
              <rect x="79" y="101" width="11" height="9" rx="1.5" fill={`${GOLD}22`} stroke={`${GOLD}77`} strokeWidth=".8"/>
              {/* window cross */}
              <line x1="42.5" y1="101" x2="42.5" y2="110" stroke={`${GOLD}55`} strokeWidth=".6"/>
              <line x1="37" y1="105.5" x2="48" y2="105.5" stroke={`${GOLD}55`} strokeWidth=".6"/>
              {/* steps */}
              <rect x="52" y="155" width="20" height="3" rx="1" fill={`${GOLD}55`}/>
              <rect x="55" y="158" width="14" height="3" rx="1" fill={`${GOLD}44`}/>

              {/* LEFT TREE */}
              <line x1="14" y1="162" x2="14" y2="82" stroke="#1a6b30" strokeWidth="2.5" strokeLinecap="round"/>
              <ellipse cx="14" cy="76" rx="11" ry="25" fill="#1a6b30" opacity=".8"/>
              <ellipse cx="10" cy="88" rx="9" ry="18" fill="#165c28" opacity=".7"/>
              <ellipse cx="18" cy="92" rx="8" ry="15" fill="#1a6b30" opacity=".6"/>

              {/* TEA LEAVES bottom-left */}
              <ellipse cx="-2" cy="162" rx="18" ry="10" fill="#2a8040" transform="rotate(-25,-2,162)" opacity=".85"/>
              <ellipse cx="8"  cy="168" rx="15" ry="9"  fill="#226633" transform="rotate(-15,8,168)"  opacity=".8"/>
              <ellipse cx="-5" cy="152" rx="13" ry="7"  fill="#2a8040" transform="rotate(-35,-5,152)" opacity=".75"/>
              <ellipse cx="18" cy="170" rx="12" ry="6"  fill="#1a6b30" transform="rotate(-10,18,170)" opacity=".7"/>

              {/* birds */}
              <path d="M 108,52 Q 111,48 114,52" fill="none" stroke="#1a6b30" strokeWidth="1" strokeLinecap="round"/>
              <path d="M 118,44 Q 121,40 124,44" fill="none" stroke="#1a6b30" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </div>

          {/* ── DECORATIVE RIGHT: mandala ── */}
          <div style={{ position:"absolute", bottom:-10, right:-10, width:"30%", height:"65%", pointerEvents:"none", overflow:"hidden" }}>
            <svg viewBox="0 0 140 140" style={{ width:"100%", height:"100%", opacity:.38 }}>
              <defs>
                <radialGradient id="mandg" cx="50%" cy="50%">
                  <stop offset="0%" stopColor={GOLD} stopOpacity=".3"/>
                  <stop offset="100%" stopColor={GOLD} stopOpacity="0"/>
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="70" fill="url(#mandg)"/>
              {[60,46,34,24].map((r,i) => (
                <circle key={i} cx="100" cy="100" r={r} fill="none" stroke={GOLD} strokeWidth={.6-i*.08} strokeOpacity={.5-i*.06}/>
              ))}
              {[0,24,48,72,96,120,144,168,192,216,240,264,288,312,336].map((deg,i) => (
                <ellipse key={i} cx="100" cy="100" rx="5" ry="24"
                  fill={`${GOLD}18`} stroke={`${GOLD}44`} strokeWidth=".4"
                  transform={`rotate(${deg} 100 100)`}/>
              ))}
              {/* inner petals */}
              {[0,45,90,135,180,225,270,315].map((deg,i) => (
                <ellipse key={i} cx="100" cy="100" rx="3" ry="12"
                  fill={`${GOLD}28`} stroke={`${GOLD}66`} strokeWidth=".5"
                  transform={`rotate(${deg} 100 100)`}/>
              ))}
              <circle cx="100" cy="100" r="5" fill={GOLD} fillOpacity=".4"/>
              {/* leaves */}
              <ellipse cx="132" cy="90" rx="10" ry="22" fill="#2a7a3a" transform="rotate(18,132,90)" opacity=".8"/>
              <ellipse cx="126" cy="112" rx="9" ry="18" fill="#1d6630" transform="rotate(32,126,112)" opacity=".7"/>
              <ellipse cx="136" cy="68"  rx="8" ry="14" fill="#2a7a3a" transform="rotate(8,136,68)"  opacity=".6"/>
            </svg>
          </div>

          {/* ══ CONTENT ══ */}
          <div style={{ position:"relative", zIndex:2, padding:"22px 16px 0" }}>

            {/* TOP ROW */}
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>

              {/* LEFT: heading */}
              <div style={{ width:148, flexShrink:0 }}>
                <h2 style={{
                  fontFamily:"'Playfair Display',serif",
                  color:"#fff", fontSize:"1.2rem", fontWeight:800,
                  lineHeight:1.18, marginBottom:10,
                  textShadow:"0 2px 12px rgba(0,0,0,.5)"
                }}>
                  Celebrating<br/>
                  <span style={{
                    color:GOLD,
                    textShadow:`0 0 20px ${GOLD}55`
                  }}>Assam's Heritage</span>
                </h2>

                {/* ornament */}
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:10 }}>
                  <div style={{ flex:1, height:1, background:`linear-gradient(to right,transparent,${GOLD}88)` }}/>
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path d="M7,1 L8.2,5.5 L13,7 L8.2,8.5 L7,13 L5.8,8.5 L1,7 L5.8,5.5 Z"
                      fill={GOLD} fillOpacity=".9"/>
                  </svg>
                  <div style={{ flex:1, height:1, background:`linear-gradient(to left,transparent,${GOLD}88)` }}/>
                </div>

                <p style={{ color:"rgba(255,255,255,.55)", fontSize:10.5, lineHeight:1.6 }}>
                  Proudly crafted in Assam, for India and the world.
                </p>
              </div>

              {/* RIGHT: 5 stat cards */}
              <div style={{ flex:1, display:"flex", gap:7 }}>
                {stats.map((s, i) => (
                  <div key={s.label} className="ss-card"
                    style={{
                      opacity: visible ? 1 : 0,
                      animation: visible
                        ? `ss-pop .55s cubic-bezier(.34,1.56,.64,1) ${0.15+i*0.1}s both`
                        : "none",
                    }}>
                    <div className="ss-ring">{s.emoji}</div>
                    <p style={{
                      color: GOLD_LT,
                      fontWeight: 800,
                      fontSize: s.value >= 10000 ? ".8rem" : ".95rem",
                      fontFamily:"'Playfair Display',serif",
                      lineHeight: 1,
                      textShadow:`0 0 14px ${GOLD}66`,
                    }}>
                      <CounterAnimation end={s.value} suffix={s.suffix}/>
                    </p>
                    <div className="ss-div">
                      <svg width="8" height="8" viewBox="0 0 8 8">
                        <path d="M4,0 L4.8,3 L8,4 L4.8,5 L4,8 L3.2,5 L0,4 L3.2,3 Z" fill={GOLD} fillOpacity=".8"/>
                      </svg>
                    </div>
                    <p style={{
                      color:"rgba(255,255,255,.58)", fontSize:7.5,
                      lineHeight:1.45, whiteSpace:"pre-line",
                      fontWeight:500, letterSpacing:.3,
                    }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── MARQUEE ROW ── */}
            <div style={{
              marginTop:16,
              borderTop:`1px solid ${GOLD}28`,
              overflow:"hidden",
              padding:"11px 0 18px",
              maskImage:"linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%)",
              WebkitMaskImage:"linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%)",
            }}>
              <div className="ss-track">
                {[...tags,...tags].map((t,i) => (
                  <span key={i} style={{ display:"inline-flex", alignItems:"center" }}>
                    <span style={{
                      display:"inline-flex", alignItems:"center", gap:8,
                      padding:"0 16px",
                      color:"rgba(255,255,255,.8)", fontSize:12, fontWeight:500,
                      whiteSpace:"nowrap",
                      letterSpacing:.3,
                    }}>
                      <span className="ss-timg">
                        <img src={t.img} alt={t.label}
                          onError={e => {(e.target as HTMLImageElement).style.display="none";}}/>
                      </span>
                      {t.label}
                    </span>
                    {i % tags.length !== tags.length-1 && <span className="ss-pipe"/>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ SHIELD CURVE BOTTOM ══ */}
        <div style={{ position:"relative", marginTop:-1, zIndex:5 }}>
          <svg viewBox="0 0 400 44" preserveAspectRatio="none"
            style={{ width:"100%", height:44, display:"block" }}>
            <defs>
              <linearGradient id="curveg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor={DARK}/>
                <stop offset="50%"  stopColor={MID}/>
                <stop offset="100%" stopColor={DARK}/>
              </linearGradient>
            </defs>
            {/* filled curve */}
            <path d="M0,0 L400,0 L400,22 Q200,46 0,22 Z" fill="url(#curveg)"/>
            {/* gold stroke */}
            <path d="M0,0 Q200,46 400,0"
              fill="none" stroke={GOLD} strokeWidth="1.8" strokeOpacity=".7"/>
            {/* side lines */}
            <line x1="0"   y1="0" x2="0"   y2="22" stroke={GOLD} strokeWidth="1.8" strokeOpacity=".5"/>
            <line x1="400" y1="0" x2="400" y2="22" stroke={GOLD} strokeWidth="1.8" strokeOpacity=".5"/>
            {/* inner soft glow line */}
            <path d="M10,2 Q200,42 390,2"
              fill="none" stroke={GOLD_LT} strokeWidth=".6" strokeOpacity=".3"/>
          </svg>

          {/* Lotus badge */}
          <div style={{
            position:"absolute", bottom:-18, left:"50%", transform:"translateX(-50%)",
            width:36, height:36, borderRadius:"50%",
            background:`radial-gradient(circle at 40% 40%, ${GREEN}, ${DARK})`,
            border:`2px solid ${GOLD}aa`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 0 0 3px ${GOLD}22, 0 6px 18px rgba(0,0,0,.5), 0 0 12px ${GOLD}33`,
            zIndex:20, fontSize:17,
          }}>
            🌿
          </div>
        </div>

        <div style={{ height:22 }}/>
      </div>
    </section>
  );
}