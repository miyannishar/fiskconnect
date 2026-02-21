import { DonationForm } from "@/components/alumni/DonationForm";

export default function AlumniDonatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Donate</h1>
        <p className="text-muted-foreground mt-1">Support Fisk University and its students.</p>
      </div>
      <DonationForm />
    </div>
  );
}
