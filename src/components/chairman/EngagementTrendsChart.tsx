
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, TooltipProps } from "recharts";
import { Workbody } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EngagementTrendsChartProps {
  workbodies: Workbody[];
  isLoading: boolean;
}

// Generate real data from workbody performance metrics
const generateWorkbodyData = (workbody: Workbody) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map((month) => ({
    month,
    attendance: 75, // TODO: Add attendance_rate field to Workbody interface
    participation: 60, // TODO: Add participation metrics to Workbody interface  
    completion: ((workbody.actionsCompleted || 0) / Math.max(workbody.actionsAgreed || 1, 1)) * 100,
  }));
};

export function EngagementTrendsChart({ workbodies, isLoading }: EngagementTrendsChartProps) {
  const [selectedWorkbodyId, setSelectedWorkbodyId] = useState<string>("all");
  
  // Generate data for "All Workbodies" and individual workbodies
  const allWorkbodiesData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month) => ({
      month,
      attendance: 75, // Average attendance - TODO: Calculate from real data
      participation: 60, // Average participation - TODO: Calculate from real data
      completion: workbodies.reduce((sum, wb) => sum + (((wb.actionsCompleted || 0) / Math.max(wb.actionsAgreed || 1, 1)) * 100), 0) / Math.max(workbodies.length, 1),
    }));
  }, [workbodies]);
  
  // Generate real data for each workbody
  const workbodyEngagementData = useMemo(() => {
    const data: Record<string, any[]> = {};
    workbodies.forEach((wb) => {
      data[wb.id] = generateWorkbodyData(wb);
    });
    return data;
  }, [workbodies]);
  
  // Select the data based on the selected workbody
  const chartData = useMemo(() => {
    if (selectedWorkbodyId === "all") {
      return allWorkbodiesData;
    } else {
      return workbodyEngagementData[selectedWorkbodyId] || allWorkbodiesData;
    }
  }, [selectedWorkbodyId, allWorkbodiesData, workbodyEngagementData]);
  
  // Find the selected workbody
  const selectedWorkbody = useMemo(() => {
    return workbodies.find(wb => wb.id === selectedWorkbodyId);
  }, [selectedWorkbodyId, workbodies]);
  
  // Get metrics for tooltip and highlights
  const getMetrics = useMemo(() => {
    if (!chartData || chartData.length === 0) return { current: {}, change: {} };
    
    const firstMonth = chartData[0];
    const lastMonth = chartData[chartData.length - 1];
    
    return {
      current: {
        attendance: lastMonth.attendance,
        participation: lastMonth.participation,
        completion: lastMonth.completion,
      },
      change: {
        attendance: lastMonth.attendance - firstMonth.attendance,
        participation: lastMonth.participation - firstMonth.participation,
        completion: lastMonth.completion - firstMonth.completion,
      }
    };
  }, [chartData]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md text-xs">
          <p className="font-medium border-b pb-1 mb-1">{label}</p>
          <p className="text-emerald-600 mb-1">
            <span className="font-medium">Attendance:</span> {payload[0].value}%
          </p>
          <p className="text-blue-600 mb-1">
            <span className="font-medium">Participation:</span> {payload[1].value}%
          </p>
          <p className="text-amber-600 mb-1">
            <span className="font-medium">Action Completion:</span> {payload[2].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="space-y-1 pb-3">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Engagement Trends
            </CardTitle>
            <CardDescription>Member participation metrics</CardDescription>
          </div>
          
          <Select 
            value={selectedWorkbodyId} 
            onValueChange={setSelectedWorkbodyId}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select workbody" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workbodies</SelectItem>
              {workbodies.map(wb => (
                <SelectItem key={wb.id} value={wb.id}>{wb.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Metrics highlights */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Attendance</p>
            <div className="text-lg font-medium text-emerald-600">
              {getMetrics.current.attendance}%
              {getMetrics.change.attendance !== 0 && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "ml-1 text-xs font-normal",
                    getMetrics.change.attendance > 0 
                      ? "border-emerald-200 text-emerald-700 bg-emerald-50" 
                      : "border-rose-200 text-rose-700 bg-rose-50"
                  )}
                >
                  {getMetrics.change.attendance > 0 ? "+" : ""}
                  {getMetrics.change.attendance}%
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Participation</p>
            <div className="text-lg font-medium text-blue-600">
              {getMetrics.current.participation}%
              {getMetrics.change.participation !== 0 && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "ml-1 text-xs font-normal",
                    getMetrics.change.participation > 0 
                      ? "border-emerald-200 text-emerald-700 bg-emerald-50" 
                      : "border-rose-200 text-rose-700 bg-rose-50"
                  )}
                >
                  {getMetrics.change.participation > 0 ? "+" : ""}
                  {getMetrics.change.participation}%
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Action Rate</p>
            <div className="text-lg font-medium text-amber-600">
              {getMetrics.current.completion}%
              {getMetrics.change.completion !== 0 && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "ml-1 text-xs font-normal",
                    getMetrics.change.completion > 0 
                      ? "border-emerald-200 text-emerald-700 bg-emerald-50" 
                      : "border-rose-200 text-rose-700 bg-rose-50"
                  )}
                >
                  {getMetrics.change.completion > 0 ? "+" : ""}
                  {getMetrics.change.completion}%
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-1 text-center">
          {selectedWorkbody ? (
            <Badge variant="outline" className="text-xs">
              {selectedWorkbody.name} - {selectedWorkbody.type === 'committee' ? 'Committee' : 
                selectedWorkbody.type === 'task-force' ? 'Task Force' : 'Working Group'}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              All Workbodies - Average Metrics
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" fontSize={10} />
              <YAxis stroke="#888" fontSize={10} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                name="Attendance" 
                stroke="#10B981" 
                activeDot={{ r: 6 }} 
                strokeWidth={2}
                dot={{ r: 3 }} 
              />
              <Line 
                type="monotone" 
                dataKey="participation" 
                name="Participation" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ r: 3 }}  
              />
              <Line 
                type="monotone" 
                dataKey="completion" 
                name="Action Rate" 
                stroke="#F97316"
                strokeWidth={2} 
                dot={{ r: 3 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
