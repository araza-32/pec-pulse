
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Workbody } from "@/types";
import { format } from "date-fns";

interface ExpiringTaskForcesProps {
  expiringTaskForces: Workbody[];
}

export function ExpiringTaskForces({ expiringTaskForces }: ExpiringTaskForcesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Task Forces Nearing Completion
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expiringTaskForces.length > 0 ? (
          <div className="space-y-4">
            {expiringTaskForces.map(taskForce => (
              <div key={taskForce.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                <div className="bg-amber-100 rounded p-2 text-amber-700">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{taskForce.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Expires on {format(new Date(taskForce.endDate!), "MMMM d, yyyy")}
                  </div>
                  <div className="text-sm mt-1">
                    <Badge variant="outline" className="bg-amber-50 text-amber-800">
                      {getDaysRemaining(new Date(taskForce.endDate!))} days remaining
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No task forces are expiring in the next 30 days.</p>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to calculate remaining days
function getDaysRemaining(endDate: Date): number {
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
