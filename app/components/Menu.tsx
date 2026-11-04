"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "next-view-transitions";
import gsap from "gsap";
import { site } from "@/lib/site";
import ThemeQuick from "./ThemeQuick";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Email", href: `mailto:${site.email}` },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/helloabdulsamad/" },
  { label: "GitHub", href: "https://github.com/helloabdulsamad" },
];

// A real menu on every page and every width: a full-screen sheet whose links
// rise in one after another. Escape closes it and returns focus to the button.
export default function Menu() {
  const [open, setOpen] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = sheet.current;
    if (!el) return;
    document.documentElement.style.overflow = open ? "hidden" : "";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      gsap.set(el, { display: "flex" });
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduce ? 0 : 0.7, ease: "expo.inOut" });
      gsap.fromTo(el.querySelectorAll(".menu-link-inner"), { yPercent: 110 }, { yPercent: 0, duration: reduce ? 0 : 0.8, ease: "expo.out", stagger: 0.05, delay: reduce ? 0 : 0.3 });
      (el.querySelector("a") as HTMLElement | null)?.focus();
    } else {
      gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: reduce ? 0 : 0.5,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key === "Tab" && open) {
        const items = [...el.querySelectorAll<HTMLElement>("a,button")];
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="top-actions">
      <ThemeQuick />
      <button
        ref={button}
        type="button"
        className="menu-button"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="menu-button-label">{open ? "Close" : "Menu"}</span>
        <span className={`menu-burger ${open ? "is-open" : ""}`} aria-hidden="true">
          <span />
          <span />
        </span>
      </button>
      </div>
      <div ref={sheet} id="site-menu" className="menu-sheet" role="dialog" aria-modal="true" aria-label="Menu">
        <nav>
          <ul>
            {LINKS.map((l) => (
              <li key={l.label} className="menu-link">
                {l.href.startsWith("/") && l.href !== "/" && l.href !== "/#work" ? (
                  <Link href={l.href} onClick={() => setOpen(false)} className="menu-link-a">
                    <span className="menu-link-inner font-display">
                      {l.label}
                    </span>
                  </Link>
                ) : (
                  <a href={l.href} className="menu-link-a" target={l.href.startsWith("http") ? "_blank" : undefined} rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                    <span className="menu-link-inner font-display">
                      {l.label}
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <p className="menu-foot">Lagos, Nigeria · {site.email}</p>
      </div>
    </>
  );
}
