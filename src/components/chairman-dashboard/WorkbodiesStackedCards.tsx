
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedWorkbody } from '@/hooks/useWorkBodiesQuery';
import { Workbody } from '@/types';
import { Link } from "react-router-dom";

interface WorkbodiesStackedCardsProps {
  workbodies: EnhancedWorkbody[] | Workbody[];
  isLoading: boolean;
}

// Type guard to check if it's an EnhancedWorkbody
function isEnhancedWorkbody(workbody: any): workbody is EnhancedWorkbody {
  return 'progressPercent' in workbody && 'abbreviation' in workbody;
}

// Type colors for visual distinction
const typeColors = {
  committee: "from-blue-500 to-blue-700",
  'working-group': "from-green-500 to-green-700",
  'task-force': "from-amber-500 to-amber-700"
};

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
        
        // Get gradient color based on workbody type
        const gradientClass = typeColors[workbodyType as keyof typeof typeColors] || "from-blue-300 to-blue-500";
        
        return (
          <Link to={`/workbody/${wb.id}`} key={wb.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 h-full border-2 border-gray-100 hover:border-blue-200 relative">
              {/* Colored header strip based on workbody type */}
              <div className={`h-2 w-full bg-gradient-to-r ${gradientClass}`}></div>
              
              <CardContent className="p-4 pt-5">
                <h3 className="font-medium text-base text-blue-800 line-clamp-2 mb-2">{displayName}</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {typeBadge}
                  </div>
                  {isEnhancedWorkbody(wb) && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      {wb.meetingsYtd} meetings
                    </Badge>
                  )}
                </div>
                
                {/* Add meeting stats if available */}
                {wb.totalMeetings !== undefined && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">Total meetings: <span className="font-medium text-blue-700">{wb.totalMeetings}</span></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function getTypeBadge(type: string) {
  switch (type) {
    case 'committee':
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
          Committee
        </Badge>
      );
    case 'working-group':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
          Working Group
        </Badge>
      );
    case 'task-force':
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
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
