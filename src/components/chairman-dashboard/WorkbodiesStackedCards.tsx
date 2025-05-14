
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedWorkbody } from '@/hooks/useWorkBodiesQuery';
import { Workbody } from '@/types';

interface WorkbodiesStackedCardsProps {
  workbodies: EnhancedWorkbody[] | Workbody[];
  isLoading: boolean;
}

// Type guard to check if it's an EnhancedWorkbody
function isEnhancedWorkbody(workbody: any): workbody is EnhancedWorkbody {
  return 'progressPercent' in workbody && 'abbreviation' in workbody;
}

export function WorkbodiesStackedCards({ 
  workbodies, 
  isLoading 
}: WorkbodiesStackedCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (workbodies.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No workbodies found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workbodies.map((wb) => {
        // Handle both EnhancedWorkbody and Workbody types
        const displayName = wb.name;
        const workbodyType = wb.type;
        const typeBadge = getTypeBadge(workbodyType);
        
        return (
          <Card key={wb.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-0">
              <div className="p-4">
                <h3 className="font-medium text-base mb-1">{displayName}</h3>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {typeBadge}
                  </div>
                  {isEnhancedWorkbody(wb) && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-800">
                      {wb.meetingsYtd} meetings
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function getTypeBadge(type: string) {
  switch (type) {
    case 'committee':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-800">
          Committee
        </Badge>
      );
    case 'working-group':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-800">
          Working Group
        </Badge>
      );
    case 'task-force':
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-800">
          Task Force
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {type}
        </Badge>
      );
  }
}
