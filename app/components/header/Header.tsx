/* eslint-disable @next/next/no-html-link-for-pages -- the home page is a plain HTML page, so it needs a full load */
// app/components/header/Header.tsx
"use client";

import Image from "next/image";

export default function Header() {
  return (
    <div className="flex items-center gap-4 pb-8 pt-12 md:pt-0 md:gap-5">
      <a
        href="/"
        aria-label="Home"
        className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-custom-gray-100 dark:bg-app-card-dark"
      >
        <Image
          src="/headshot-112.webp"
          alt="Abdulsamad Osunlana in a black T-shirt"
          width={56}
          height={56}
          className="h-14 w-14 object-cover"
          priority
        />
      </a>
      <div>
        <h1 className="font-display text-[16px] font-semibold leading-8 tracking-[0.5px] text-custom-gray-900 dark:text-app-text-dark">
          Abdulsamad Osunlana
        </h1>
        <p className="text-base leading-6 tracking-[0.5px] text-custom-gray-500 dark:text-app-text-dark">
          Senior Software Engineer <span className="text-custom-gray-500">/</span> Founder, Upsert Labs
        </p>
      </div>
    </div>
  );
}
