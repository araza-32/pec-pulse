
import { differenceInDays, format, parseISO } from "date-fns";
import { Clock, AlertTriangle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Workbody } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ExpiringTaskForcesProps {
  expiringTaskForces: Workbody[];
  showEnded?: boolean;
}

export function ExpiringTaskForces({ expiringTaskForces, showEnded = false }: ExpiringTaskForcesProps) {
  const navigate = useNavigate();
  
  // Filter the task forces to show ended ones or those ending soon
  const taskForcesToShow = expiringTaskForces.filter(tf => {
    const today = new Date();
    const endDate = tf.endDate ? parseISO(tf.endDate) : null;
    
    if (!endDate) return false;
    
    if (showEnded) {
      // Show task forces that have already ended or will end within next 60 days
      return endDate <= new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
    } else {
      // Only show task forces that haven't ended yet but will in the next 60 days
      return endDate > today && endDate <= new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
    }
  });
  
  if (taskForcesToShow.length === 0) {
    return (
      <div className="text-left py-6">
        <p className="text-muted-foreground">
          {showEnded 
            ? "No task forces have ended recently or are ending soon." 
            : "No task forces expiring within 60 days."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col">
      {taskForcesToShow.map((taskForce) => {
        const today = new Date();
        const endDate = taskForce.endDate ? parseISO(taskForce.endDate) : null;
        const daysRemaining = endDate ? differenceInDays(endDate, today) : null;
        
        let badgeVariant = "default";
        let badgeText = "";
        
        if (daysRemaining !== null) {
          if (daysRemaining < 0) {
            badgeVariant = "destructive";
            badgeText = `Ended ${Math.abs(daysRemaining)} days ago`;
          } else if (daysRemaining < 15) {
            badgeVariant = "destructive";
            badgeText = `${daysRemaining} days left`;
          } else if (daysRemaining < 30) {
            badgeVariant = "default";
            badgeText = `${daysRemaining} days left`;
          } else {
            badgeVariant = "outline";
            badgeText = `${daysRemaining} days left`;
          }
        }
        
        return (
          <div 
            key={taskForce.id}
            className="flex items-start space-x-4 border-b pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className={`${daysRemaining && daysRemaining < 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"} rounded p-2 flex-shrink-0`}>
              {daysRemaining && daysRemaining < 0 ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>
            <div className="flex-grow text-left">
              <div className="font-medium">{taskForce.name}</div>
              {endDate && (
                <div className="text-sm text-muted-foreground">
                  {daysRemaining && daysRemaining < 0 
                    ? `Ended on ${format(endDate, "MMMM d, yyyy")}` 
                    : `Expires on ${format(endDate, "MMMM d, yyyy")}`}
                </div>
              )}
              <div className="mt-2 flex items-center justify-between">
                <Badge variant={badgeVariant as any} className="mr-2">
                  {badgeText}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/workbodies/${taskForce.id}`)}
                  className="h-7 text-xs"
                >
                  View <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
