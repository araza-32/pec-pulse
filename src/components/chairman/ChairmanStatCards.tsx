
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, CalendarClock, BookOpen } from "lucide-react";

export interface ChairmanStatCardsProps {
  stats: {
    totalWorkbodies: number;
    committees?: number;
    workingGroups?: number;
    taskForces?: number;
    meetingsThisYear?: number;
    completionRate?: number;
    upcomingMeetingsCount?: number;
    actionsCompleted?: number;
    actionsAgreed?: number;
    overdueActions?: number;
  };
  onWorkbodiesClick?: () => void;
  onMeetingsClick?: () => void;
  onUpcomingClick?: () => void;
}

export function ChairmanStatCards({
  stats,
  onWorkbodiesClick,
  onMeetingsClick,
  onUpcomingClick
}: ChairmanStatCardsProps) {
  const handleStatClick = (statType: string) => {
    if (statType === 'totalWorkbodies' && onWorkbodiesClick) {
      onWorkbodiesClick();
    } else if (statType === 'meetingsThisYear' && onMeetingsClick) {
      onMeetingsClick();
    } else if (statType === 'upcomingMeetings' && onUpcomingClick) {
      onUpcomingClick();
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Workbodies"
        value={stats.totalWorkbodies}
        icon={Users}
        colorClass="bg-green-600"
        clickable={true}
        onClick={() => handleStatClick('totalWorkbodies')}
        description="View distribution chart"
      />
      <StatCard
        title="Meetings This Year"
        value={stats.meetingsThisYear || 0}
        icon={CalendarClock}
        colorClass="bg-amber-500"
        clickable={true}
        onClick={() => handleStatClick('meetingsThisYear')}
        description="View meetings with agenda"
      />
      <StatCard
        title="Upcoming Meetings"
        value={stats.upcomingMeetingsCount || 0}
        icon={BookOpen}
        colorClass="bg-purple-500"
        clickable={true}
        onClick={() => handleStatClick('upcomingMeetings')}
        description="View upcoming meeting list"
      />
    </div>
  );
}
