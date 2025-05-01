
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Workbody } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkbodiesOverviewProps {
  workbodies: Workbody[];
  isLoading: boolean;
}

export const WorkbodiesOverview = ({ workbodies, isLoading }: WorkbodiesOverviewProps) => {
  const [view, setView] = useState<"chart" | "table">("chart");
  
  // Count workbodies by type
  const typeDistribution = [
    { 
      name: "Committees", 
      value: workbodies.filter(w => w.type === "committee").length,
      color: "#007A33" // PEC Green
    },
    { 
      name: "Working Groups", 
      value: workbodies.filter(w => w.type === "working-group").length,
      color: "#3B82F6" // Blue
    },
    { 
      name: "Task Forces", 
      value: workbodies.filter(w => w.type === "task-force").length,
      color: "#F59E0B" // Amber
    }
  ];
  
  // Get top 5 workbodies by total meetings
  const topWorkbodies = [...workbodies]
    .sort((a, b) => (b.totalMeetings || 0) - (a.totalMeetings || 0))
    .slice(0, 5);
  
  const renderTypeDistributionChart = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><Skeleton className="h-64 w-64 rounded-full" /></div>;
    }
    
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={typeDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {typeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} workbodies`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderTopWorkbodiesTable = () => {
    if (isLoading) {
      return Array(5).fill(0).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        </TableRow>
      ));
    }
    
    return topWorkbodies.map(workbody => (
      <TableRow key={workbody.id}>
        <TableCell className="font-medium">{workbody.name}</TableCell>
        <TableCell>
          <Badge variant="outline" className={
            workbody.type === "committee" ? "border-green-500 text-green-500" :
            workbody.type === "working-group" ? "border-blue-500 text-blue-500" :
            "border-amber-500 text-amber-500"
          }>
            {workbody.type === "committee" ? "Committee" : 
             workbody.type === "working-group" ? "Working Group" : "Task Force"}
          </Badge>
        </TableCell>
        <TableCell className="text-right">{workbody.totalMeetings || 0}</TableCell>
      </TableRow>
    ));
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Workbodies Overview</CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as "chart" | "table")}>
            <TabsList className="grid w-32 grid-cols-2">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {view === "chart" ? (
          renderTypeDistributionChart()
        ) : (
          <div className="overflow-auto max-h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Meetings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTopWorkbodiesTable()}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
