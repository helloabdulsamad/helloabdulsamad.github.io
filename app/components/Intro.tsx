"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Opening sequence on the home page, once per browser session.
// 0.0–1.0 s  the name rises letter by letter out of its masks
// 1.0–1.6 s  role and city slide in under it
// 1.7–2.3 s  "systems that don't fall apart" types in, word by word
// 2.4–3.4 s  the whole sheet lifts away and the page settles in underneath
// Any wheel, key, click or touch skips to the end. ?intro replays it.
// A tiny inline script in the layout hides it before first paint when it
// shouldn't play (already seen, reduced motion, or another page).
const FIRST = "Abdulsamad";
const LAST = "Osunlana";

export default function Intro() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || document.documentElement.classList.contains("no-intro")) return;

    document.documentElement.classList.add("intro-running");
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      onComplete: finish,
    });

    tl.from(q(".intro-ch"), { yPercent: 115, duration: 1.0, stagger: 0.035 }, 0.1)
      .from(q(".intro-meta > *"), { yPercent: 120, duration: 0.7, stagger: 0.08 }, 1.0)
      .from(q(".intro-word"), { opacity: 0, y: 8, duration: 0.25, stagger: 0.12, ease: "power2.out" }, 1.7)
      .to(q(".intro-name"), { yPercent: -18, duration: 1.0, ease: "expo.inOut" }, 2.4)
      .to(el, { yPercent: -100, duration: 1.0, ease: "expo.inOut" }, 2.4)
      .from(".page-enter", { y: 40, opacity: 0, duration: 0.9, stagger: 0.08 }, 2.9);

    function finish() {
      document.documentElement.classList.remove("intro-running");
      document.documentElement.classList.add("no-intro");
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
      off();
    }
    const skip = (e: Event) => {
      if (e.type === "wheel") e.preventDefault();
      tl.progress(1);
    };
    const opts = { passive: false } as AddEventListenerOptions;
    const evs = ["wheel", "keydown", "pointerdown", "touchstart"];
    evs.forEach((t) => window.addEventListener(t, skip, opts));
    const off = () => evs.forEach((t) => window.removeEventListener(t, skip, opts));

    return () => {
      off();
      tl.kill();
    };
  }, []);

  const letters = (word: string) =>
    word.split("").map((c, i) => (
      <span key={i} className="intro-mask">
        <span className="intro-ch">{c}</span>
      </span>
    ));

  return (
    <div ref={root} className="intro" aria-hidden="true">
      <div className="intro-name">
        <div className="intro-line">{letters(FIRST)}</div>
        <div className="intro-line">{letters(LAST)}</div>
      </div>
      <div className="intro-bottom">
        <div className="intro-meta intro-mask-row">
          <span>Senior Software Engineer</span>
          <span>Lagos, Nigeria</span>
        </div>
        <p className="intro-tag">
          {"I build systems that don't fall apart.".split(" ").map((w, i) => (
            <span key={i} className="intro-word">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
