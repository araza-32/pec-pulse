
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, CalendarClock, CheckSquare, BookOpen } from "lucide-react";

interface ChairmanStatCardsProps {
  totalWorkbodies: number;
  committees: number;
  workingGroups: number;
  taskForces: number;
  totalMeetings?: number;
  upcomingMeetings?: number;
  completionRate?: number;
  meetingsThisYear?: number;
  upcomingMeetingsCount?: number;
}

export function ChairmanStatCards({
  totalWorkbodies,
  committees,
  workingGroups,
  taskForces,
  meetingsThisYear = 0,
  completionRate = 0,
  upcomingMeetingsCount = 0
}: ChairmanStatCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Workbodies"
        value={totalWorkbodies}
        icon={Users}
        colorClass="bg-pec-green"
        clickable={true}
      />
      <StatCard
        title="Meetings This Year"
        value={meetingsThisYear}
        icon={CalendarClock}
        colorClass="bg-amber-500"
        clickable={true}
      />
      <StatCard
        title="Action Completion"
        value={`${completionRate}%`}
        icon={CheckSquare}
        colorClass="bg-blue-500"
        clickable={true}
      />
      <StatCard
        title="Upcoming Meetings"
        value={upcomingMeetingsCount}
        icon={BookOpen}
        colorClass="bg-purple-500"
        clickable={true}
      />
    </div>
  );
}
