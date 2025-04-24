
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
  const total = data.committees + data.workingGroups + data.taskForces || 1; // Prevent division by zero
  
  const chartData = [
    { name: 'Committees', value: data.committees },
    { name: 'Working Groups', value: data.workingGroups },
    { name: 'Task Forces', value: data.taskForces }
  ].filter(item => item.value > 0); // Only include items with values
  
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
    if (!payload || payload.length === 0) return null;
    
    return (
      <ul className="flex flex-col gap-2 mt-4">
        {payload.map((entry: any, index: number) => {
          // Use entry.value from chartData
          const dataItem = chartData.find(item => item.name === entry.value);
          const value = dataItem ? dataItem.value : 0;
          const percentage = ((value / total) * 100).toFixed(1);
          
          return (
            <li key={`item-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
                {value} {entry.value} ({percentage}%)
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  // Colors for each segment
  const COLORS = ['#10B981', '#F59E0B', '#3B82F6'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workbody Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
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
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No workbody data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
