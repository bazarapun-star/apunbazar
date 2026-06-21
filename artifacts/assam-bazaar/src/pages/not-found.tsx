export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      textAlign: "center", padding: "24px",
      background: "#F8F6F1", fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{ fontSize: 90, marginBottom: 10 }}>🍃</div>

      <h1 style={{ fontSize: 72, fontWeight: 800, color: "#0F3D2E", margin: 0 }}>
        404
      </h1>

      <h2 style={{
        fontSize: 28, color: "#0F3D2E", marginTop: 10,
        fontFamily: "'Playfair Display', serif", fontWeight: 700,
      }}>
        Oops! Lost in Assam?
      </h2>

      <p style={{ maxWidth: 380, color: "#666", marginTop: 10, lineHeight: 1.7, fontSize: 14 }}>
        The page you're looking for seems to have wandered into the tea gardens of Assam.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap", justifyContent: "center" }}>
        <a href="/" style={{
          background: "#0F3D2E", color: "#fff",
          padding: "13px 28px", borderRadius: 12,
          textDecoration: "none", fontWeight: 700, fontSize: 14,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          🏠 Back Home
        </a>
        <a href="/products" style={{
          background: "#D4AF37", color: "#111",
          padding: "13px 28px", borderRadius: 12,
          textDecoration: "none", fontWeight: 700, fontSize: 14,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          🛍️ Continue Shopping
        </a>
      </div>
    </div>
  );
}
