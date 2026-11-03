import type { Metadata } from "next";

const description =
  "Software engineer and founder building event-commerce and storefront platforms. Currently building Upsert Labs Limited (EventHome, Upsert, Upsert Scout).";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About", description, url: "/about" },
  twitter: { title: "About", description },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
