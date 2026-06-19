import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw, ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash2, GripVertical, ImageIcon } from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface BannerSlide { tag: string; title: string; sub: string; }
interface CatCfg {
  color: string; accent: string; image: string;
  banners: BannerSlide[];
}

// ─── DEFAULTS ─────────────────────────────────────────────────────────────────
const CATEGORY_SLUGS = [
  { slug: "handloom",    name: "Handloom & Textiles", emoji: "🧵" },
  { slug: "tea",         name: "Assam Tea",            emoji: "🍵" },
  { slug: "handicrafts", name: "Handicrafts",          emoji: "🏺" },
  { slug: "organic",     name: "Organic Food",         emoji: "🌿" },
  { slug: "bags",        name: "Bags & Accessories",   emoji: "👜" },
];

const DEFAULT_CONFIGS: Record<string, CatCfg> = {
  handloom: {
    color: "#1a3a2e", accent: "#c9a84c",
    image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=1400&q=80",
    banners: [
      { tag: "GI TAGGED AUTHENTIC",  title: "Muga & Pat Silk",   sub: "Woven by master artisans of Sualkuchi" },
      { tag: "HERITAGE COLLECTION",  title: "Mekhela Chador",    sub: "Traditional Assamese women's attire" },
      { tag: "GAMOSA SPECIAL",       title: "Symbol of Assam",   sub: "Gifted with love across generations" },
    ],
  },
  tea: {
    color: "#1a2e1a", accent: "#7ab648",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1400&q=80",
    banners: [
      { tag: "AWARD WINNING",  title: "Assam Orthodox",  sub: "Bold, malty, world-famous black tea" },
      { tag: "GARDEN FRESH",   title: "First Flush 2026", sub: "Limited seasonal harvest — just arrived" },
      { tag: "WELLNESS BLEND", title: "Green & Herbal",   sub: "Pure Assam herbs for mind & body" },
    ],
  },
  handicrafts: {
    color: "#2e1a0e", accent: "#c97a3a",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80",
    banners: [
      { tag: "MASTER CRAFTSMEN", title: "Bamboo & Cane",       sub: "Eco-friendly art from the forests of Assam" },
      { tag: "TRIBAL HERITAGE",  title: "Masks & Pottery",     sub: "Traditional Assamese folk art forms" },
      { tag: "HOME DÉCOR",       title: "Handcrafted Wonders", sub: "Unique pieces for your living space" },
    ],
  },
  organic: {
    color: "#1e2e10", accent: "#82c341",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80",
    banners: [
      { tag: "100% NATURAL",   title: "Joha Rice",    sub: "Fragrant heirloom rice from Assam's fields" },
      { tag: "COLD PRESSED",   title: "Mustard Oil",  sub: "Kachi ghani — traditional extraction method" },
      { tag: "FOREST HARVEST", title: "Wild Honey",   sub: "Raw, unprocessed, straight from the hive" },
    ],
  },
  bags: {
    color: "#2e1a2e", accent: "#c97ac9",
    image: "https://images.unsplash.com/photo-1605618474884-e4adc4b8d099?w=1400&q=80",
    banners: [
      { tag: "SUSTAINABLE FASHION", title: "Jute & Cane Bags", sub: "Eco-chic accessories from Assam" },
      { tag: "HANDWOVEN",           title: "Tribal Totes",     sub: "Bold patterns, zero plastic" },
      { tag: "GIFTING SPECIAL",     title: "Gift Hampers",     sub: "Curated Assamese luxury gift sets" },
    ],
  },
};

