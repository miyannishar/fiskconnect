import { LandingNav } from "@/components/organisms/LandingNav";
import { Hero } from "@/components/organisms/Hero";
import { FeaturesSection } from "@/components/organisms/FeaturesSection";
import { FooterSection } from "@/components/organisms/FooterSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <Hero />
      <FeaturesSection />
      <FooterSection />
    </div>
  );
}
