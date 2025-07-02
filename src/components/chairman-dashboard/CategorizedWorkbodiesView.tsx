import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Crown, 
  Scale, 
  Cog, 
  Building, 
  Users, 
  GitMerge, 
  FileText,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Workbody } from "@/types";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CategorizedWorkbodiesViewProps {
  categorizedWorkbodies: {
    executive: Workbody[];
    regulations: Workbody[];
    operations: Workbody[];
    corporateAffairs: Workbody[];
  };
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading: boolean;
}

const WorkbodyCard = ({ workbody }: { workbody: Workbody }) => (
  <Link to={`/workbody/${workbody.id}`}>
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
            className={
              workbody.type === "committee" ? "bg-blue-100 text-blue-700 border-blue-300" :
              workbody.type === "working-group" ? "bg-green-100 text-green-700 border-green-300" :
              "bg-amber-100 text-amber-700 border-amber-300"
            }
          >
            {workbody.type === "committee" ? "Committee" : 
             workbody.type === "working-group" ? "Working Group" : "Task Force"}
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
);

const CategorySection = ({ 
  title, 
  workbodies, 
  icon: Icon, 
  colorScheme,
  defaultOpen = false
}: { 
  title: string; 
  workbodies: Workbody[]; 
  icon: any; 
  colorScheme: { bg: string; text: string; border: string; };
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (workbodies.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between p-4 h-auto hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-gray-600" />
            <h3 className="font-semibold text-lg text-left">{title}</h3>
            <Badge variant="outline" className="ml-2">
              {workbodies.length}
            </Badge>
          </div>
          {isOpen ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workbodies.map((workbody) => (
            <WorkbodyCard key={workbody.id} workbody={workbody} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export function CategorizedWorkbodiesView({
  categorizedWorkbodies,
  selectedCategory,
  onCategoryChange,
  isLoading
}: CategorizedWorkbodiesViewProps) {
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

  const categories = [
    { key: 'all', label: 'All Categories' },
    { key: 'executive', label: 'Executive' },
    { key: 'regulations', label: 'Regulations' },
    { key: 'operations', label: 'Operations' },
    { key: 'corporateAffairs', label: 'Corporate Affairs' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Workbodies by Category</CardTitle>
          <div className="flex gap-2 flex-wrap">
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
      <CardContent className="space-y-4">
        {selectedCategory === 'all' ? (
          <>
            <CategorySection
              title="Executive"
              workbodies={categorizedWorkbodies.executive}
              icon={Crown}
              colorScheme={{ bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" }}
              defaultOpen={true}
            />
            <CategorySection
              title="Regulations"
              workbodies={categorizedWorkbodies.regulations}
              icon={Scale}
              colorScheme={{ bg: "bg-red-100", text: "text-red-700", border: "border-red-300" }}
              defaultOpen={true}
            />
            <CategorySection
              title="Operations"
              workbodies={categorizedWorkbodies.operations}
              icon={Cog}
              colorScheme={{ bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" }}
              defaultOpen={true}
            />
            <CategorySection
              title="Corporate Affairs"
              workbodies={categorizedWorkbodies.corporateAffairs}
              icon={Building}
              colorScheme={{ bg: "bg-green-100", text: "text-green-700", border: "border-green-300" }}
              defaultOpen={true}
            />
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCategory === 'executive' && categorizedWorkbodies.executive.map(workbody => (
              <WorkbodyCard key={workbody.id} workbody={workbody} />
            ))}
            {selectedCategory === 'regulations' && categorizedWorkbodies.regulations.map(workbody => (
              <WorkbodyCard key={workbody.id} workbody={workbody} />
            ))}
            {selectedCategory === 'operations' && categorizedWorkbodies.operations.map(workbody => (
              <WorkbodyCard key={workbody.id} workbody={workbody} />
            ))}
            {selectedCategory === 'corporateAffairs' && categorizedWorkbodies.corporateAffairs.map(workbody => (
              <WorkbodyCard key={workbody.id} workbody={workbody} />
            ))}
          </div>
        )}
        
        {selectedCategory !== 'all' && (
          (selectedCategory === 'executive' && categorizedWorkbodies.executive.length === 0) ||
          (selectedCategory === 'regulations' && categorizedWorkbodies.regulations.length === 0) ||
          (selectedCategory === 'operations' && categorizedWorkbodies.operations.length === 0) ||
          (selectedCategory === 'corporateAffairs' && categorizedWorkbodies.corporateAffairs.length === 0)
        ) && (
          <div className="text-center p-8 text-muted-foreground">
            No workbodies found in {categories.find(c => c.key === selectedCategory)?.label.toLowerCase()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
