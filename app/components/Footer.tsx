// app/components/Footer.tsx
"use client";

import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Always stacked, no visible gap between rows */}
      <div className="w-full flex flex-col">
        {/* Links wrapper */}
        <nav className="w-full">
          <ul className="flex w-full rounded-[16px] border border-custom-gray-200 dark:border-app-border-dark overflow-hidden ">
            {[
              { label: "GitHub", href: "https://github.com/aosunlana" },
              { label: "Email", href: "mailto:osunlanaabdulsamad@gmail.com" },
            ].map(({ label, href }, i, arr) => (
              <li key={label} className="flex-1">
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className={[
                    "flex h-12 items-center justify-center px-4",
                    "text-base leading-6 tracking-[0.5px] text-custom-gray-900 dark:text-app-text-dark",
                    i < arr.length - 1
                      ? "border-r border-custom-gray-200 dark:border-app-border-dark"
                      : "",
                  ].join(" ")}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme switch fills the bar: three labelled segments. */}
        <div className="w-full rounded-[16px] border border-custom-gray-200 dark:border-app-border-dark h-12 flex items-stretch -mt-[0.5px]">
          <ThemeToggle />
        </div>
        <p className="pt-4 text-center text-xs leading-5 text-custom-gray-500 dark:text-app-link-text-default">
          Design and code by Emmanuel A. Priestley, used with permission.
        </p>
      </div>
    </footer>
  );
}
