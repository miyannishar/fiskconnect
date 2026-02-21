import { StatCard } from "@/components/shared/StatCard";
import {
  GraduationCap,
  UsersRound,
  Shield,
  Briefcase,
  DollarSign,
  CalendarClock,
} from "lucide-react";

interface StatsCardsProps {
  studentsCount: number;
  alumniCount: number;
  adminsCount: number;
  opportunitiesCount: number;
  donationsTotal: number;
  pendingEventsCount: number;
}

export function StatsCards({
  studentsCount,
  alumniCount,
  adminsCount,
  opportunitiesCount,
  donationsTotal,
  pendingEventsCount,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Students"
        value={studentsCount}
        icon={GraduationCap}
      />
      <StatCard
        title="Alumni"
        value={alumniCount}
        icon={UsersRound}
      />
      <StatCard
        title="Admins"
        value={adminsCount}
        icon={Shield}
      />
      <StatCard
        title="Opportunities"
        value={opportunitiesCount}
        icon={Briefcase}
      />
      <StatCard
        title="Donations total"
        value={`$${donationsTotal.toFixed(2)}`}
        icon={DollarSign}
      />
      <StatCard
        title="Pending events"
        value={pendingEventsCount}
        icon={CalendarClock}
      />
    </div>
  );
}
