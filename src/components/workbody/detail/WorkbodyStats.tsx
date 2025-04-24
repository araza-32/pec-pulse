
import { StatCard } from "@/components/dashboard/StatCard";
import { Calendar, FileText, CheckSquare } from "lucide-react";

interface WorkbodyStatsProps {
  totalMeetings: number;
  meetingsThisYear: number;
  actionsAgreed: number;
  actionsCompleted: number;
}

export function WorkbodyStats({
  totalMeetings,
  meetingsThisYear,
  actionsAgreed,
  actionsCompleted,
}: WorkbodyStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Meetings"
        value={totalMeetings}
        icon={Calendar}
        colorClass="bg-blue-500"
      />
      <StatCard
        title="Meetings This Year"
        value={meetingsThisYear}
        icon={Calendar}
        colorClass="bg-pec-green"
      />
      <StatCard
        title="Actions Agreed"
        value={actionsAgreed}
        icon={FileText}
        colorClass="bg-pec-gold"
      />
      <StatCard
        title="Actions Completed"
        value={actionsCompleted}
        icon={CheckSquare}
        colorClass="bg-purple-500"
      />
    </div>
  );
}