// Quick-pick images per category
const QUICK_IMAGES: Record<string, { label: string; url: string }[]> = {
  handloom: [
    { label: "Handloom Fabric", url: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=1400&q=80" },
    { label: "Silk Weave",      url: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1400&q=80" },
    { label: "Traditional",     url: "https://images.unsplash.com/photo-1610189844772-cb6c5e618c12?w=1400&q=80" },
  ],
  tea: [
    { label: "Tea Garden",  url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1400&q=80" },
    { label: "Tea Cup",     url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1400&q=80" },
    { label: "Tea Leaves",  url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1400&q=80" },
  ],
  handicrafts: [
    { label: "Bamboo Craft", url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80" },
    { label: "Pottery",      url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1400&q=80" },
    { label: "Art Decor",    url: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=1400&q=80" },
  ],
  organic: [
    { label: "Organic Farm",  url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80" },
    { label: "Rice Field",    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80" },
    { label: "Honey",         url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1400&q=80" },
  ],
  bags: [
    { label: "Jute Bag",   url: "https://images.unsplash.com/photo-1605618474884-e4adc4b8d099?w=1400&q=80" },
    { label: "Craft Bag",  url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1400&q=80" },
    { label: "Handmade",   url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1400&q=80" },
  ],
};

// ─── LIVE PREVIEW ─────────────────────────────────────────────────────────────
function BannerPreview({ cfg, slug }: { cfg: CatCfg; slug: string }) {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % cfg.banners.length); setVis(true); }, 250);
    }, 3500);
    return () => clearInterval(t);
  }, [cfg.banners.length]);

  const b = cfg.banners[idx];

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", position: "relative", height: 200, background: cfg.color }}>
      {cfg.image && (
        <img src={cfg.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${cfg.color}d0 0%, ${cfg.color}80 100%)` }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 20px", textAlign: "center" }}>
        <div style={{ background: `${cfg.accent}25`, border: `1px solid ${cfg.accent}55`, borderRadius: 100, padding: "3px 14px", fontSize: 9, letterSpacing: 3, color: cfg.accent, fontWeight: 700 }}>
          ✦ {b?.tag} ✦
        </div>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(6px)", transition: "all 0.25s" }}>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 5px", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
            {b?.title}
          </h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: 0 }}>{b?.sub}</p>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
          {["100+ Products", "500+ Artisans", "GI Certified"].map(s => (
            <span key={s} style={{ fontSize: 9.5, color: cfg.accent, fontWeight: 600 }}>{s}</span>
          ))}
        </div>
      </div>
      {/* Dots */}
      <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
        {cfg.banners.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{ height: 3.5, borderRadius: 100, cursor: "pointer", transition: "all .3s", width: i === idx ? 18 : 3.5, background: i === idx ? cfg.accent : "rgba(255,255,255,0.35)" }} />
        ))}
      </div>
      {/* Label */}
      <div style={{ position: "absolute", top: 8, right: 10, background: "rgba(0,0,0,0.3)", borderRadius: 100, padding: "2px 10px", fontSize: 9, color: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)" }}>
        LIVE PREVIEW
      </div>
    </div>
  );
}

// ─── MAIN ADMIN ───────────────────────────────────────────────────────────────
export default function CategoryBannerManager() {
  const [configs, setConfigs] = useState<Record<string, CatCfg>>(DEFAULT_CONFIGS);
  const [activeSlug, setActiveSlug] = useState("tea");
  const [expandedBanner, setExpandedBanner] = useState<number | null>(0);
  const [showPreview, setShowPreview] = useState(true);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  // Load saved config
  useEffect(() => {
    try {
      const raw = localStorage.getItem("category_configs");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setConfigs({ ...DEFAULT_CONFIGS, ...parsed });
      }
    } catch {}
  }, []);

  function publish() {
    localStorage.setItem("category_configs", JSON.stringify(configs));
    window.dispatchEvent(new Event("category_config_updated"));
    window.dispatchEvent(new StorageEvent("storage", { key: "category_configs" }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast({ title: "✅ Published!", description: "Category pages updated live." });
  }

  function resetAll() {
    if (!confirm("Reset all categories to defaults?")) return;
    setConfigs(DEFAULT_CONFIGS);
    localStorage.removeItem("category_configs");
    window.dispatchEvent(new Event("category_config_updated"));
    toast({ title: "Reset complete" });
  }

  function resetCategory() {
    if (!confirm(`Reset ${activeSlug} to default?`)) return;
    setConfigs(prev => ({ ...prev, [activeSlug]: DEFAULT_CONFIGS[activeSlug] }));
    toast({ title: `${activeSlug} reset to default` });
  }

  function updateField(field: string, value: string) {
    setConfigs(prev => ({ ...prev, [activeSlug]: { ...prev[activeSlug], [field]: value } }));
  }

  function updateBanner(idx: number, field: string, value: string) {
    setConfigs(prev => {
      const banners = [...(prev[activeSlug]?.banners ?? [])];
      banners[idx] = { ...banners[idx], [field]: value };
      return { ...prev, [activeSlug]: { ...prev[activeSlug], banners } };
    });
  }

  function addBanner() {
    setConfigs(prev => {
      const banners = [...(prev[activeSlug]?.banners ?? [])];
      banners.push({ tag: "NEW BANNER", title: "New Title", sub: "Add your description here" });
      return { ...prev, [activeSlug]: { ...prev[activeSlug], banners } };
    });
    setTimeout(() => setExpandedBanner(configs[activeSlug]?.banners?.length ?? 0), 50);
  }

  function removeBanner(idx: number) {
    if (!confirm("Remove this banner slide?")) return;
    setConfigs(prev => {
      const banners = prev[activeSlug]?.banners?.filter((_, i) => i !== idx) ?? [];
      return { ...prev, [activeSlug]: { ...prev[activeSlug], banners } };
    });
    setExpandedBanner(null);
  }

  const cfg = configs[activeSlug];
  const catInfo = CATEGORY_SLUGS.find(c => c.slug === activeSlug);
  const quickImages = QUICK_IMAGES[activeSlug] ?? [];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 80px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes cbm-save { 0%{transform:scale(1)} 40%{transform:scale(.95)} 80%{transform:scale(1.04)} 100%{transform:scale(1)} }
        .cbm-save-anim { animation: cbm-save .35s ease; }
        .cbm-tab { transition: all .18s; }
        .cbm-tab:hover { opacity: .85; }
        .cbm-banner-row { transition: background .15s; }
        .cbm-banner-row:hover { background: rgba(0,0,0,0.02); }
        .cbm-input { width: 100%; border: 1.5px solid #e0d8c0; border-radius: 10px; padding: 8px 12px; font-size: 13px; outline: none; font-family: inherit; background: #fff; transition: border-color .2s; }
        .cbm-input:focus { border-color: #c9a84c; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); }
        .cbm-label { font-size: 11px; font-weight: 600; color: #666; margin-bottom: 5px; letter-spacing: .4px; display: block; }
        .cbm-section { background: #fff; border-radius: 18px; border: 1px solid #ede8de; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
      `}</style>

      {/* ─── Header ─── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#1a2d1a" }}>
            Category Banner Manager
          </h1>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
            Edit hero banners, colors & images for each category page
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={resetAll}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1.5px solid #e0d8c0", borderRadius: 10, background: "#fff", fontSize: 12, fontWeight: 600, color: "#666", cursor: "pointer" }}>
            <RotateCcw size={13} /> Reset All
          </button>
          <button onClick={publish}
            className={saved ? "cbm-save-anim" : ""}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", border: "none", borderRadius: 10, background: saved ? "#16a34a" : "#1a3a2e", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background .3s" }}>
            <Save size={13} /> {saved ? "Saved!" : "Publish"}
          </button>
        </div>
      </div>

      {/* ─── Category Tabs ─── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {CATEGORY_SLUGS.map(cat => (
          <button key={cat.slug}
            className="cbm-tab"
            onClick={() => { setActiveSlug(cat.slug); setExpandedBanner(null); }}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 16px",
              borderRadius: 100, fontSize: 12.5, fontWeight: 600, cursor: "pointer", border: "none",
              background: activeSlug === cat.slug ? "#1a3a2e" : "#f0ece4",
              color: activeSlug === cat.slug ? "#fff" : "#555",
              boxShadow: activeSlug === cat.slug ? "0 4px 14px rgba(26,58,46,0.25)" : "none",
            }}>
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {cfg && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ─── Preview toggle ─── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>
              {catInfo?.emoji} {catInfo?.name}
            </span>
            <button onClick={() => setShowPreview(!showPreview)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", border: "1.5px solid #e0d8c0", borderRadius: 10, background: "#fff", fontSize: 12, fontWeight: 600, color: showPreview ? "#1a3a2e" : "#888", cursor: "pointer" }}>
              {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
              {showPreview ? "Hide preview" : "Show preview"}
            </button>
          </div>

          {/* ─── Live Preview ─── */}
          {showPreview && <BannerPreview cfg={cfg} slug={activeSlug} />}

          {/* ─── Image & Colors ─── */}
          <div className="cbm-section">
            <div style={{ padding: "18px 18px 0", borderBottom: "1px solid #f0ece4", paddingBottom: 18 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#999", margin: "0 0 14px", textTransform: "uppercase" }}>
                Visual Settings
              </p>

              {/* Image URL */}
              <div style={{ marginBottom: 14 }}>
                <label className="cbm-label">Background Image URL</label>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 52, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid #e0d8c0", background: "#f0ece4" }}>
                    {cfg.image
                      ? <img src={cfg.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><ImageIcon size={16} color="#bbb" /></div>
                    }
                  </div>
                  <input className="cbm-input" value={cfg.image ?? ""} onChange={e => updateField("image", e.target.value)} placeholder="https://images.unsplash.com/..." />
                </div>
                {quickImages.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <p style={{ fontSize: 10.5, color: "#aaa", margin: "0 0 6px" }}>Quick picks:</p>
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
                      {quickImages.map(q => (
                        <div key={q.label} onClick={() => updateField("image", q.url)}
                          style={{ flexShrink: 0, cursor: "pointer", borderRadius: 8, overflow: "hidden", width: 60, height: 40, border: cfg.image === q.url ? `2px solid ${cfg.accent}` : "2px solid transparent", transition: "border .2s", position: "relative" }}>
                          <img src={q.url} alt={q.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "flex-end", padding: "2px 4px" }}>
                            <span style={{ fontSize: 8, color: "#fff", fontWeight: 600, lineHeight: 1 }}>{q.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Colors */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="cbm-label">Background Color</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="color" value={cfg.color} onChange={e => updateField("color", e.target.value)}
                      style={{ width: 36, height: 36, borderRadius: 8, cursor: "pointer", border: "1.5px solid #e0d8c0", padding: 2 }} />
                    <input className="cbm-input" value={cfg.color} onChange={e => updateField("color", e.target.value)} style={{ flex: 1 }} />
                  </div>
                </div>
                <div>
                  <label className="cbm-label">Accent Color</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="color" value={cfg.accent} onChange={e => updateField("accent", e.target.value)}
                      style={{ width: 36, height: 36, borderRadius: 8, cursor: "pointer", border: "1.5px solid #e0d8c0", padding: 2 }} />
                    <input className="cbm-input" value={cfg.accent} onChange={e => updateField("accent", e.target.value)} style={{ flex: 1 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Banner Slides ─── */}
          <div className="cbm-section">
            <div style={{ padding: "18px 18px 0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#999", margin: 0, textTransform: "uppercase" }}>
                  Rotating Banner Slides ({cfg.banners?.length ?? 0})
                </p>
                <button onClick={addBanner}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", border: `1.5px solid ${cfg.accent}`, borderRadius: 8, background: "transparent", color: cfg.accent, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                  <Plus size={12} /> Add Slide
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 18 }}>
                {cfg.banners?.map((banner, idx) => (
                  <div key={idx} style={{ border: `1.5px solid ${expandedBanner === idx ? cfg.accent : "#ede8de"}`, borderRadius: 14, overflow: "hidden", transition: "border-color .2s" }}>
                    {/* Row header */}
                    <div className="cbm-banner-row"
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", cursor: "pointer" }}
                      onClick={() => setExpandedBanner(expandedBanner === idx ? null : idx)}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: expandedBanner === idx ? cfg.color : "#f0ece4", color: expandedBanner === idx ? "#fff" : "#666", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, transition: "all .2s" }}>
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: "#1a2d1a", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {banner.title || "Untitled"}
                        </p>
                        <p style={{ fontSize: 10.5, color: "#aaa", margin: 0 }}>{banner.tag}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {cfg.banners.length > 1 && (
                          <button onClick={e => { e.stopPropagation(); removeBanner(idx); }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 4, display: "flex", alignItems: "center" }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                        {expandedBanner === idx ? <ChevronUp size={14} color="#aaa" /> : <ChevronDown size={14} color="#aaa" />}
                      </div>
                    </div>

                    {/* Expanded editor */}
                    {expandedBanner === idx && (
                      <div style={{ padding: "4px 14px 16px", borderTop: "1px solid #f5f1e8" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <div>
                            <label className="cbm-label">Tag <span style={{ color: "#bbb", fontWeight: 400 }}>(small uppercase text above title)</span></label>
                            <input className="cbm-input" value={banner.tag} onChange={e => updateBanner(idx, "tag", e.target.value)} placeholder="e.g. GARDEN FRESH" />
                          </div>
                          <div>
                            <label className="cbm-label">Title <span style={{ color: "#bbb", fontWeight: 400 }}>(large heading)</span></label>
                            <input className="cbm-input" value={banner.title} onChange={e => updateBanner(idx, "title", e.target.value)} placeholder="e.g. Assam Orthodox" />
                          </div>
                          <div>
                            <label className="cbm-label">Subtitle <span style={{ color: "#bbb", fontWeight: 400 }}>(description below title)</span></label>
                            <input className="cbm-input" value={banner.sub} onChange={e => updateBanner(idx, "sub", e.target.value)} placeholder="e.g. Bold, malty, world-famous black tea" />
                          </div>
                        </div>

                        {/* Mini preview */}
                        <div style={{ marginTop: 12, borderRadius: 10, overflow: "hidden", position: "relative", height: 80, background: cfg.color }}>
                          {cfg.image && <img src={cfg.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />}
                          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${cfg.color}cc 0%, ${cfg.color}55 100%)` }} />
                          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, textAlign: "center", padding: "0 12px" }}>
                            <p style={{ fontSize: 8, color: cfg.accent, fontWeight: 700, letterSpacing: 2, margin: 0 }}>{banner.tag || "TAG"}</p>
                            <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#fff", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{banner.title || "Title"}</p>
                            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", margin: 0 }}>{banner.sub || "Subtitle"}</p>
                          </div>
                          <span style={{ position: "absolute", top: 4, right: 6, fontSize: 8, color: "rgba(255,255,255,0.5)" }}>preview</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Publish bar ─── */}
          <div style={{ background: "#fff", border: "1.5px solid #ede8de", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 13.5, margin: "0 0 2px", color: "#1a2d1a" }}>Ready to publish?</p>
              <p style={{ fontSize: 11.5, color: "#aaa", margin: 0 }}>Changes go live on all category pages instantly</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={resetCategory}
                style={{ padding: "8px 14px", border: "1.5px solid #e0d8c0", borderRadius: 10, background: "#fff", fontSize: 12, fontWeight: 600, color: "#888", cursor: "pointer" }}>
                Reset
              </button>
              <button onClick={publish}
                className={saved ? "cbm-save-anim" : ""}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px", border: "none", borderRadius: 10, background: saved ? "#16a34a" : "#1a3a2e", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background .3s" }}>
                <Save size={14} />
                {saved ? "Published!" : "Save & Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
