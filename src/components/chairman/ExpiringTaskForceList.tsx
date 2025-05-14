
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInDays, parseISO } from "date-fns";

// Define the types for a task force
interface TaskForce {
  id: string;
  name: string;
  endDate?: string;
  type: string;
  progressPercent?: number;
}

interface ExpiringTaskForceListProps {
  taskForces: TaskForce[];
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
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (taskForces.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">
          {ended ? "No recently ended task forces." : "No expiring task forces."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {taskForces.map((taskForce) => {
        const daysLeft = taskForce.endDate 
          ? differenceInDays(parseISO(taskForce.endDate), new Date())
          : 0;
          
        const statusColor = ended ? "bg-green-100 text-green-800" : 
                           daysLeft < 7 ? "bg-red-100 text-red-800" : 
                           daysLeft < 30 ? "bg-amber-100 text-amber-800" : 
                           "bg-blue-100 text-blue-800";
          
        const statusText = ended ? "Completed" : 
                          daysLeft < 0 ? "Expired" : 
                          `${daysLeft} days left`;

        return (
          <Card key={taskForce.id} className="p-3">
            <div className="flex justify-between items-center">
              <div className="font-medium truncate max-w-[70%]">
                {taskForce.name}
              </div>
              <Badge variant="outline" className={statusColor}>
                {statusText}
              </Badge>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
