
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workbody } from "@/types";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface LowCompletionWorkbodiesProps {
  workbodies: Workbody[];
  isLoading: boolean;
}

export const LowCompletionWorkbodies = ({ workbodies, isLoading }: LowCompletionWorkbodiesProps) => {
  const navigate = useNavigate();
  
  // Filter workbodies with completion rate less than 60%
  const lowCompletionWorkbodies = workbodies
    .filter(wb => {
      if (!wb.actionsAgreed || wb.actionsAgreed === 0) return false;
      const completionRate = (wb.actionsCompleted || 0) / wb.actionsAgreed * 100;
      return completionRate < 60;
    })
    .sort((a, b) => {
      const rateA = a.actionsAgreed ? (a.actionsCompleted || 0) / a.actionsAgreed : 0;
      const rateB = b.actionsAgreed ? (b.actionsCompleted || 0) / b.actionsAgreed : 0;
      return rateA - rateB; // Sort by lowest completion rate first
    });

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Workbodies with Low Completion Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (lowCompletionWorkbodies.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Workbodies with Low Completion Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No workbodies with significantly low completion rates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Workbodies with Low Completion Rates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowCompletionWorkbodies.map((wb) => {
            const completionRate = Math.round(
              (wb.actionsCompleted || 0) / (wb.actionsAgreed || 1) * 100
            );
            
            return (
              <div 
                key={wb.id} 
                className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                onClick={() => navigate(`/workbodies/${wb.id}`)}
              >
                <div>
                  <h3 className="font-medium">{wb.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {wb.actionsCompleted || 0} of {wb.actionsAgreed || 0} actions completed
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-sm px-2 py-1 ${
                    completionRate < 30 
                      ? "bg-red-50 text-red-700 border-red-200" 
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {completionRate}% complete
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
