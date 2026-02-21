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
    <div className="student-layout min-h-screen bg-background text-foreground">
      <Sidebar navItems={studentNavItems} />
      <div className="student-layout__main relative z-0 md:pl-60 min-h-screen flex flex-col pb-20 md:pb-0">
        <Navbar title="" />
        <main className="student-layout__content flex-1 min-h-0 min-h-[50vh] p-4 sm:p-5 md:p-6 bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}
