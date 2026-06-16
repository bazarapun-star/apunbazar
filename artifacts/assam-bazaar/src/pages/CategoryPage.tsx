// ─── CATEGORY SECTION ─────────────────────────────────────────────────────────
const FALLBACK_CATS = [
  { id: "tea", name: "Assam Tea", slug: "tea", emoji: "🍵", imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80" },
  { id: "handloom", name: "Handloom", slug: "handloom", emoji: "🧣", imageUrl: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&q=80" },
  { id: "traditional", name: "Traditional Wear", slug: "traditional-wear", emoji: "👗", imageUrl: "https://images.unsplash.com/photo-1610189844772-cb6c5e618c12?w=800&q=80" },
];

function CategorySection({ categories, isLoading }: { categories: any[]; isLoading: boolean }) {
  const cats = (Array.isArray(categories) && categories.length > 0) ? categories.slice(0, 3) : FALLBACK_CATS;

  return (
    <section style={{ padding: "28px 16px 24px", background: BG }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h2 className="ab-serif" style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1a3324", letterSpacing: 0.5, textTransform: "uppercase" }}>Shop by <span style={{ color: GOLD }}>Category</span></h2>
          <Link href="/products" className="ab-viewall">View All <IconArrowRight size={14} /></Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: 90 }}>
          <div style={{ flex: 1, height: 1.5, background: GOLD }} />
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, display: "inline-block" }} />
          <div style={{ flex: 1, height: 1.5, background: GOLD }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} style={{ aspectRatio: "1/1.1", borderRadius: 16, background: "#e5e7eb" }} />)
          : cats.map((cat: any, idx: number) => {
              const imgSrc = cat.imageUrl ?? cat.image_url ?? null;
              return (
                <Link
                  key={cat.id ?? cat.slug}
                  href={`/category/${cat.slug}`}
                  style={{
                    position: "relative",
                    borderRadius: 18,
                    overflow: "hidden",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 16px rgba(0,0,0,.08)",
                    gridColumn: idx === cats.length - 1 && cats.length % 2 === 1 ? "1 / -1" : undefined,
                  }}
                >
                  <div style={{ width: "100%", aspectRatio: "4/5", overflow: "hidden", background: "#e5e7eb", position: "relative" }}>
                    {imgSrc
                      ? <img src={imgSrc} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, background: "#edf5ef" }}>{(cat as any).emoji ?? "🌿"}</div>
                    }
                  </div>
                  <div style={{ textAlign: "center", padding: "12px 6px 4px" }}>
                    <p className="ab-serif" style={{ fontSize: 15, fontWeight: 700, color: "#1a3324", marginBottom: 6 }}>{cat.name}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "60%", margin: "0 auto" }}>
                      <div style={{ flex: 1, height: 1, background: GOLD }} />
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD, display: "inline-block" }} />
                      <div style={{ flex: 1, height: 1, background: GOLD }} />
                    </div>
                  </div>
                </Link>
              );
            })
        }
      </div>
    </section>
  );
}
