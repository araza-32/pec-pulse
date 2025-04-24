
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface WorkbodyDistributionProps {
  data: {
    committees: number;
    workingGroups: number;
    taskForces: number;
  };
}

export const WorkbodyDistribution = ({ data }: WorkbodyDistributionProps) => {
  const total = data.committees + data.workingGroups + data.taskForces || 1;
  
  const chartData = [
    { name: 'Committees', value: data.committees },
    { name: 'Working Groups', value: data.workingGroups },
    { name: 'Task Forces', value: data.taskForces }
  ].filter(item => item.value > 0);
  
  const COLORS = ['#10B981', '#F59E0B', '#3B82F6'];

  const CustomLegend = ({ payload }: any) => {
    if (!payload?.length) return null;
    
    return (
      <div className="flex flex-col gap-2 mt-4">
        {payload.map((entry: any, index: number) => {
          const dataItem = chartData.find(item => item.name === entry.value);
          const value = dataItem ? dataItem.value : 0;
          const percentage = Math.round((value / total) * 100);
          
          return (
            <div key={`item-${index}`} className="flex items-center justify-end gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
                <strong>{value}</strong> {entry.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

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
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend 
                  content={<CustomLegend />}
                  align="right"
                  verticalAlign="middle"
                  layout="vertical"
                />
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
