
import { useState } from "react";
import { Workbody } from "@/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface WorkbodiesStackedCardsProps {
  workbodies: Workbody[];
  isLoading?: boolean;
}

export function WorkbodiesStackedCards({ workbodies, isLoading = false }: WorkbodiesStackedCardsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Generate an abbreviation from the workbody name
  const getAbbreviation = (name: string) => {
    // Extract abbreviation from name if available in parentheses
    const match = name.match(/\(([^)]+)\)$/);
    if (match && match[1]) {
      return match[1];
    }
    
    // Create abbreviation from first letters of words
    return name
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);
  };

  // Get background color based on workbody type
  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "committee":
        return "bg-blue-50";
      case "working-group":
        return "bg-green-50";
      case "task-force":
        return "bg-amber-50";
      default:
        return "bg-gray-50";
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "committee":
        return "bg-blue-100 text-blue-800";
      case "working-group":
        return "bg-green-100 text-green-800";
      case "task-force":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleWorkbodyClick = (id: string) => {
    navigate(`/workbody/${id}`);
  };

  const getFormattedType = (type: string) => {
    switch (type) {
      case "committee":
        return "Committee";
      case "working-group":
        return "Working Group";
      case "task-force":
        return "Task Force";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="flex justify-between mt-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {workbodies.map((workbody) => {
        const abbreviation = getAbbreviation(workbody.name);
        const bgColor = getBackgroundColor(workbody.type);
        const badgeColor = getBadgeColor(workbody.type);
        const description = workbody.description || "No description available";
        const completionRate = workbody.actionsAgreed > 0 
          ? Math.round((workbody.actionsCompleted / workbody.actionsAgreed) * 100)
          : 0;
        
        return (
          <Card
            key={workbody.id}
            className={cn(
              bgColor,
              "border cursor-pointer transition-shadow hover:shadow-md",
              hoveredId === workbody.id ? "ring-2 ring-primary ring-offset-2" : ""
            )}
            onClick={() => handleWorkbodyClick(workbody.id)}
            onMouseEnter={() => setHoveredId(workbody.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center text-white font-bold",
                  workbody.type === "committee" ? "bg-blue-600" :
                  workbody.type === "working-group" ? "bg-green-600" : "bg-amber-600"
                )}>
                  {abbreviation}
                </div>
                <div>
                  <h3 className="font-medium line-clamp-1" title={workbody.name}>
                    {workbody.name}
                  </h3>
                  <Badge variant="outline" className={badgeColor}>
                    {getFormattedType(workbody.type)}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2" title={description}>
                {description}
              </p>
              
              <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                <span>{workbody.totalMeetings || 0} meetings</span>
                <span>{completionRate}% completion</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
