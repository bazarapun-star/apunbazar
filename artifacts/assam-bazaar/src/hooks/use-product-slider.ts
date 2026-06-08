/**
 * use-product-slider.ts
 * Save to: artifacts/assam-bazaar/src/hooks/use-product-slider.ts
 */

import { useState, useEffect, useRef, useCallback } from "react";

interface UseProductSliderOptions {
  total: number;
  interval?: number;
}

export interface UseProductSliderReturn {
  current: number;
  prev: number | null;
  direction: "left" | "right";
  paused: boolean;
  setPaused: (v: boolean) => void;
  advance: (delta: 1 | -1) => void;
  goTo: (index: number) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export function useProductSlider({
  total,
  interval = 3000,
}: UseProductSliderOptions): UseProductSliderReturn {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [paused, setPaused] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const advance = useCallback(
    (delta: 1 | -1) => {
      if (total <= 1) return;
      setCurrent((c) => {
        const next = (c + delta + total) % total;
        setPrev(c);
        setDirection(delta === 1 ? "left" : "right");
        return next;
      });
    },
    [total]
  );

  const goTo = useCallback(
    (index: number) => {
      setCurrent((c) => {
        if (index === c || total <= 1) return c;
        setDirection(index > c ? "left" : "right");
        setPrev(c);
        return index;
      });
      if (timerRef.current) clearInterval(timerRef.current);
      if (!paused) {
        timerRef.current = setInterval(() => advance(1), interval);
      }
    },
    [total, paused, interval, advance]
  );

  useEffect(() => {
    if (paused || total <= 1) return;
    timerRef.current = setInterval(() => advance(1), interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, interval, advance, total]);

  useEffect(() => {
    const id = setTimeout(() => setPrev(null), 450);
    return () => clearTimeout(id);
  }, [current]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 28) {
      advance(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
    setPaused(false);
  };

  return {
    current,
    prev,
    direction,
    paused,
    setPaused,
    advance,
    goTo,
    onTouchStart,
    onTouchEnd,
  };
}
