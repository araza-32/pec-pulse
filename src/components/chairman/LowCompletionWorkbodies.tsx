
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workbody } from "@/types";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      <Card className="shadow-card col-span-full">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span>Workbodies with Low Completion Rates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-4">
                <div>
                  <Skeleton className="h-5 w-48 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (lowCompletionWorkbodies.length === 0) {
    return (
      <Card className="shadow-card col-span-full">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span>Workbodies with Low Completion Rates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-green-50 rounded-full p-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-lg font-medium mb-2">All Workbodies on Track</h4>
            <p className="text-muted-foreground text-center max-w-md">
              No workbodies with significantly low completion rates at this time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card col-span-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <span>Workbodies with Low Completion Rates</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {lowCompletionWorkbodies.map((wb) => {
            const completionRate = Math.round(
              (wb.actionsCompleted || 0) / (wb.actionsAgreed || 1) * 100
            );
            
            return (
              <div 
                key={wb.id} 
                className="flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/workbodies/${wb.id}`)}
              >
                <div>
                  <h3 className="font-medium text-base mb-1">{wb.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <span>{wb.actionsCompleted || 0} of {wb.actionsAgreed || 0} actions completed</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-4 h-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/workbodies/${wb.id}`);
                      }}
                    >
                      <span className="text-pec-green text-xs">View Details</span>
                      <ArrowRight className="h-3 w-3 ml-1 text-pec-green" />
                    </Button>
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-sm px-3 py-1 ${
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
