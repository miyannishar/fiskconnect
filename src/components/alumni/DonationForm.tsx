"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import confetti from "canvas-confetti";

const PURPOSES = [
  "scholarships",
  "campus improvements",
  "student emergency fund",
  "general",
  "other",
] as const;

export function DonationForm() {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState<(typeof PURPOSES)[number]>("general");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [donations, setDonations] = useState<{ id: string; amount: number; purpose: string; message: string | null; created_at: string }[]>([]);
  const supabase = createClient();

  async function loadDonations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("donations")
      .select("id, amount, purpose, message, created_at")
      .eq("donor_id", user.id)
      .order("created_at", { ascending: false });
    setDonations(data ?? []);
  }

  useEffect(() => {
    loadDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("donations").insert({
      donor_id: user.id,
      amount: num,
      purpose,
      message: message.trim() || null,
      is_anonymous: isAnonymous,
    });

    if (!error) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setAmount("");
      setPurpose("general");
      setMessage("");
      setIsAnonymous(false);
      loadDonations();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Make a donation</CardTitle>
          <p className="text-sm text-muted-foreground">This is a demo — no real payment is processed.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Purpose</Label>
              <Select value={purpose} onValueChange={(v) => setPurpose(v as (typeof PURPOSES)[number])}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message (optional)</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="bg-card border-border" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              <Label>Anonymous</Label>
            </div>
            {submitError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2" role="alert">
                {submitError}
              </p>
            )}
            <Button type="submit" className="rounded-lg" disabled={loading}>
              {loading ? "Processing…" : "Donate"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Your donation history</CardTitle>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <p className="text-muted-foreground text-sm">No donations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Purpose</th>
                    <th className="pb-2 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id} className="border-b border-white/5">
                      <td className="py-2 text-muted-foreground">
                        {new Date(d.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2">${Number(d.amount).toFixed(2)}</td>
                      <td className="py-2 capitalize">{d.purpose.replace(/-/g, " ")}</td>
                      <td className="py-2 text-muted-foreground max-w-[200px] truncate">{d.message ?? "—"}</td>
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
