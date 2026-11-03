import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";

// Display face for the hero and headings. Body stays on SF Pro.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
import PageTransition from "./components/PageTransition";
import Menu from "./components/Menu";
import { ThemeProvider } from "./components/ThemeProvider";
import { site } from "./lib/site";


export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  // Stop browsers from auto-linking/underlining detected emails, phone numbers,
  // and addresses (e.g. the sample emails in the Playground invite craft).
  formatDetection: { email: false, telephone: false, address: false },
  applicationName: site.shortName,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: site.twitter
    ? {
        card: "summary_large_image",
        title: site.title,
        description: site.description,
        creator: site.twitter,
        site: site.twitter,
      }
    : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#161616" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.shortName,
    jobTitle: "Senior Software Engineer",
    url: site.url,
    email: `mailto:${site.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    sameAs: site.sameAs,
    knowsAbout: [
      "Software Engineering",
      "Payments Infrastructure",
      "Clean Architecture",
      "React",
      "Next.js",
      "TypeScript",
      "C#/.NET",
    ],
    description: site.description,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement,u=new URL(location.href),seen=sessionStorage.getItem("intro-seen"),rm=matchMedia("(prefers-reduced-motion: reduce)").matches;if(u.pathname!=="/"||rm||(seen&&!u.searchParams.has("intro")))d.classList.add("no-intro");var th=localStorage.getItem("theme");if(th==="dark"||((!th||th==="system")&&matchMedia("(prefers-color-scheme: dark)").matches))d.classList.add("dark")}catch(e){}`,
          }}
        />
        <noscript>
          <style>{`.intro{display:none}`}</style>
        </noscript>
      </head>
      {/* Next injects <head> from metadata/viewport */}
      <body
        className={`${bricolage.variable} antialiased bg-white text-custom-gray-900 dark:bg-app-bg-dark dark:text-app-text-dark`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ViewTransitions>
          <ThemeProvider>
            <Menu />
            <PageTransition>{children}</PageTransition>
          </ThemeProvider>
        </ViewTransitions>
      </body>
    </html>
  );
}
