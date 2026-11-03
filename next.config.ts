import type { NextConfig } from "next";

// Set by the GitHub Pages workflow only. The repo is named aosunlana.github.io
// (GitHub's special "user site" name), so Pages serves it from the domain
// root — no basePath needed, just a static export (no Node server on GH
// Pages). Vercel/Render builds leave this unset and get the normal server
// build.
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // Defaults to ".next". Set NEXT_BUILD_DIR to run a verification build without
  // clobbering the dev server's ".next". No effect on normal dev/deploy.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  ...(isGithubPages ? { output: "export" } : {}),
  images: {
    // Local images in /public need no config. For remotely hosted playground
    // mockups (e.g. Vercel Blob), allow the host here. Add more as needed.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    // GH Pages has no image-optimization server; a static export can't use one.
    ...(isGithubPages ? { unoptimized: true } : {}),
  },
  // Canonical host (www vs apex) is handled at the edge by Vercel's domain
  // settings, NOT here. An app-level host redirect fights Vercel's own
  // domain-level redirect and causes an infinite loop (ERR_TOO_MANY_REDIRECTS).
};

export default nextConfig;
