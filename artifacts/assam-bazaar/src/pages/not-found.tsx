export default function NotFound() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      textAlign: "center",
      fontFamily: "'Nunito', sans-serif",
      background: "#f5f0e8",
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
      <h2 style={{
        fontSize: 20, fontWeight: 800, color: "#1a3a22",
        fontFamily: "'Playfair Display', serif", margin: "0 0 8px",
      }}>Page nahi mili</h2>
      <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px" }}>
        Ye page exist nahi karta ya move ho gaya hai.
      </p>
      <a href="/" style={{
        background: "#1a5a32", color: "#fff", padding: "10px 24px",
        borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none",
      }}>
        Home par jao
      </a>
    </div>
  );
}
