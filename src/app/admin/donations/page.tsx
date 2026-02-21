import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataCard } from "@/components/shared/DataCard";

export default async function AdminDonationsPage() {
  const supabase = await createClient();
  const { data: donations } = await supabase
    .from("donations")
    .select(`
      *,
      profiles!donor_id ( id, full_name, email )
    `)
    .order("created_at", { ascending: false });

  const total = (donations ?? []).reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donations"
        description={`All donations. Total: $${total.toFixed(2)}`}
      />
      <DataCard
        title="Donation history"
        description="Recent donations from alumni and supporters."
      >
        {(!donations || donations.length === 0) ? (
          <p className="py-8 text-center text-muted-foreground">No donations yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="table-crm w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Anonymous</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d: { id: string; amount: number; purpose: string; is_anonymous: boolean; created_at: string; profiles: { full_name: string | null; email: string } | null }) => (
                  <tr key={d.id}>
                    <td className="text-muted-foreground">{formatDate(d.created_at)}</td>
                    <td>{d.is_anonymous ? "Anonymous" : (d.profiles?.full_name ?? d.profiles?.email ?? "—")}</td>
                    <td className="font-medium">${Number(d.amount).toFixed(2)}</td>
                    <td className="capitalize">{d.purpose.replace(/-/g, " ")}</td>
                    <td>{d.is_anonymous ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
    </div>
  );
}
