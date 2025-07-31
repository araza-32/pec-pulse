
import { Users, CalendarClock, CheckSquare, BookOpen } from "lucide-react";
import { StatCard } from "./StatCard";

interface OverviewStatsProps {
  stats: {
    totalWorkbodies: number;
    meetingsThisYear: number;
    completionRate: number;
    upcomingMeetingsCount: number;
  };
}

export const OverviewStats = ({ stats }: OverviewStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Workbodies"
        value={stats.totalWorkbodies}
        icon={Users}
        colorClass="bg-pec-green"
      />
      <StatCard
        title="Meetings This Year"
        value={stats.meetingsThisYear}
        icon={CalendarClock}
        colorClass="bg-pec-gold"
      />
      <StatCard
        title="Action Completion"
        value={`${stats.completionRate}%`}
        icon={CheckSquare}
        colorClass="bg-blue-500"
      />
      <StatCard
        title="Upcoming Meetings"
        value={stats.upcomingMeetingsCount}
        icon={BookOpen}
        colorClass="bg-purple-500"
      />
    </div>
  );
};
