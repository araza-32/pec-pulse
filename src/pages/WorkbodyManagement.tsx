
import { useState } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkbodyCRUD } from "@/components/workbody/WorkbodyCRUD";
import { TaskForceExtension } from "@/components/workbody/TaskForceExtension";
import { WorkbodiesGridView } from "@/components/workbody/WorkbodiesGridView";
import { CategoryFilter } from "@/components/workbody/CategoryFilter";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Target, Scale, Cog, Crown } from "lucide-react";

export default function WorkbodyManagement() {
  const { workbodies, isLoading } = useWorkbodies();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const userRole = user?.role || 'member';
  const canManage = userRole === 'admin' || userRole === 'coordination';

  // Organize workbodies by categories with proper filtering
  const workbodyCategories = {
    executive: {
      title: "Executive",
      icon: Crown,
      workbodies: workbodies.filter(wb => 
        wb.name.toLowerCase().includes('governing') || 
        wb.name.toLowerCase().includes('management committee')
      )
    },
    regulations: {
      title: "Regulations",
      icon: Scale,
      workbodies: workbodies.filter(wb => 
        wb.name.toLowerCase().includes('enrollment') ||
        wb.name.toLowerCase().includes('enrolment') ||
        wb.name.toLowerCase().includes('engineering accreditation') ||
        wb.name.toLowerCase().includes('engineering professional development') ||
        wb.name.toLowerCase().includes('cpd policy') ||
        wb.name.toLowerCase().includes('act & byelaw') ||
        wb.name.toLowerCase().includes('quality enhancement') ||
        wb.name.toLowerCase().includes('accreditation') ||
        wb.name.toLowerCase().includes('examination') ||
        wb.name.toLowerCase().includes('engineering services')
      )
    },
    operations: {
      title: "Operations", 
      icon: Cog,
      workbodies: workbodies.filter(wb =>
        wb.name.toLowerCase().includes('wg-pecir') || 
        wb.name.toLowerCase().includes('wg-pecadm') ||
        wb.name.toLowerCase().includes('cpc') || 
        wb.name.toLowerCase().includes('central procurement') ||
        wb.name.toLowerCase().includes('special initiatives')
      )
    },
    corporateAffairs: {
      title: "Corporate Affairs",
      icon: Building,
      workbodies: workbodies.filter(wb =>
        wb.name.toLowerCase().includes('think tank') ||
        wb.name.toLowerCase().includes('wg-technical') || 
        wb.name.toLowerCase().includes('wg-psii') ||
        wb.name.toLowerCase().includes('tf-power') || 
        wb.name.toLowerCase().includes('wg-yea') ||
        wb.name.toLowerCase().includes('wg-cid') || 
        wb.name.toLowerCase().includes('wg-iald') ||
        wb.name.toLowerCase().includes('ipea') ||
        wb.name.toLowerCase().includes('young engineers') ||
        wb.name.toLowerCase().includes('corporate & industrial') ||
        wb.name.toLowerCase().includes('international affairs')
      )
    }
  };

  // Filter workbodies based on selected category
  const getFilteredWorkbodies = () => {
    if (selectedCategory === 'all') return workbodies;
    
    const categoryMap: Record<string, string> = {
      'committees': 'committee',
      'workingGroups': 'working-group', 
      'taskForces': 'task-force'
    };
    
    return workbodies.filter(wb => wb.type === categoryMap[selectedCategory]);
  };

  const counts = {
    committees: workbodies.filter(wb => wb.type === 'committee').length,
    workingGroups: workbodies.filter(wb => wb.type === 'working-group').length,
    taskForces: workbodies.filter(wb => wb.type === 'task-force').length
  };

  const handleWorkbodyClick = (id: string) => {
    navigate(`/workbody/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-lg shadow-md text-white mb-6">
        <h1 className="text-3xl font-bold mb-2">Workbody Management</h1>
        <p className="opacity-90">
          Manage and organize all committees, working groups, and task forces
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="organized">Organized View</TabsTrigger>
          {canManage && <TabsTrigger value="manage">Manage</TabsTrigger>}
          <TabsTrigger value="extensions">Extensions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CategoryFilter
            committees={counts.committees}
            workingGroups={counts.workingGroups}
            taskForces={counts.taskForces}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <Card>
            <CardHeader>
              <CardTitle>
                Workbodies {selectedCategory !== 'all' ? `(${selectedCategory})` : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WorkbodiesGridView 
                workbodies={getFilteredWorkbodies()}
                onWorkbodyClick={handleWorkbodyClick}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organized" className="space-y-6">
          {Object.entries(workbodyCategories).map(([key, category]) => (
            <Card key={key} className="mb-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <category.icon className="h-6 w-6 text-green-600" />
                  {category.title}
                  <Badge variant="secondary" className="ml-2">
                    {category.workbodies.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {category.workbodies.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No workbodies in this category
                  </p>
                ) : (
                  <WorkbodiesGridView 
                    workbodies={category.workbodies}
                    onWorkbodyClick={handleWorkbodyClick}
                    isLoading={isLoading}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {canManage && (
          <TabsContent value="manage">
            <WorkbodyCRUD userRole={userRole} />
          </TabsContent>
        )}

        <TabsContent value="extensions">
          <TaskForceExtension />
        </TabsContent>
      </Tabs>
    </div>
  );
}
