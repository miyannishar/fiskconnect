import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, type NavItem } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { AlumniOnboardingGuard } from "./AlumniOnboardingGuard";
import {
  LayoutDashboard,
  Briefcase,
  Megaphone,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";

const alumniNavItems: NavItem[] = [
  { href: "/alumni", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/alumni/opportunities", label: "Opportunity Board", icon: <Briefcase className="h-4 w-4" /> },
  { href: "/alumni/announcements", label: "Announcements", icon: <Megaphone className="h-4 w-4" /> },
  { href: "/alumni/donate", label: "Donate", icon: <DollarSign className="h-4 w-4" /> },
  { href: "/alumni/events", label: "Events", icon: <Calendar className="h-4 w-4" /> },
  { href: "/alumni/profile", label: "My Profile", icon: <User className="h-4 w-4" /> },
];

export default async function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <AlumniOnboardingGuard>
      <div className="min-h-screen bg-background">
        <Sidebar navItems={alumniNavItems} />
        <div className="md:pl-60 min-h-screen flex flex-col">
          <Navbar title="FiskConnect" />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AlumniOnboardingGuard>
  );
}
