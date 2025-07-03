
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
  ChevronRight,
  Star
} from "lucide-react";
import { Workbody } from "@/types";
import { NestedWorkbodies } from "@/hooks/useChairmanDashboard";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NestedWorkbodiesViewProps {
  nestedWorkbodies: NestedWorkbodies;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading: boolean;
}

const WorkbodyCard = ({ workbody }: { workbody: Workbody }) => (
  <Link to={`/workbodies/${workbody.id}`}>
    <Card className="hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 border-2 border-gray-100 hover:border-pec-green-200 group">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-base text-pec-green-800 line-clamp-2 group-hover:text-pec-green-600 transition-colors">
            {workbody.name}
          </h4>
          <Link 
            to={`/workbodies/${workbody.id}/edit`} 
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
          
          {workbody.code && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs font-mono">
              {workbody.code}
            </Badge>
          )}
          
          {workbody.meetingsThisYear && workbody.meetingsThisYear > 0 && (
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
  categoryData, 
  icon: Icon, 
  colorScheme,
  isSpecialInitiatives = false,
  defaultOpen = true
}: { 
  title: string; 
  categoryData: Workbody[];
  icon: any; 
  colorScheme: { bg: string; text: string; border: string; };
  isSpecialInitiatives?: boolean;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (categoryData.length === 0) return null;

  return (
    <div className={isSpecialInitiatives ? 'bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-2 border-yellow-200' : ''}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-4 h-auto hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-6 w-6 ${isSpecialInitiatives ? 'text-yellow-600' : 'text-gray-600'}`} />
              <h3 className={`font-semibold text-lg text-left ${isSpecialInitiatives ? 'text-yellow-800' : ''}`}>
                {title}
              </h3>
              <Badge variant="outline" className="ml-2">
                {categoryData.length}
              </Badge>
            </div>
            {isOpen ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
            {categoryData.map((workbody) => (
              <WorkbodyCard key={workbody.id} workbody={workbody} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export function NestedWorkbodiesView({
  nestedWorkbodies,
  selectedCategory,
  onCategoryChange,
  isLoading
}: NestedWorkbodiesViewProps) {
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
    { key: 'operations', label: 'Operations' },
    { key: 'specialInitiatives', label: 'Special Initiatives' }
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
      <CardContent className="space-y-6">
        {selectedCategory === 'all' ? (
          <>
            {nestedWorkbodies['Executive'] && (
              <CategorySection
                title="Executive"
                categoryData={nestedWorkbodies['Executive']}
                icon={Crown}
                colorScheme={{ bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" }}
                defaultOpen={true}
              />
            )}
            {nestedWorkbodies['Operations'] && (
              <CategorySection
                title="Operations"
                categoryData={nestedWorkbodies['Operations']}
                icon={Cog}
                colorScheme={{ bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" }}
                defaultOpen={true}
              />
            )}
            {nestedWorkbodies['Special Initiatives'] && (
              <CategorySection
                title="Special Initiatives"
                categoryData={nestedWorkbodies['Special Initiatives']}
                icon={Star}
                colorScheme={{ bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" }}
                isSpecialInitiatives={true}
                defaultOpen={true}
              />
            )}
          </>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <h3 className="text-lg font-semibold mb-2">Category View</h3>
            <p>Selected category: {categories.find(c => c.key === selectedCategory)?.label}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
