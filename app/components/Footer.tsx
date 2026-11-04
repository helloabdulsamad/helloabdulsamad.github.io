// app/components/Footer.tsx
"use client";

import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Always stacked, no visible gap between rows */}
      <div className="w-full flex flex-col">
        {/* Theme switch fills the bar: three labelled segments. */}
        <div className="w-full rounded-[16px] border border-custom-gray-200 dark:border-app-border-dark h-12 flex items-stretch">
          <ThemeToggle />
        </div>
        <p className="pt-4 text-center text-xs leading-5 text-custom-gray-500 dark:text-app-link-text-default">
          © 2026 Abdulsamad Osunlana
        </p>
      </div>
    </footer>
  );
}
