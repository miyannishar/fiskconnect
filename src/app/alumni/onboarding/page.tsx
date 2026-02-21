import { PageHeader } from "@/components/shared/PageHeader";
import { DataCard } from "@/components/shared/DataCard";
import { OnboardingSteps } from "@/components/alumni/OnboardingSteps";

export default function AlumniOnboardingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Complete your profile"
        description="Set up your alumni profile so students can find and connect with you."
      />
      <DataCard title="Onboarding" description="Follow the steps below.">
        <OnboardingSteps />
      </DataCard>
    </div>
  );
}
