
import { differenceInDays, format, parseISO } from "date-fns";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Workbody } from "@/types";

interface ExpiringTaskForcesProps {
  expiringTaskForces: Workbody[];
}

export function ExpiringTaskForces({ expiringTaskForces }: ExpiringTaskForcesProps) {
  if (expiringTaskForces.length === 0) {
    return (
      <div className="text-left py-6">
        <p className="text-muted-foreground">No task forces expiring within 60 days.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col">
      {expiringTaskForces.map((taskForce) => {
        const today = new Date();
        const endDate = taskForce.endDate ? parseISO(taskForce.endDate) : null;
        const daysRemaining = endDate ? differenceInDays(endDate, today) : null;
        
        let badgeVariant = "default";
        if (daysRemaining !== null) {
          if (daysRemaining < 15) badgeVariant = "destructive";
          else if (daysRemaining < 30) badgeVariant = "default";
        }
        
        return (
          <div 
            key={taskForce.id}
            className="flex items-start space-x-4 border-b pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="bg-amber-100 rounded p-2 text-amber-700 flex-shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-grow text-left">
              <div className="font-medium">{taskForce.name}</div>
              {endDate && (
                <div className="text-sm text-muted-foreground">
                  Expires on {format(endDate, "MMMM d, yyyy")}
                </div>
              )}
              <div className="mt-2">
                {daysRemaining !== null && (
                  <Badge variant={badgeVariant as any}>
                    {daysRemaining} days remaining
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
