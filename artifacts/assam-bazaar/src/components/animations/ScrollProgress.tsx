import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]"
      style={{ background: "rgba(0,0,0,0.05)" }}>
      <div
        className="h-full transition-none will-change-transform"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #1a5c2a, #d4a017, #e05c2f)",
        }}
      />
    </div>
  );
}
