import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Workbody } from "@/types/workbody";
import { ChevronRight, Users, Calendar, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface NestedWorkbodyViewProps {
  workbodies: Workbody[];
  onWorkbodyClick: (workbody: Workbody) => void;
  onEdit?: (workbody: Workbody) => void;
}

export function NestedWorkbodyView({ 
  workbodies, 
  onWorkbodyClick, 
  onEdit 
}: NestedWorkbodyViewProps) {
  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case "committee":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "working-group":
        return "bg-green-100 text-green-800 border-green-200";
      case "task-force":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderWorkbody = (workbody: Workbody, level = 0) => {
    const hasChildren = workbody.childWorkbodies && workbody.childWorkbodies.length > 0;
    const completionRate = workbody.actionsAgreed > 0 
      ? Math.round((workbody.actionsCompleted / workbody.actionsAgreed) * 100)
      : 0;

    return (
      <div key={workbody.id} className="space-y-2">
        <Card 
          className={cn(
            "transition-all duration-200 hover:shadow-md",
            level > 0 && "ml-6 border-l-4 border-l-muted"
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {level > 0 && (
                  <div className="w-4 h-px bg-muted-foreground/30" />
                )}
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {workbody.name}
                    <Badge 
                      variant="outline"
                      className={cn("text-xs", getTypeBadgeStyles(workbody.type))}
                    >
                      {workbody.type.replace("-", " ")}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {workbody.code}
                    {hasChildren && (
                      <span className="ml-2">• {workbody.childWorkbodies!.length} nested task force{workbody.childWorkbodies!.length !== 1 ? 's' : ''}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(workbody);
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onWorkbodyClick(workbody)}
                  className="text-primary"
                >
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{workbody.members?.length || 0} members</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{workbody.meetingsThisYear || 0} meetings this year</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                <span>{completionRate}% completion rate</span>
              </div>
            </div>
            
            {workbody.description && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {workbody.description}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Render nested task forces */}
        {hasChildren && (
          <div className="space-y-2">
            {workbody.childWorkbodies!.map(child => 
              renderWorkbody(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Filter to show only top-level workbodies (no parent)
  const topLevelWorkbodies = workbodies.filter(w => !w.parentId);

  return (
    <div className="space-y-4">
      {topLevelWorkbodies.map(workbody => renderWorkbody(workbody))}
    </div>
  );
}