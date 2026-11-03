"use client";

import { Fragment } from "react";
import { Gear, Sun, MoonStars } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const OPTIONS = [
  { value: "system", Icon: Gear, name: "System" },
  { value: "light", Icon: Sun, name: "Light" },
  { value: "dark", Icon: MoonStars, name: "Dark" },
] as const;

// A labelled theme switch that fills its bar: three equal segments with a
// gliding gray pill marking the active one. Meant to sit inside a fixed-height
// bar (e.g. the footer) so the dividers span the whole height.
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label="Toggle color theme" className="flex h-full w-full items-stretch">
      {OPTIONS.map((option, i) => {
        const isActive = option.value === theme;
        return (
          <Fragment key={option.value}>
            {i > 0 && (
              <span aria-hidden="true" className="w-px self-stretch bg-custom-gray-200 dark:bg-app-border-dark" />
            )}
            <button
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={`${option.name} theme`}
              onClick={() => setTheme(option.value)}
              className="relative flex h-full flex-1 items-center justify-center gap-2 px-2"
            >
              {isActive && (
                <motion.span
                  layoutId="theme-active"
                  className={`absolute inset-0 bg-custom-gray-100 dark:bg-white/[0.08] ${
                    i === 0 ? "rounded-l-[15px]" : i === OPTIONS.length - 1 ? "rounded-r-[15px]" : ""
                  }`}
                  transition={{ type: "spring", stiffness: 340, damping: 30 }}
                />
              )}
              <option.Icon
                size={16}
                aria-hidden="true"
                weight={isActive ? "fill" : "regular"}
                className={`relative z-10 transition-colors ${
                  isActive ? "text-custom-gray-900 dark:text-white" : "text-custom-gray-500 dark:text-custom-gray-400"
                }`}
              />
              <span
                className={`relative z-10 text-sm tracking-[0.3px] transition-colors ${
                  isActive
                    ? "font-medium text-custom-gray-900 dark:text-white"
                    : "text-custom-gray-500 dark:text-custom-gray-400"
                }`}
              >
                {option.name}
              </span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
