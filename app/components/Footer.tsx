// app/components/Footer.tsx
"use client";


export default function Footer() {
  return (
    <footer className="w-full">
      {/* Always stacked, no visible gap between rows */}
      <div className="w-full flex flex-col">
        <p className="pt-4 text-center text-xs leading-5 text-custom-gray-500 dark:text-app-link-text-default">
          © 2026 Abdulsamad Osunlana
        </p>
      </div>
    </footer>
  );
}
