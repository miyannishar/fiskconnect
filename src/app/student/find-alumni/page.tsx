import { PageHeader } from "@/components/shared/PageHeader";
import { FindAlumniClient } from "./FindAlumniClient";

export default function FindAlumniPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Find Alumni"
        description="Ask for help—we’ll match you with alumni you can reach out to on LinkedIn."
      />
      <FindAlumniClient />
    </div>
  );
}
