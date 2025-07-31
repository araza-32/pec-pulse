
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";

interface WorkbodyActionData {
  type: 'committee' | 'working-group' | 'task-force';
  actionsCompleted: number;
  actionsAgreed: number;
}

interface ActionCompletionProgressProps {
  workbodies: WorkbodyActionData[];
}

export const ActionCompletionProgress = ({ workbodies }: ActionCompletionProgressProps) => {
  const calculateCompletionRate = (type: string) => {
    const filtered = workbodies.filter(w => w.type === type);
    const completed = filtered.reduce((acc, curr) => acc + curr.actionsCompleted, 0);
    const agreed = filtered.reduce((acc, curr) => acc + curr.actionsAgreed, 0);
    return agreed === 0 ? 0 : (completed / agreed) * 100;
  };

  const chartData = [
    {
      name: 'Committees',
      value: calculateCompletionRate('committee'),
      fill: '#10B981'
    },
    {
      name: 'Working Groups',
      value: calculateCompletionRate('working-group'),
      fill: '#F59E0B'
    },
    {
      name: 'Task Forces',
      value: calculateCompletionRate('task-force'),
      fill: '#3B82F6'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Completion Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="10%"
              outerRadius="80%"
              barSize={10}
              data={chartData}
            >
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff' }}
                background
                dataKey="value"
              />
              <Legend />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
