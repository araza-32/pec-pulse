
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
  const total = data.committees + data.workingGroups + data.taskForces;
  
  const chartData = [
    { name: 'Committees', value: data.committees },
    { name: 'Working Groups', value: data.workingGroups },
    { name: 'Task Forces', value: data.taskForces }
  ];

  // Custom tooltip to show values and percentages
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-sm">
          <p className="font-medium">{item.name}</p>
          <p>Count: {item.value}</p>
          <p>Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend to display values and percentages
  const CustomLegend = ({ payload }: any) => {
    return (
      <ul className="flex flex-col gap-2 mt-4">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.value / total) * 100).toFixed(1);
          return (
            <li key={`item-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
                {entry.value} {entry.payload.name} ({percentage}%)
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

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
                label={({ value }) => `${value}`}
              >
                <Cell fill="#10B981" />
                <Cell fill="#F59E0B" />
                <Cell fill="#3B82F6" />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
