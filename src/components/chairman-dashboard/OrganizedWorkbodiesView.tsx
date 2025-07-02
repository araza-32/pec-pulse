
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GitMerge, FileText } from "lucide-react";
import { Workbody } from "@/types";

interface OrganizedWorkbodiesViewProps {
  organizedWorkbodies: {
    committees: Workbody[];
    workingGroups: Workbody[];
    taskForces: Workbody[];
  };
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading: boolean;
}

const WorkbodyTypeSection = ({ 
  title, 
  workbodies, 
  icon: Icon, 
  colorScheme 
}: { 
  title: string; 
  workbodies: Workbody[]; 
  icon: any; 
  colorScheme: { bg: string; text: string; border: string; } 
}) => {
  if (workbodies.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-lg">{title}</h3>
        <Badge variant="outline" className="ml-2">
          {workbodies.length}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workbodies.map((workbody) => (
          <Link to={`/workbody/${workbody.id}`} key={workbody.id}>
            <Card className="hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 border-2 border-gray-100 hover:border-pec-green-200 group">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-base text-pec-green-800 line-clamp-2 group-hover:text-pec-green-600 transition-colors">
                    {workbody.name}
                  </h4>
                  <Link 
                    to={`/workbody/edit/${workbody.id}`} 
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
                    {title.slice(0, -1)} {/* Remove 's' from plural */}
                  </Badge>
                  
                  {workbody.meetingsThisYear > 0 && (
                    <Badge 
                      variant="outline" 
                      className="bg-pec-green-50 text-pec-green-700 border-pec-green-200"
                    >
                      {workbody.meetingsThisYear} meetings
                    </Badge>
                  )}
                </div>
                
                {(workbody.totalMeetings || workbody.actionsAgreed) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {workbody.totalMeetings && (
                      <div className="text-xs text-gray-500">
                        Total meetings: <span className="font-medium text-pec-green-600">{workbody.totalMeetings}</span>
                      </div>
                    )}
                    {workbody.actionsAgreed && (
                      <div className="text-xs text-gray-500 mt-1">
                        Actions: <span className="font-medium text-pec-green-600">{workbody.actionsCompleted || 0}/{workbody.actionsAgreed}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export function OrganizedWorkbodiesView({
  organizedWorkbodies,
  selectedCategory,
  onCategoryChange,
  isLoading
}: OrganizedWorkbodiesViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const typeColors = {
    committees: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-300"
    },
    workingGroups: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-300"
    },
    taskForces: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-300"
    }
  };

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'committees', label: 'Committees' },
    { key: 'workingGroups', label: 'Working Groups' },
    { key: 'taskForces', label: 'Task Forces' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Workbodies Overview</CardTitle>
          <div className="flex gap-2">
            {categories.map(category => (
              <Button
                key={category.key}
                variant="outline"
                size="sm"
                className={selectedCategory === category.key ? "bg-muted" : ""}
                onClick={() => onCategoryChange(category.key)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {selectedCategory === 'all' ? (
          <>
            <WorkbodyTypeSection
              title="Committees"
              workbodies={organizedWorkbodies.committees}
              icon={Users}
              colorScheme={typeColors.committees}
            />
            <WorkbodyTypeSection
              title="Working Groups"
              workbodies={organizedWorkbodies.workingGroups}
              icon={GitMerge}
              colorScheme={typeColors.workingGroups}
            />
            <WorkbodyTypeSection
              title="Task Forces"
              workbodies={organizedWorkbodies.taskForces}
              icon={FileText}
              colorScheme={typeColors.taskForces}
            />
          </>
        ) : (
          <WorkbodyTypeSection
            title={categories.find(c => c.key === selectedCategory)?.label || 'All'}
            workbodies={
              selectedCategory === 'committees' ? organizedWorkbodies.committees :
              selectedCategory === 'workingGroups' ? organizedWorkbodies.workingGroups :
              selectedCategory === 'taskForces' ? organizedWorkbodies.taskForces :
              []
            }
            icon={
              selectedCategory === 'committees' ? Users :
              selectedCategory === 'workingGroups' ? GitMerge :
              FileText
            }
            colorScheme={
              selectedCategory === 'committees' ? typeColors.committees :
              selectedCategory === 'workingGroups' ? typeColors.workingGroups :
              typeColors.taskForces
            }
          />
        )}
        
        {selectedCategory !== 'all' && 
         ((selectedCategory === 'committees' && organizedWorkbodies.committees.length === 0) ||
          (selectedCategory === 'workingGroups' && organizedWorkbodies.workingGroups.length === 0) ||
          (selectedCategory === 'taskForces' && organizedWorkbodies.taskForces.length === 0)) && (
          <div className="text-center p-8 text-muted-foreground">
            No {categories.find(c => c.key === selectedCategory)?.label.toLowerCase()} found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
