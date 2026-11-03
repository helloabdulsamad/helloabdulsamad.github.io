// app/components/header/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex items-center gap-4 pb-8 md:gap-5">
      <Link
        href="/"
        aria-label="Home"
        className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-custom-gray-100 dark:bg-app-card-dark"
      >
        <Image
          src="/headshot.png"
          alt="Abdulsamad Osunlana in a black T-shirt"
          width={56}
          height={56}
          className="h-14 w-14 object-cover"
          priority
        />
      </Link>
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
