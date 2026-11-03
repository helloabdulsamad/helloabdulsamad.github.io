"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// A case-study title that rises word by word out of masks on arrival.
export default function SplitTitle({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = gsap.from(el.querySelectorAll(".split-w"), { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.06, delay: 0.1 });
    return () => {
      t.kill();
    };
  }, []);
  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="split-mask" aria-hidden="true">
          <span className="split-w">{w}&nbsp;</span>
        </span>
      ))}
    </h1>
  );
}
