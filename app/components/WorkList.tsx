"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "next-view-transitions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

// The work index. Rows rise into place as you scroll; on a mouse, a card
// follows the cursor showing the project's one line that matters.
export default function WorkList() {
  const list = useRef<HTMLOListElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = list.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".work-row-inner", {
        yPercent: 100,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const c = card.current;
    if (!c || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const x = gsap.quickTo(c, "x", { duration: 0.5, ease: "power3" });
    const y = gsap.quickTo(c, "y", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => {
      x(e.clientX + 24);
      y(e.clientY - 90);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const c = card.current;
    if (!c) return;
    gsap.to(c, {
      scale: active === null ? 0.6 : 1,
      opacity: active === null ? 0 : 1,
      duration: 0.35,
      ease: "power3.out",
    });
  }, [active]);

  const p = active === null ? null : projects[active];

  return (
    <>
      <ol ref={list} className="work-list" onPointerLeave={() => setActive(null)}>
        {projects.map((proj, i) => (
          <li key={proj.slug} className={`work-row ${active !== null && active !== i ? "is-dim" : ""}`}>
            <Link
              href={`/work/${proj.slug}`}
              className="work-row-link"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <span className="work-row-inner">
                <span className="work-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="work-main">
                  <span className="work-name font-display">{proj.name}</span>
                  <span className="work-line">{proj.line}</span>
                </span>
                <span className="work-status">{proj.status}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div
        ref={card}
        className="work-card"
        aria-hidden="true"
        style={{ background: p?.ink ?? "#171717", color: p?.paper ?? "#fafafa" }}
      >
        <span className="work-card-kicker">{p?.name}</span>
        <span className="work-card-hook font-display">{p?.hook}</span>
        <span className="work-card-meta">
          {p?.role} · {p?.year}
        </span>
      </div>
    </>
  );
}
