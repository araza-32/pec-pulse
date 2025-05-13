
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Workbody } from "@/types";
import { cn } from "@/lib/utils";

interface WorkbodiesGridViewProps {
  workbodies: Workbody[];
  onWorkbodyClick: (id: string) => void;
  isLoading?: boolean;
}

export function WorkbodiesGridView({ workbodies, onWorkbodyClick, isLoading = false }: WorkbodiesGridViewProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const workbodiesWithAbbr = useMemo(() => {
    return workbodies.map(wb => {
      // Extract abbreviation from name if available in parentheses
      const match = wb.name.match(/\(([^)]+)\)$/);
      let abbr = "";
      
      if (match && match[1]) {
        // Use abbreviation found in parentheses
        abbr = match[1];
      } else {
        // Create abbreviation from first letters of words
        abbr = wb.name.split(' ')
          .filter(word => word.length > 0)
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .substring(0, 3);
      }
      
      return { ...wb, abbreviation: abbr };
    });
  }, [workbodies]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "committee":
        return "bg-blue-50 text-blue-700 border-blue-300";
      case "working-group":
        return "bg-green-50 text-green-700 border-green-300";
      case "task-force":
        return "bg-amber-50 text-amber-700 border-amber-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "committee":
        return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200";
      case "working-group":
        return "bg-gradient-to-br from-green-50 to-green-100 border-green-200";
      case "task-force":
        return "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200";
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200";
    }
  };

  const getAbbrBackgroundColor = (type: string) => {
    switch (type) {
      case "committee":
        return "bg-blue-700";
      case "working-group":
        return "bg-green-700";
      case "task-force":
        return "bg-amber-700";
      default:
        return "bg-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
              <div className="mt-4 flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {workbodiesWithAbbr.map((workbody) => (
        <Card 
          key={workbody.id} 
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-lg border overflow-hidden transform",
            getBackgroundColor(workbody.type),
            hoveredId === workbody.id ? "scale-[1.02]" : "scale-100"
          )}
          onClick={() => onWorkbodyClick(workbody.id)}
          onMouseEnter={() => setHoveredId(workbody.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="flex items-start space-x-3 p-4">
            <div 
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold",
                getAbbrBackgroundColor(workbody.type)
              )}
            >
              {workbody.abbreviation}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold truncate pr-2">{workbody.name}</h3>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "capitalize whitespace-nowrap",
                    getTypeColor(workbody.type)
                  )}
                >
                  {workbody.type.replace("-", " ")}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {workbody.description || "No description available"}
              </p>
            </div>
          </div>
          
          <div className="px-4 pb-4 pt-0 flex justify-between text-sm">
            <div>
              <span className="font-medium">{workbody.meetingsThisYear || 0}</span>{" "}
              <span className="text-muted-foreground">meetings</span>
            </div>
            <div>
              <span className="font-medium">
                {workbody.actionsAgreed ? Math.round((workbody.actionsCompleted / workbody.actionsAgreed) * 100) : 0}%
              </span>{" "}
              <span className="text-muted-foreground">completion</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
