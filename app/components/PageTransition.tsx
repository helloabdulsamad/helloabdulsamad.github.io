"use client";

// Passthrough. Page-level movement/fades caused a flash and shifted the chrome
// (breadcrumb, Previous and Next bar) on every navigation. Content that should
// animate on route change does so locally instead, for example the craft stage.
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
