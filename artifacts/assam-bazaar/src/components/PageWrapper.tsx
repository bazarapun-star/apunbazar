// ============================================================
//  PageWrapper.tsx — Page Transition Wrapper
//  Drop in: artifacts/assam-bazaar/src/components/PageWrapper.tsx
//
//  Wrap every page component with this to get smooth transitions.
//
//  Usage in your route file:
//    import PageWrapper from '@/components/PageWrapper';
//
//    <PageWrapper>
//      <YourPageComponent />
//    </PageWrapper>
// ============================================================

import { useEffect, useRef } from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = "" }: PageWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Trigger scroll-reveal for all .reveal elements on mount
    const reveals = el.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("revealed");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`page-enter ${className}`}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </div>
  );
}

export default PageWrapper;


// ============================================================
//  LoadingScreen.tsx — Smooth Loading Screen
//  Usage: Show while data is loading
//
//  import { LoadingScreen } from '@/components/PageWrapper';
//  {isLoading && <LoadingScreen />}
// ============================================================

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export function LoadingScreen({
  message = "Loading...",
  className = "",
}: LoadingScreenProps) {
  return (
    <div
      className={`fade-in ${className}`}
      style={{
        position:       "fixed",
        inset:          0,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        gap:            "16px",
        background:     "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        zIndex:         9999,
      }}
    >
      {/* Branded logo / spinner */}
      <div style={{ position: "relative", width: 56, height: 56 }}>
        {/* Outer ring */}
        <div
          style={{
            position:  "absolute",
            inset:     0,
            border:    "3px solid rgba(34,197,94,0.15)",
            borderTop: "3px solid rgb(34,197,94)",
            borderRadius: "50%",
            animation: "loaderSpin 0.8s linear infinite",
          }}
        />
        {/* Inner dot */}
        <div
          style={{
            position:     "absolute",
            top:          "50%",
            left:         "50%",
            transform:    "translate(-50%,-50%)",
            width:        "12px",
            height:       "12px",
            borderRadius: "50%",
            background:   "rgb(34,197,94)",
            animation:    "loaderPulse 1.2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Message */}
      <p
        style={{
          fontSize:      "14px",
          color:         "rgba(0,0,0,0.5)",
          letterSpacing: "0.04em",
          margin:        0,
          animation:     "loaderPulse 1.5s ease-in-out infinite",
        }}
      >
        {message}
      </p>
    </div>
  );
}


// ============================================================
//  SkeletonCard.tsx — Product Card Skeleton
//  Usage: Show while products load
//
//  import { SkeletonCard } from '@/components/PageWrapper';
//  {isLoading && Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
// ============================================================

export function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: "16px",
        overflow:     "hidden",
        background:   "white",
        boxShadow:    "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Image skeleton */}
      <div className="skeleton" style={{ width: "100%", paddingBottom: "75%", borderRadius: 0 }} />
      {/* Content */}
      <div style={{ padding: "12px 14px 16px" }}>
        <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 18, width: "90%", marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 14, width: "40%" }} />
        <div style={{ marginTop: 14 }}>
          <div className="skeleton" style={{ height: 36, width: "100%", borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}