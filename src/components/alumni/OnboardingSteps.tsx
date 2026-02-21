"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const GRADUATION_YEARS = Array.from({ length: 56 }, (_, i) => 2025 - i);
const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Government",
  "Nonprofit",
  "Consulting",
  "Media",
  "Other",
];

export function OnboardingSteps() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [graduationYear, setGraduationYear] = useState<number | "">("");
  const [major, setMajor] = useState("");
  const [location, setLocation] = useState("");

  // Step 2 - LinkedIn mock
  const [linkedInModalOpen, setLinkedInModalOpen] = useState(false);
  const [linkedInConnecting, setLinkedInConnecting] = useState(false);
  const [linkedInFetched, setLinkedInFetched] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Step 3
  const [openToMentor, setOpenToMentor] = useState(false);
  const [openToContact, setOpenToContact] = useState(true);
  const [bio, setBio] = useState("");

  async function handleLinkedInConnect() {
    setLinkedInConnecting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLinkedInConnecting(false);
    setLinkedInFetched(true);
    setCurrentTitle("Senior Software Engineer");
    setCurrentCompany("Tech Corp");
    setIndustry("Technology");
    setSkills(["JavaScript", "React", "Leadership"]);
    setLinkedinUrl("https://linkedin.com/in/example");
  }

  function addSkill() {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) {
      setSkills([...skills, v]);
      setSkillInput("");
    }
  }

  async function handleFinish() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    await supabase
      .from("profiles")
      .update({
        graduation_year: graduationYear === "" ? null : graduationYear,
        major: major || null,
        location: location || null,
        current_title: currentTitle || null,
        current_company: currentCompany || null,
        industry: industry || null,
        skills: skills.length ? skills : null,
        linkedin_url: linkedinUrl || null,
        open_to_mentor: openToMentor,
        open_to_contact: openToContact,
        bio: bio || null,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    await refreshProfile();
    router.push("/alumni");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Complete your alumni profile</h1>
        <p className="text-muted-foreground mt-1">Help students and the community connect with you.</p>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <Card className="bg-card border-white/10">
          <CardHeader>
            <CardTitle>Basic info</CardTitle>
            <CardDescription>Graduation year, major, and location.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Graduation year</Label>
              <Select
                value={graduationYear === "" ? "" : String(graduationYear)}
                onValueChange={(v) => setGraduationYear(v === "" ? "" : Number(v))}
              >
                <SelectTrigger className="bg-card border-white/10">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {GRADUATION_YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Major at Fisk</Label>
              <Input
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Computer Science"
                className="bg-card border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Current location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Nashville, TN"
                className="bg-card border-white/10"
              />
            </div>
            <Button type="button" className="w-full rounded-lg" onClick={() => setStep(2)}>
              Next
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card className="bg-card border-white/10">
          <CardHeader>
            <CardTitle>Professional info</CardTitle>
            <CardDescription>Connect LinkedIn to pre-fill your profile (mock).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-lg border-[#0A66C2] bg-[#0A66C2] text-white hover:bg-[#004182] hover:text-white"
              onClick={() => setLinkedInModalOpen(true)}
            >
              Connect with LinkedIn
            </Button>
            <div className="space-y-2">
              <Label>Current job title</Label>
              <Input
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="e.g. Senior Engineer"
                className="bg-card border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Current company</Label>
              <Input
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="e.g. Acme Inc"
                className="bg-card border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="bg-card border-white/10">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Skills (add one at a time)</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Type and press Enter"
                  className="bg-card border-white/10"
                />
                <Button type="button" variant="secondary" onClick={addSkill}>
                  Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center rounded-md border border-white/20 px-2 py-0.5 text-xs"
                    >
                      {s}{" "}
                      <button
                        type="button"
                        className="ml-1 hover:text-destructive"
                        onClick={() => setSkills(skills.filter((x) => x !== s))}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>LinkedIn profile URL</Label>
              <Input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="bg-card border-white/10"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="rounded-lg" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" className="rounded-lg flex-1" onClick={() => setStep(3)}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <Card className="bg-card border-white/10">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>How you&apos;d like to engage with the community.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Open to mentoring students?</Label>
              <Switch checked={openToMentor} onCheckedChange={setOpenToMentor} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Open to being contacted?</Label>
              <Switch checked={openToContact} onCheckedChange={setOpenToContact} />
            </div>
            <div className="space-y-2">
              <Label>Short bio</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A few sentences about you..."
                className="bg-card border-white/10 min-h-[100px]"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="rounded-lg" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                type="button"
                className="rounded-lg flex-1"
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Finish"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mock LinkedIn modal */}
      <Dialog open={linkedInModalOpen} onOpenChange={setLinkedInModalOpen}>
        <DialogContent className="bg-card border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle>
              {linkedInConnecting ? "Connecting to LinkedIn..." : linkedInFetched ? "Profile imported" : "Connect LinkedIn"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {linkedInConnecting && (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {linkedInFetched && !linkedInConnecting && (
              <p className="text-sm text-muted-foreground">
                Mock data loaded. You can edit the fields on the previous step and then close this dialog.
              </p>
            )}
            {!linkedInConnecting && !linkedInFetched && (
              <p className="text-sm text-muted-foreground">
                This is a demo. Click &quot;Connect&quot; to simulate LinkedIn OAuth and pre-fill your profile.
              </p>
            )}
            {!linkedInConnecting && (
              <Button
                className="mt-4 w-full rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182]"
                onClick={linkedInFetched ? () => setLinkedInModalOpen(false) : handleLinkedInConnect}
              >
                {linkedInFetched ? "Close" : "Connect"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
