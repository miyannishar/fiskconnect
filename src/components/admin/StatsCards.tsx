import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, DollarSign, Calendar } from "lucide-react";

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-card border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Students</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">{studentsCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-card border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Alumni</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">{alumniCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-card border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">{adminsCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-card border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Opportunities</CardTitle>
          <Briefcase className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">{opportunitiesCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-card border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Donations total</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">${donationsTotal.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card className="bg-card border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending events</CardTitle>
          <Calendar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">{pendingEventsCount}</p>
        </CardContent>
      </Card>
    </div>
  );
}
