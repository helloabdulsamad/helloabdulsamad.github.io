"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// "I build systems that never ..." with the ending rolling through real
// guarantees from the work. Each one is true of a project on this page.
const ENDINGS = [
  "charge anyone twice.",
  "sell one seat twice.",
  "lose a sale offline.",
  "let one store sink another.",
  "trust a payment redirect.",
];

export default function RollingWord() {
  const box = useRef<HTMLSpanElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const el = box.current;
      if (!el) return;
      gsap.to(el, {
        yPercent: -100,
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => {
          setI((n) => (n + 1) % ENDINGS.length);
          gsap.fromTo(el, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: "expo.out" });
        },
      });
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <h2 className="font-display text-[26px] leading-[1.2] tracking-[-0.01em] font-semibold pt-6 pb-6 md:pt-4 md:text-[30px]">
      I build systems that never
      <span className="roll-mask">
        <span ref={box} className="roll-word text-custom-gray-500 dark:text-app-link-text-default">
          {ENDINGS[i]}
        </span>
      </span>
      <span className="sr-only">
        I build systems that never charge anyone twice, never sell one seat twice and never lose a sale offline.
      </span>
    </h2>
  );
}
