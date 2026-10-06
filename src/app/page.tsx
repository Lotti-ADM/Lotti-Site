import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { StructuredData } from "@/components/site/StructuredData";
import dynamic from "next/dynamic";

/* Below-the-fold components loaded via dynamic import for code splitting.
   This keeps the initial JS bundle small — only Header + Hero ship immediately.
   Each section loads its own JS chunk on demand when the browser is idle. */

const AgentExample = dynamic(
  () =>
    import("@/components/site/AgentExample").then((m) => ({
      default: m.AgentExample,
    })),
  { ssr: true },
);

const ProblemSolution = dynamic(
  () =>
    import("@/components/site/ProblemSolution").then((m) => ({
      default: m.ProblemSolution,
    })),
  { ssr: true },
);

const HowItWorks = dynamic(
  () =>
    import("@/components/site/HowItWorks").then((m) => ({
      default: m.HowItWorks,
    })),
  { ssr: true },
);

const Features = dynamic(
  () =>
    import("@/components/site/Features").then((m) => ({
      default: m.Features,
    })),
  { ssr: true },
);

const Differentiators = dynamic(
  () =>
    import("@/components/site/Differentiators").then((m) => ({
      default: m.Differentiators,
    })),
  { ssr: true },
);

const Trust = dynamic(
  () =>
    import("@/components/site/Trust").then((m) => ({
      default: m.Trust,
    })),
  { ssr: true },
);

const Plans = dynamic(
  () =>
    import("@/components/site/Plans").then((m) => ({
      default: m.Plans,
    })),
  { ssr: true },
);

const PricingFAQ = dynamic(
  () =>
    import("@/components/site/pricing/PricingFAQ").then((m) => ({
      default: m.PricingFAQ,
    })),
  { ssr: true },
);

const FinalCta = dynamic(
  () =>
    import("@/components/site/FinalCta").then((m) => ({
      default: m.FinalCta,
    })),
  { ssr: true },
);

const Footer = dynamic(
  () =>
    import("@/components/site/Footer").then((m) => ({
      default: m.Footer,
    })),
  { ssr: true },
);

export default function Page() {
  return (
    <>
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <AgentExample />
        <ProblemSolution />
        <HowItWorks />
        <Features />
        <Differentiators />
        <Trust />
        <Plans />
        <PricingFAQ />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
