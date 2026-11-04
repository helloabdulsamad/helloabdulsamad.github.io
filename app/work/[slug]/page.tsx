import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { projects, findProject } from "@/lib/projects";
import { readCaseStudy } from "@/lib/caseStudy";
import SplitTitle from "@/components/SplitTitle";
import ReadProgress from "@/components/ReadProgress";
import Footer from "@/components/Footer";
import Reveal from "../../about/Reveal";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = findProject(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.line,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.name, description: p.line, url: `/work/${p.slug}` },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = findProject(slug);
  if (!p) notFound();
  const cs = readCaseStudy(p.file);
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];

  return (
    <div className="min-h-dvh text-custom-gray-900 dark:text-app-text-dark">
      <ReadProgress color={p.ink === "#fafafa" || p.ink.startsWith("#e") || p.ink.startsWith("#f") || p.ink.startsWith("#d") ? "#171717" : p.ink} />

      <section className="case-cover" style={{ background: p.ink, color: p.paper }}>
        <div className="mx-auto w-full max-w-[880px] px-4 pt-24 pb-14 md:pt-28">
          <p className="case-kicker">
            {p.role} · {p.status}
          </p>
          <SplitTitle text={p.name} className="case-title font-display" />
          <p className="case-hook font-display">{p.hook}</p>
          {p.link && (
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="case-visit">
              Visit {p.link.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          )}
        </div>
      </section>

      <main className="mx-auto w-full max-w-[680px] px-4 pt-12 pb-10">
        <Reveal>
          <dl className="case-meta">
            {cs.meta.map((m) => (
              <div key={m.label} className="case-meta-row">
                <dt>{m.label}</dt>
                <dd dangerouslySetInnerHTML={{ __html: m.html }} />
              </div>
            ))}
          </dl>
        </Reveal>

        {cs.sections.map((s) => (
          <Reveal key={s.heading} className="pt-12">
            <section>
              <h2 className="case-h2 font-display">{s.heading}</h2>
              <div className="case-prose" dangerouslySetInnerHTML={{ __html: s.html }} />
            </section>
          </Reveal>
        ))}
      </main>

      <Link href={`/work/${next.slug}`} className="case-next" style={{ background: next.ink, color: next.paper }}>
        <span className="mx-auto block w-full max-w-[880px] px-4 py-16">
          <span className="case-kicker">Next project</span>
          <span className="case-next-name font-display">{next.name}</span>
          <span className="case-next-hook">{next.hook}</span>
        </span>
      </Link>

      <div className="mx-auto w-full max-w-[600px] px-4 py-6">
        <Footer />
      </div>
    </div>
  );
}
