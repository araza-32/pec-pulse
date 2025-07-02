
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Workbody } from "@/types";

interface ExpiringTaskForceListProps {
  taskForces: Workbody[];
  isLoading: boolean;
  ended?: boolean;
}

export function ExpiringTaskForceList({ taskForces, isLoading, ended = false }: ExpiringTaskForceListProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="h-6 w-[80px]" />
          </div>
        ))}
      </div>
    );
  }

  if (taskForces.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">
          {ended ? "No completed task forces" : "No expiring task forces"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {taskForces.slice(0, 5).map((taskForce) => {
        const today = new Date();
        const endDate = taskForce.endDate ? new Date(taskForce.endDate) : null;
        
        let status = "active";
        let daysRemaining = null;
        
        if (endDate) {
          const timeDiff = endDate.getTime() - today.getTime();
          daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
          
          if (daysRemaining < 0) {
            status = "expired";
          } else if (daysRemaining <= 30) {
            status = "expiring";
          }
        }
        
        return (
          <div
            key={taskForce.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <h4 className="font-medium text-sm truncate">{taskForce.name}</h4>
              </div>
              
              {taskForce.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {taskForce.description}
                </p>
              )}
              
              <div className="flex gap-2 mt-2">
                {taskForce.meetingsThisYear && taskForce.meetingsThisYear > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {taskForce.meetingsThisYear} meetings
                  </Badge>
                )}
                
                {taskForce.actionsAgreed && taskForce.actionsAgreed > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {taskForce.actionsCompleted || 0}/{taskForce.actionsAgreed} actions
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-3">
              {endDate && (
                <Badge 
                  variant={
                    status === "expired" ? "destructive" : 
                    status === "expiring" ? "secondary" : "outline"
                  }
                  className="text-xs"
                >
                  {status === "expired" 
                    ? "Expired" 
                    : daysRemaining !== null 
                      ? `${daysRemaining} days`
                      : "Active"
                  }
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/workbody/${taskForce.id}`)}
                className="h-8 px-2"
              >
                View
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
