
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
    <div className="animate-fade-in">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="text-2xl font-bold text-primary-900">
            Work Bodies Overview
          </CardTitle>
          <CardDescription className="text-muted-foreground">
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
      
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-amber-500 to-purple-500 rounded-full my-6 opacity-75"></div>
    </div>
  );
}
