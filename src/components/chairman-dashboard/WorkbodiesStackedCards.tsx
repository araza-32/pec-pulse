
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
  committee: {
    gradient: "from-blue-500 to-blue-700",
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300"
  },
  'working-group': {
    gradient: "from-green-500 to-green-700",
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300"
  },
  'task-force': {
    gradient: "from-amber-500 to-amber-700",
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300"
  }
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
        
        // Get color schemes based on workbody type
        const colorScheme = typeColors[workbodyType as keyof typeof typeColors] || {
          gradient: "from-pec-green-400 to-pec-green-600",
          bg: "bg-pec-green-100",
          text: "text-pec-green-700",
          border: "border-pec-green-300"
        };
        
        return (
          <Link to={`/workbody/${wb.id}`} key={wb.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 h-full border-2 border-gray-100 hover:border-pec-green-200 group">
              {/* Colored header strip based on workbody type */}
              <div className={`h-3 w-full bg-gradient-to-r ${colorScheme.gradient}`}></div>
              
              <CardContent className="p-4 pt-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-base text-pec-green-800 line-clamp-2 group-hover:text-pec-green-600 transition-colors">
                    {displayName}
                  </h3>
                  <Link 
                    to={`/workbody/edit/${wb.id}`} 
                    className="text-xs text-pec-green-600 hover:text-pec-green-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                </div>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <Badge 
                    variant="outline" 
                    className={`${colorScheme.bg} ${colorScheme.text} ${colorScheme.border}`}
                  >
                    {workbodyType === 'committee' ? 'Committee' : 
                     workbodyType === 'working-group' ? 'Working Group' : 
                     workbodyType === 'task-force' ? 'Task Force' : workbodyType}
                  </Badge>
                  
                  {isEnhancedWorkbody(wb) && (
                    <Badge 
                      variant="outline" 
                      className="bg-pec-green-50 text-pec-green-700 border-pec-green-200"
                    >
                      {wb.meetingsYtd} meetings
                    </Badge>
                  )}
                </div>
                
                {/* Add meeting stats if available */}
                {wb.totalMeetings !== undefined && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Total meetings: <span className="font-medium text-pec-green-600">{wb.totalMeetings}</span>
                    </div>
                    
                    {isEnhancedWorkbody(wb) && wb.progressPercent !== undefined && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 flex justify-between mb-1">
                          <span>Progress</span>
                          <span className="text-pec-green-600">{wb.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-pec-green-400 to-pec-green-600 h-1.5 rounded-full" 
                            style={{ width: `${wb.progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
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
