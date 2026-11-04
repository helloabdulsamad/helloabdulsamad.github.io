"use client";

import { Gear, Sun, MoonStars } from "@phosphor-icons/react";
import { useTheme } from "./ThemeProvider";

const OPTIONS = [
  { value: "system", Icon: Gear, name: "System" },
  { value: "light", Icon: Sun, name: "Light" },
  { value: "dark", Icon: MoonStars, name: "Dark" },
] as const;

// Compact theme switch that sits beside the menu button at the top of every page.
export default function ThemeQuick() {
  const { theme, setTheme } = useTheme();
  return (
    <div role="radiogroup" aria-label="Colour theme" className="theme-quick">
      {OPTIONS.map(({ value, Icon, name }) => {
        const active = value === theme;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${name} theme`}
            title={name}
            onClick={() => setTheme(value)}
            className="theme-quick-btn"
          >
            <Icon size={15} weight={active ? "fill" : "regular"} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
