
import { Users, CalendarClock, CheckSquare, BookOpen } from "lucide-react";
import { StatCard } from "./StatCard";

interface OverviewStatsProps {
  stats: {
    totalWorkbodies: number;
    meetingsThisYear: number;
    completionRate: number;
    upcomingMeetingsCount: number;
  };
  onStatClick?: (statType: string) => void;
}

export const OverviewStats = ({ stats, onStatClick }: OverviewStatsProps) => {
  const handleClick = (statType: string) => {
    if (onStatClick) {
      onStatClick(statType);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      <StatCard
        title="Total Workbodies"
        value={stats.totalWorkbodies}
        icon={Users}
        colorClass="bg-pec-green"
        onClick={() => handleClick('totalWorkbodies')}
        clickable={!!onStatClick}
      />
      <StatCard
        title="Meetings This Year"
        value={stats.meetingsThisYear}
        icon={CalendarClock}
        colorClass="bg-amber-500"
        onClick={() => handleClick('meetingsThisYear')}
        clickable={!!onStatClick}
      />
      <StatCard
        title="Action Completion"
        value={`${stats.completionRate}%`}
        icon={CheckSquare}
        colorClass="bg-blue-500"
        onClick={() => handleClick('actionCompletion')}
        clickable={!!onStatClick}
      />
      <StatCard
        title="Upcoming Meetings"
        value={stats.upcomingMeetingsCount}
        icon={BookOpen}
        colorClass="bg-purple-500"
        onClick={() => handleClick('upcomingMeetings')}
        clickable={!!onStatClick}
      />
    </div>
  );
};
