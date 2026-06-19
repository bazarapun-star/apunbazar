export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "24px",
        background: "#F8F6F1",
      }}
    >
      <div
        style={{
          fontSize: "90px",
          marginBottom: "10px",
        }}
      >
        🍃
      </div>

      <h1
        style={{
          fontSize: "72px",
          fontWeight: "800",
          color: "#0F3D2E",
          margin: 0,
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: "32px",
          color: "#0F3D2E",
          marginTop: "10px",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Oops! Lost in Assam?
      </h2>

      <p
        style={{
          maxWidth: "420px",
          color: "#666",
          marginTop: "10px",
          lineHeight: 1.7,
        }}
      >
        The page you're looking for seems to have wandered into the tea gardens of Assam.
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "24px",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/"
          style={{
            background: "#0F3D2E",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: "14px",
            textDecoration: "none",
            fontWeight: "700",
          }}
        >
          🏠 Back Home
        </a>

        <a
          href="/shop"
          style={{
            background: "#D4AF37",
            color: "#111",
            padding: "14px 28px",
            borderRadius: "14px",
            textDecoration: "none",
            fontWeight: "700",
          }}
        >
          🛍️ Continue Shopping
        </a>
      </div>
    </div>
  );
}
