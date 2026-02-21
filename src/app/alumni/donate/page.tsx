import { PageHeader } from "@/components/shared/PageHeader";
import { DonationForm } from "@/components/alumni/DonationForm";

export default function AlumniDonatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Donate"
        description="Support Fisk University and its students."
      />
      <DonationForm />
    </div>
  );
}
