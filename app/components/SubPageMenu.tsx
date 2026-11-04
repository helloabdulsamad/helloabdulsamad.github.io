"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  HandWaving,
  Briefcase,
  LinkedinLogo,
  Smiley,
  GithubLogo,
  EnvelopeSimple,
  ArrowUpRight,
  type IconProps,
} from "@phosphor-icons/react";

export type NavItem = {
  label: string;
  href: string;
  Icon: ComponentType<IconProps>;
  locked?: boolean;
};

export const NAV: NavItem[] = [
  { label: "Hello", href: "/", Icon: HandWaving },
  { label: "Work", href: "/#work", Icon: Briefcase },
  { label: "About Me", href: "/about", Icon: Smiley },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/helloabdulsamad/", Icon: LinkedinLogo },
  { label: "GitHub", href: "https://github.com/helloabdulsamad", Icon: GithubLogo },
  { label: "Email", href: "mailto:osunlanaabdulsamad@gmail.com", Icon: EnvelopeSimple },
];

export default function SubPageMenu() {
  const renderItem = (item: NavItem, borders: string) => {
    // Only /about is a Next.js page; the home page is a plain HTML page, so it needs a full load.
    const Tag = item.href === "/about" ? Link : "a";
    return (
    <Tag
      key={item.label}
      href={item.href}
      {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group relative flex h-12 items-center gap-2 px-4 text-sm tracking-[0.5px] text-custom-gray-900 dark:text-app-text-dark ${borders} border-custom-gray-200 dark:border-app-border-dark`}
    >
      <item.Icon
        size={20}
        aria-hidden="true"
        className="shrink-0 text-custom-gray-700 dark:text-app-text-dark"
      />
      <span>{item.label}</span>

      <ArrowUpRight
        size={16}
        aria-hidden="true"
        className="absolute right-3 top-1/2 -translate-y-1/2 translate-x-[3px] text-custom-gray-700 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-app-link-text-hover dark:text-app-text-dark dark:group-hover:text-app-link-text-hover"
      />
    </Tag>
    );
  };

  return (
    <nav className="rounded-[16px] border border-custom-gray-200 dark:border-app-border-dark overflow-hidden">
      {/* 2 columns x 3 rows, same on every breakpoint */}
      <div className="grid grid-cols-2">
        {NAV.map((item, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const borders = (col === 0 ? "border-r " : "") + (row > 0 ? "border-t " : "");
          return renderItem(item, borders);
        })}
      </div>
    </nav>
  );
}
