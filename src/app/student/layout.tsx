import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, type NavItem } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { LayoutDashboard, Briefcase, Search } from "lucide-react";

const studentNavItems: NavItem[] = [
  { href: "/student", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/student/opportunities", label: "Opportunity Board", icon: <Briefcase className="h-4 w-4" /> },
  { href: "/student/find-alumni", label: "Find Alumni", icon: <Search className="h-4 w-4" /> },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar navItems={studentNavItems} />
      <div className="md:pl-60 min-h-screen flex flex-col">
        <Navbar title="FiskConnect" />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
