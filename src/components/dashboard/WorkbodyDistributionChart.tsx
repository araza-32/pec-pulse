
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, ResponsiveContainer, Pie, Cell, Tooltip, Legend } from "recharts";

interface WorkbodyDistributionChartProps {
  data: {
    committees: number;
    workingGroups: number;
    taskForces: number;
  };
}

export function WorkbodyDistributionChart({ data }: WorkbodyDistributionChartProps) {
  const chartData = [
    { name: 'Committees', value: data.committees, color: '#4CAF50' },
    { name: 'Working Groups', value: data.workingGroups, color: '#F59E0B' },
    { name: 'Task Forces', value: data.taskForces, color: '#3B82F6' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Workbody Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} workbodies`, '']}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
