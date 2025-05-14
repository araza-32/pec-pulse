
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useAuth } from "@/contexts/AuthContext";
import { WorkbodiesStackedCards } from "@/components/chairman-dashboard/WorkbodiesStackedCards";
import { WorkbodyDistributionChart } from "@/components/chairman/WorkbodyDistributionChart";
import { WorkbodyTypeCards } from "@/components/chairman/WorkbodyTypeCards";
import { PlusCircle, List, Grid3X3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function WorkbodyManagement() {
  const { workbodies, isLoading } = useWorkbodies();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "chart" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState<"all" | "committee" | "working-group" | "task-force">("all");

  // Check if user has admin access
  const hasAdminAccess = session?.role === "admin" || session?.role === "coordination";

  // Count workbodies by type
  const committees = workbodies.filter(wb => wb.type === "committee").length;
  const workingGroups = workbodies.filter(wb => wb.type === "working-group").length;
  const taskForces = workbodies.filter(wb => wb.type === "task-force").length;
  
  // Type distribution for pie chart
  const typeDistribution = [
    { name: "Committees", value: committees, color: "#3B82F6" },
    { name: "Working Groups", value: workingGroups, color: "#10B981" },
    { name: "Task Forces", value: taskForces, color: "#F59E0B" }
  ];

  // Filter workbodies based on type and search term
  const filteredWorkbodies = workbodies.filter(wb => {
    const matchesType = activeFilter === "all" || wb.type === activeFilter;
    const matchesSearch = searchTerm === "" || 
      wb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (wb.description && wb.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Handle workbody type card click
  const handleTypeCardClick = (type: string) => {
    switch(type) {
      case "committees":
        setActiveFilter("committee");
        break;
      case "workingGroups":
        setActiveFilter("working-group");
        break;
      case "taskForces":
        setActiveFilter("task-force");
        break;
      default:
        setActiveFilter("all");
    }
  };

  // Handle workbody click to view details
  const handleWorkbodyClick = (id: string) => {
    navigate(`/workbody/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Workbodies Management</h1>
        <p className="mt-2 text-blue-100">
          Manage and monitor all committees, working groups, and task forces
        </p>
      </div>

      <WorkbodyTypeCards
        committees={committees}
        workingGroups={workingGroups}
        taskForces={taskForces}
        onCardClick={handleTypeCardClick}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Workbodies</CardTitle>
            <CardDescription>
              {filteredWorkbodies.length} workbodies found
              {activeFilter !== "all" && (
                <Badge variant="outline" className="ml-2">
                  Filtering: {activeFilter.replace("-", " ")}
                </Badge>
              )}
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                placeholder="Search workbodies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[220px]"
              />
            </div>

            <Tabs defaultValue="grid" onValueChange={(v) => setViewMode(v as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="grid"><Grid3X3 className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="chart"><PlusCircle className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="list"><List className="h-4 w-4" /></TabsTrigger>
              </TabsList>
            </Tabs>

            {hasAdminAccess && (
              <Button 
                onClick={() => navigate("/workbody/new")} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Workbody
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" && (
            <WorkbodiesStackedCards
              workbodies={filteredWorkbodies}
              isLoading={isLoading}
            />
          )}
          
          {viewMode === "chart" && (
            <div className="h-[400px] flex justify-center items-center">
              <WorkbodyDistributionChart typeDistribution={typeDistribution} />
            </div>
          )}
          
          {viewMode === "list" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Created</th>
                    <th className="text-left p-3">Members</th>
                    <th className="text-left p-3">Meetings</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkbodies.map(wb => (
                    <tr 
                      key={wb.id} 
                      className="border-b hover:bg-muted/50 cursor-pointer" 
                      onClick={() => handleWorkbodyClick(wb.id)}
                    >
                      <td className="p-3">{wb.name}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={
                          wb.type === "committee" ? "bg-blue-100 text-blue-800" :
                          wb.type === "working-group" ? "bg-green-100 text-green-800" :
                          "bg-amber-100 text-amber-800"
                        }>
                          {wb.type === "committee" ? "Committee" : 
                          wb.type === "working-group" ? "Working Group" : "Task Force"}
                        </Badge>
                      </td>
                      <td className="p-3">{new Date(wb.createdDate).toLocaleDateString()}</td>
                      <td className="p-3">{wb.members?.length || 0}</td>
                      <td className="p-3">{wb.totalMeetings || 0}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWorkbodyClick(wb.id);
                            }}
                          >
                            View
                          </Button>
                          {hasAdminAccess && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/workbody/edit/${wb.id}`);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
