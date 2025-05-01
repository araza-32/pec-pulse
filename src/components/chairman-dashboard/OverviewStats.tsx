
import { Users, CalendarClock, CheckSquare, Bell } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

interface OverviewStatsProps {
  stats: {
    totalWorkbodies: number;
    activeMeetings: number;
    completionRate: number;
    upcomingDeadlines: number;
  };
}

export const OverviewStats = ({ stats }: OverviewStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      <StatCard
        title="Total Workbodies"
        value={stats.totalWorkbodies}
        icon={Users}
        colorClass="bg-pec-green"
        clickable={true}
      />
      <StatCard
        title="Active Meetings"
        value={stats.activeMeetings}
        icon={CalendarClock}
        colorClass="bg-amber-500"
        clickable={true}
      />
      <StatCard
        title="Action Completion"
        value={`${stats.completionRate}%`}
        icon={CheckSquare}
        colorClass="bg-blue-500"
        clickable={true}
      />
      <StatCard
        title="Upcoming Deadlines"
        value={stats.upcomingDeadlines}
        icon={Bell}
        colorClass={stats.upcomingDeadlines > 0 ? "bg-red-500" : "bg-green-500"}
        clickable={true}
      />
    </div>
  );
};
