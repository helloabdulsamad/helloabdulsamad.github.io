"use client";

import { useEffect, useRef } from "react";

// A flat reading bar at the top of a case study.
export default function ReadProgress({ color }: { color: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div ref={bar} className="read-progress" style={{ background: color }} aria-hidden="true" />;
}
