
import React from "react";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EnhancedWorkbody } from "@/hooks/useWorkBodiesQuery";
import { CalendarIcon, ClockIcon } from "lucide-react";

interface ExpiringTaskForceListProps {
  taskForces: EnhancedWorkbody[];
  isLoading: boolean;
  ended?: boolean;
}

export function ExpiringTaskForceList({ 
  taskForces, 
  isLoading, 
  ended = false 
}: ExpiringTaskForceListProps) {

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-2 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (taskForces.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">
          {ended 
            ? "No task forces have recently ended" 
            : "No task forces are expiring soon"
          }
        </p>
      </div>
    );
  }

  // Sort by progress (for ended) or by meeting count (for expiring)
  const sortedTaskForces = [...taskForces].sort((a, b) => {
    if (ended) {
      return b.progressPercent - a.progressPercent;
    } else {
      return b.meetingsYtd - a.meetingsYtd;
    }
  });

  return (
    <div className="space-y-3">
      {sortedTaskForces.slice(0, 3).map((taskForce) => (
        <Card key={taskForce.id} className="border-l-4 border-amber-500 hover:bg-muted/50 transition-colors cursor-pointer">
          <CardContent className="py-3">
            <h4 className="font-medium truncate">{taskForce.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
              {ended ? (
                <div className="flex items-center">
                  <ClockIcon className="h-3.5 w-3.5 mr-1 text-green-500" />
                  <span>Completed - {taskForce.progressPercent}% achievement</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  <span>Progress: {taskForce.progressPercent}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
