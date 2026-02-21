import { LandingNav } from "@/components/organisms/LandingNav";
import { Hero } from "@/components/organisms/Hero";
import { LandingContent } from "@/components/organisms/LandingContent";
import { ColorfulBentoGrid } from "@/components/ui/colorful-bento-grid";
import { FeaturesSection } from "@/components/organisms/FeaturesSection";
import { FooterSection } from "@/components/organisms/FooterSection";

/** Dayos-style landing: full-viewport hero, content sections, bento resources, rounded features, dark footer. */
export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LandingNav />
      <Hero />
      <LandingContent />
      <div className="rounded-section px-4 md:px-6">
        <ColorfulBentoGrid />
      </div>
      <div className="rounded-section pt-12 sm:pt-16 md:pt-20 pb-4">
        <FeaturesSection />
      </div>
      <FooterSection />
    </div>
  );
}
