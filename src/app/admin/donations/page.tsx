import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Donations</h1>
        <p className="text-muted-foreground mt-1">All donations. Total: ${total.toFixed(2)}</p>
      </div>
      <Card className="bg-card border-white/10">
        <CardHeader>
          <CardTitle>Donation history</CardTitle>
        </CardHeader>
        <CardContent>
          {(!donations || donations.length === 0) ? (
            <p className="text-muted-foreground">No donations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Donor</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Purpose</th>
                    <th className="pb-2 font-medium">Anonymous</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d: { id: string; amount: number; purpose: string; is_anonymous: boolean; created_at: string; profiles: { full_name: string | null; email: string } | null }) => (
                    <tr key={d.id} className="border-b border-white/5">
                      <td className="py-2 text-muted-foreground">
                        {formatDate(d.created_at)}
                      </td>
                      <td className="py-2">
                        {d.is_anonymous ? "Anonymous" : (d.profiles?.full_name ?? d.profiles?.email ?? "—")}
                      </td>
                      <td className="py-2">${Number(d.amount).toFixed(2)}</td>
                      <td className="py-2 capitalize">{d.purpose.replace(/-/g, " ")}</td>
                      <td className="py-2">{d.is_anonymous ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
