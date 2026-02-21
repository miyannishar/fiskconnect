import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, type NavItem } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import {
  LayoutDashboard,
  Briefcase,
  Megaphone,
  Calendar,
  DollarSign,
  Users,
} from "lucide-react";

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/admin/opportunities", label: "Opportunities", icon: <Briefcase className="h-4 w-4" /> },
  { href: "/admin/announcements", label: "Announcements", icon: <Megaphone className="h-4 w-4" /> },
  { href: "/admin/events", label: "Events", icon: <Calendar className="h-4 w-4" /> },
  { href: "/admin/donations", label: "Donations", icon: <DollarSign className="h-4 w-4" /> },
  { href: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" /> },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar navItems={adminNavItems} />
      <div className="md:pl-56 min-h-screen flex flex-col">
        <Navbar title="FiskConnect Admin" />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
