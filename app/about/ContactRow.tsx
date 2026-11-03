"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Sparkle, type Icon } from "@phosphor-icons/react";

// Fixed offsets so the burst looks lively but stays deterministic.
const SPARKLES = [
  { dx: "-10px", s: 0.9, rot: "80deg", size: 9, delay: 0, color: "text-app-link-text-hover" },
  { dx: "8px", s: 1.1, rot: "-70deg", size: 11, delay: 40, color: "text-app-link-text-hover" },
  { dx: "-4px", s: 0.7, rot: "120deg", size: 8, delay: 90, color: "text-custom-gray-400" },
  { dx: "13px", s: 0.8, rot: "-40deg", size: 7, delay: 120, color: "text-app-link-text-hover" },
  { dx: "-14px", s: 0.6, rot: "60deg", size: 6, delay: 160, color: "text-custom-gray-400" },
];

export default function ContactRow({
  label,
  value,
  href,
  icon: IconComp,
}: {
  label: string;
  value: string;
  href: string;
  icon: Icon;
}) {
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);
  const external = href.startsWith("http");
  // Copy the actual destination: the full URL for links, the bare address for email.
  const copyText = href.startsWith("mailto:") ? href.slice("mailto:".length) : href;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setBurst((b) => b + 1);
    } catch {
      // Clipboard blocked. The link still works.
    }
  }

  return (
    <div className="group -mx-3 flex items-baseline justify-between gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-custom-gray-100/70 dark:hover:bg-app-card-dark/40">
      <span className="flex items-center gap-2.5 text-custom-gray-500 dark:text-custom-gray-400">
        <IconComp
          size={17}
          aria-hidden="true"
          className="shrink-0 text-custom-gray-400 dark:text-custom-gray-500"
        />
        {label}
      </span>
      <span className="flex items-center gap-2">
        <span className="relative inline-flex">
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
            className="text-custom-gray-400 opacity-0 transition-opacity duration-150 hover:text-custom-gray-700 focus-visible:opacity-100 group-hover:opacity-100 dark:hover:text-custom-gray-200"
          >
            {copied ? (
              <Check size={15} aria-hidden="true" className="text-app-link-text-hover" />
            ) : (
              <Copy size={15} aria-hidden="true" />
            )}
          </button>

          {/* Sparkle burst, remounted each copy via the key so it replays. */}
          {burst > 0 && (
            <span
              key={burst}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              {SPARKLES.map((sp, i) => (
                <Sparkle
                  key={i}
                  weight="fill"
                  size={sp.size}
                  className={`sparkle absolute ${sp.color}`}
                  style={
                    {
                      "--dx": sp.dx,
                      "--s": sp.s,
                      "--rot": sp.rot,
                      "--delay": `${sp.delay}ms`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </span>
          )}
        </span>

        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-custom-gray-900 transition-colors group-hover:text-app-link-text-hover dark:text-app-text-dark"
        >
          {value}
        </a>
      </span>
    </div>
  );
}
