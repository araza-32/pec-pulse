
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ActionItemsTrackingProps {
  completionRate: number;
  total: number;
  completed: number;
  overdue: number;
  onViewAllClick?: () => void;
}

export function ActionItemsTracking({
  completionRate,
  total,
  completed,
  overdue,
  onViewAllClick
}: ActionItemsTrackingProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Action Items</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tracking progress across all workbodies
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <PieChart className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">{completionRate}%</p>
              <p className="text-sm text-muted-foreground">Completion rate</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{completed} of {total}</p>
              <p className="text-sm text-muted-foreground">items completed</p>
            </div>
          </div>

          <Progress value={completionRate} className="h-2" />
          
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm font-medium">{completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-md">
              <p className="text-sm font-medium">{overdue}</p>
              <p className="text-xs text-red-500">Overdue</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={onViewAllClick}
          >
            View Action Items
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
