
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface WorkbodyDistributionProps {
  data: {
    committees: number;
    workingGroups: number;
    taskForces: number;
  };
}

export const WorkbodyDistribution = ({ data }: WorkbodyDistributionProps) => {
  const chartData = [
    { name: 'Committees', value: data.committees },
    { name: 'Working Groups', value: data.workingGroups },
    { name: 'Task Forces', value: data.taskForces }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workbody Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#10B981" />
                <Cell fill="#F59E0B" />
                <Cell fill="#3B82F6" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
