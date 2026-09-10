import { Header } from "@/components/site/Header";
import { AgentExample } from "@/components/site/AgentExample";
import { PricingFAQ } from "@/components/site/pricing/PricingFAQ";
import { Hero } from "@/components/site/Hero";
import { ProblemSolution } from "@/components/site/ProblemSolution";
import { Features } from "@/components/site/Features";
import { Differentiators } from "@/components/site/Differentiators";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Trust } from "@/components/site/Trust";
import { Plans } from "@/components/site/Plans";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";
import { StructuredData } from "@/components/site/StructuredData";

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
