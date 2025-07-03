
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workbody } from "@/types";

interface ActionCompletionChartProps {
  workbodies?: Workbody[];
  completionByType?: {
    name: string;
    agreed: number;
    completed: number;
  }[];
  completed?: number;
  total?: number;
}

export function ActionCompletionChart({ 
  workbodies = [],
  completionByType = [],
  completed = 0,
  total = 0 
}: ActionCompletionChartProps) {
  // Generate data from workbodies if provided
  let chartData = completionByType;
  
  if (workbodies.length > 0 && completionByType.length === 0) {
    const committees = workbodies.filter(wb => wb.type === 'committee');
    const workingGroups = workbodies.filter(wb => wb.type === 'working-group');
    const taskForces = workbodies.filter(wb => wb.type === 'task-force');
    
    chartData = [
      {
        name: "Committees",
        agreed: committees.reduce((sum, wb) => sum + (wb.actionsAgreed || 0), 0),
        completed: committees.reduce((sum, wb) => sum + (wb.actionsCompleted || 0), 0)
      },
      {
        name: "Working Groups",
        agreed: workingGroups.reduce((sum, wb) => sum + (wb.actionsAgreed || 0), 0),
        completed: workingGroups.reduce((sum, wb) => sum + (wb.actionsCompleted || 0), 0)
      },
      {
        name: "Task Forces",
        agreed: taskForces.reduce((sum, wb) => sum + (wb.actionsAgreed || 0), 0),
        completed: taskForces.reduce((sum, wb) => sum + (wb.actionsCompleted || 0), 0)
      }
    ];
  }
  
  // Fallback to simple data if no other data available
  if (chartData.length === 0) {
    chartData = [
      {
        name: "All Types",
        agreed: total,
        completed: completed
      }
    ];
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Actions Completion Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar name="Actions Agreed" dataKey="agreed" fill="#8884d8" />
              <Bar name="Actions Completed" dataKey="completed" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
