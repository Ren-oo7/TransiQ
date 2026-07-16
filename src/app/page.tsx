import { FeatureStatsSection } from "@/components/home/feature-stats-section";
import { FinalCtaSection } from "@/components/home/final-cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { LaunchSection } from "@/components/home/launch-section";
import { PlatformSection } from "@/components/home/platform-section";
import { TransitionsSection } from "@/components/home/transitions-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeatureStatsSection />
      <PlatformSection />
      <LaunchSection />
      <TransitionsSection />
      <FinalCtaSection />
    </main>
  );
}
