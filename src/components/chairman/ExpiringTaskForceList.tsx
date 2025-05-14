
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EnhancedWorkbody } from '@/hooks/useWorkBodiesQuery';

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
        {Array(3).fill(0).map((_, index) => (
          <Card key={index} className="p-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (taskForces.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {ended ? "No recently ended task forces" : "No task forces expiring soon"}
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
      {taskForces.map((tf) => (
        <Card key={tf.id} className="p-3 hover:bg-muted/50 cursor-pointer">
          <div className="mb-1 font-medium">{tf.name}</div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-muted-foreground">
              {ended ? "Ended" : `Progress: ${tf.progressPercent}%`}
            </span>
            <Badge 
              variant={ended ? "outline" : "default"}
              className={ended ? "bg-green-100 text-green-800" : ""}
            >
              {ended ? "Completed" : "Active"}
            </Badge>
          </div>
          <Progress value={tf.progressPercent} className="h-1.5" />
        </Card>
      ))}
    </div>
  );
}
