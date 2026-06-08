import { useEffect, useRef } from "react";

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
      el.style.opacity = "1";
    };
    const onLeave = () => { if (el) el.style.opacity = "0"; };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(26,92,42,0.07) 0%, transparent 70%)",
        borderRadius: "50%",
        opacity: 0,
        transition: "opacity 0.5s ease",
      }}
    />
  );
}
