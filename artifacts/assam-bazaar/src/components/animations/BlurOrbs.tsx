export function BlurOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.12] animate-pulse"
        style={{
          background: "radial-gradient(circle, #1a5c2a 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.10]"
        style={{
          background: "radial-gradient(circle, #d4a017 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "pulse 4s ease-in-out infinite 1s",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #e05c2f 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "pulse 6s ease-in-out infinite 2s",
        }}
      />
    </div>
  );
}
