
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkbodyTypeCards } from "@/components/chairman/WorkbodyTypeCards";

interface DashboardHeroProps {
  stats: {
    committees: number;
    workingGroups: number;
    taskForces: number;
  };
  onWorkbodyTypeClick?: (type: string) => void;
}

export function DashboardHero({ stats, onWorkbodyTypeClick }: DashboardHeroProps) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold">Work Bodies Overview</CardTitle>
        <CardDescription>
          Summary of all work bodies across Pakistan Engineering Council
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <WorkbodyTypeCards
          committees={stats.committees}
          workingGroups={stats.workingGroups}
          taskForces={stats.taskForces}
          onCardClick={onWorkbodyTypeClick}
        />
      </CardContent>
    </Card>
  );
}
