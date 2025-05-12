
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
        colorClass="bg-blue-500"
        clickable={true}
        onClick={() => onCardClick && onCardClick('committees')}
        description="Active standard committees"
      />
      <StatCard
        title="Working Groups"
        value={workingGroups}
        icon={FileText}
        colorClass="bg-amber-500"
        clickable={true}
        onClick={() => onCardClick && onCardClick('workingGroups')}
        description="Specialized working groups"
      />
      <StatCard
        title="Task Forces"
        value={taskForces}
        icon={BookOpen}
        colorClass="bg-purple-500"
        clickable={true}
        onClick={() => onCardClick && onCardClick('taskForces')}
        description="Special purpose task forces"
      />
    </div>
  );
}
