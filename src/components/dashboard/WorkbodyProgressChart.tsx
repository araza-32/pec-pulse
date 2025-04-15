
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Workbody } from "@/types";

interface WorkbodyProgressChartProps {
  workbodies: Workbody[];
  limit?: number;
}

export function WorkbodyProgressChart({ workbodies, limit = 5 }: WorkbodyProgressChartProps) {
  // Calculate percentage of actions completed
  const data = workbodies
    .map(wb => ({
      name: wb.name,
      completion: wb.actionsAgreed > 0 
        ? Math.round((wb.actionsCompleted / wb.actionsAgreed) * 100) 
        : 0,
      type: wb.type
    }))
    .sort((a, b) => b.completion - a.completion) // Sort by completion percentage
    .slice(0, limit); // Take only top N

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'committee': return '#218042';
      case 'working-group': return '#d99e10';
      case 'task-force': return '#4e7ac7';
      default: return '#888888';
    }
  };
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Workbody Action Completion Rate (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Completion']} 
              />
              <Bar dataKey="completion">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getTypeColor(entry.type)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
