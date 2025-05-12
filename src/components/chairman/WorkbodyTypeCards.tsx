
import { StatCard } from "@/components/dashboard/StatCard";
import { Briefcase, BookOpen, FileText } from "lucide-react";

interface WorkbodyTypeCardsProps {
  committees: number;
  workingGroups: number;
  taskForces: number;
  onCardClick?: (type: string) => void;
}

export function WorkbodyTypeCards({
  committees,
  workingGroups,
  taskForces,
  onCardClick
}: WorkbodyTypeCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Committees"
        value={committees}
        icon={Briefcase}
        colorClass="bg-pec-green"
        clickable={true}
        onClick={() => onCardClick && onCardClick('committees')}
      />
      <StatCard
        title="Working Groups"
        value={workingGroups}
        icon={FileText}
        colorClass="bg-amber-500"
        clickable={true}
        onClick={() => onCardClick && onCardClick('workingGroups')}
      />
      <StatCard
        title="Task Forces"
        value={taskForces}
        icon={BookOpen}
        colorClass="bg-blue-500"
        clickable={true}
        onClick={() => onCardClick && onCardClick('taskForces')}
      />
    </div>
  );
}
