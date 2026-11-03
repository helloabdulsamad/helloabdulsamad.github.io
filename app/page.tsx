import Header from "./components/header/Header";
import SubPageMenu from "./components/SubPageMenu";
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import RollingWord from "./components/RollingWord";
import WorkList from "./components/WorkList";
import Reveal from "./about/Reveal";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col text-custom-gray-900 dark:text-app-text-dark">
      <Intro />

      <header className="w-full page-enter">
        <div className="mx-auto w-full max-w-[600px] px-4 pt-[max(env(safe-area-inset-top),16px)] md:pt-4">
          <Header />
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-[600px] px-4">
          <section className="w-full page-enter">
            <RollingWord />

            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              I&rsquo;m a{" "}
              <span className="text-custom-gray-500 dark:text-app-link-text-default font-medium">
                Senior Software Engineer
              </span>{" "}
              in Lagos. I build the backends people trust with their money and their business: payments and
              ledgers, platforms that give every customer their own space, and apps that keep working when the
              network drops. Mostly in C# and .NET, TypeScript and PostgreSQL.
            </p>
            <p className="text-base leading-6 tracking-[0.5%] pb-4">
              Software Engineer II at Aspen Publishing. Founder of Upsert Labs. Contributor to The Standard
              open source since March 2024.
            </p>
          </section>

          <section id="work" className="pt-10 scroll-mt-8 page-enter">
            <p className="section-kicker">Selected work</p>
            <WorkList />
          </section>

          <Reveal className="pt-14">
            <p className="section-kicker">Selected work at Aspen Publishing</p>
            <p className="text-base leading-6 pb-2">
              Foundational services for internal teams and third party integrations on Azure and .NET, code
              review across teams, and the test coverage that lets features ship with confidence.
            </p>
            <p className="text-sm text-custom-gray-500 dark:text-app-link-text-default">
              Code is private · happy to walk through it in an interview
            </p>
          </Reveal>

          <Reveal className="pt-14">
            <p className="section-kicker">Let&rsquo;s talk</p>
            <p className="font-display text-[22px] leading-[1.3] font-semibold">
              Building something where failure costs money?{" "}
              <a href="mailto:osunlanaabdulsamad@gmail.com" className="link-underline">
                Write to me
              </a>
              .
            </p>
          </Reveal>
        </div>
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
