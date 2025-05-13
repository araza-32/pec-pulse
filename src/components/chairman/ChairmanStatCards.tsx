
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, CalendarClock, BookOpen } from "lucide-react";

interface ChairmanStatCardsProps {
  totalWorkbodies: number;
  committees?: number;
  workingGroups?: number;
  taskForces?: number;
  meetingsThisYear?: number;
  completionRate?: number;
  upcomingMeetingsCount?: number;
  onStatClick?: (statType: string) => void;
}

export function ChairmanStatCards({
  totalWorkbodies,
  committees = 0,
  workingGroups = 0,
  taskForces = 0,
  meetingsThisYear = 0,
  completionRate = 0,
  upcomingMeetingsCount = 0,
  onStatClick
}: ChairmanStatCardsProps) {
  const handleStatClick = (statType: string) => {
    if (onStatClick) {
      onStatClick(statType);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Workbodies"
        value={totalWorkbodies}
        icon={Users}
        colorClass="bg-green-600"
        clickable={true}
        onClick={() => handleStatClick('totalWorkbodies')}
        description="View distribution chart"
      />
      <StatCard
        title="Meetings This Year"
        value={meetingsThisYear}
        icon={CalendarClock}
        colorClass="bg-amber-500"
        clickable={true}
        onClick={() => handleStatClick('meetingsThisYear')}
        description="View meetings with agenda"
      />
      <StatCard
        title="Upcoming Meetings"
        value={upcomingMeetingsCount}
        icon={BookOpen}
        colorClass="bg-purple-500"
        clickable={true}
        onClick={() => handleStatClick('upcomingMeetings')}
        description="View upcoming meeting list"
      />
    </div>
  );
}
