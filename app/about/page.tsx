/* eslint-disable @next/next/no-html-link-for-pages -- the home page is a plain HTML page, so it needs a full load */
import Image from "next/image";
import Header from "../components/header/Header";
import Footer from "../components/Footer";
import SubPageMenu from "../components/SubPageMenu";
import SplitTitle from "../components/SplitTitle";
import Reveal from "./Reveal";

const experience = [
  { company: "Aspen Publishing", role: "Software Engineer II", period: "May 2025 to present", body: "Foundational services for internal teams and third party integrations on Azure and .NET. I review code across teams for standards, security and performance, lead design discussions, and enforce unit, acceptance and integration test coverage." },
  { company: "Aspen Publishing", role: "Software Engineer I", period: "Jun 2024 to May 2025", body: "Azure and ASP.NET Web API services, built to The Standard." },
  { company: "Upsert Labs", role: "Founder", period: "Jun 2026 to present", body: "My own company. EventHome, Upsert, Upsert Scout and client builds such as Inkz ’N’ Paint." },
  { company: "Open source, The Standard", role: "Contributor", period: "Mar 2024 to present", body: "EventHighway, the RESTFulSense client rewrite, ADotNet and The Standard book, reviewed in public by the maintainers." },
  { company: "AXA Mansard", role: "Software Engineer", period: "Jan 2023 to Jul 2024", body: ".NET services and acceptance testing." },
  { company: "AIpidata", role: "Flutter Developer", period: "Nov 2022 to Apr 2023", body: "Designed and helped build PI-Pet, a pet tracking app for health vitals and location." },
  { company: "BUNKR Essentials", role: "Software Engineer", period: "May 2021 to Sep 2022", body: "" },
  { company: "SolversBay", role: "Web Developer", period: "Feb 2019 to Jun 2020", body: "" },
];

export default function About() {
  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark">
      <header className="w-full">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-[max(env(safe-area-inset-top),16px)] md:pt-4">
          <Header />
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-[600px] px-4">
        <SplitTitle text="Systems that don't fall apart." className="font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.01em] sm:text-[44px] pb-6" />

        <Reveal>
          <div className="about-photo">
            <Image src="/headshot-600.webp" alt="Abdulsamad Osunlana in a black T-shirt, studio portrait" priority width={600} height={600} className="w-full h-auto" />
          </div>
        </Reveal>

        <Reveal className="pt-8">
          <p className="text-base leading-7 pb-4">
            I&rsquo;m Abdulsamad, a Senior Software Engineer in Lagos. I studied Applied Geophysics (BSc, University of Ilorin, and MSc, University of Ibadan), and I&rsquo;ve built software since 2019.
          </p>
          <p className="text-base leading-7 pb-4">
            The work I like best has real money and real people behind it. A buyer who must never be charged twice. A shop that must keep selling when the network drops. A merchant whose store must stay up when another one falls over. I design for those failures first, and I prove the guarantees with tests.
          </p>
        </Reveal>

        <Reveal className="pt-10">
          <p className="section-kicker">Experience</p>
          <ol className="exp-list">
            {experience.map((e) => (
              <li key={e.company + e.role} className="exp-row">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium">{e.company}</span>
                  <span className="text-sm text-custom-gray-500 dark:text-app-link-text-default shrink-0">{e.period}</span>
                </div>
                <p className="text-sm text-custom-gray-500 dark:text-app-link-text-default">{e.role}</p>
                {e.body && <p className="text-sm leading-6 pt-1">{e.body}</p>}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="pt-10">
          <p className="section-kicker">Stack</p>
          <p className="text-base leading-7">
            C# and .NET, ASP.NET Core, EF Core, PostgreSQL, Azure. TypeScript, Next.js and React. Paystack, webhooks and ledgers. Docker and Coolify. Flutter for mobile. Tested with xUnit, Vitest and Playwright.
          </p>
        </Reveal>

        <Reveal className="pt-10">
          <p className="section-kicker">Contact</p>
          <p className="text-base leading-7">
            <a className="link-underline" href="mailto:osunlanaabdulsamad@gmail.com">osunlanaabdulsamad@gmail.com</a> ·{" "}
            <a className="link-underline" href="https://www.linkedin.com/in/aosunlana/" target="_blank" rel="noopener noreferrer">LinkedIn</a> ·{" "}
            <a className="link-underline" href="https://github.com/helloabdulsamad" target="_blank" rel="noopener noreferrer">GitHub</a> ·{" "}
            <a className="link-underline" href="/#work">See the work</a>
          </p>
        </Reveal>
      </main>

      <footer className="w-full pt-[120px] md:pt-20">
        <div className="mx-auto w-full max-w-[600px] px-4 pb-[max(env(safe-area-inset-bottom),16px)] md:pb-4">
          <div className="mb-[16px]">
            <SubPageMenu />
          </div>
          <Footer />
        </div>
      </footer>
    </div>
  );
}
