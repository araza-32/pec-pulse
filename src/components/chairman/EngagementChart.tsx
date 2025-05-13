
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface EngagementChartProps {
  data: Array<{
    month: string;
    attendance: number;
    participation: number;
    actionRate: number;
  }>;
  title?: string;
  description?: string;
}

export function EngagementChart({ 
  data, 
  title = "Engagement Analysis", 
  description = "Trends over the last 6 months" 
}: EngagementChartProps) {
  // Calculate averages for the metrics
  const averages = {
    attendance: Math.round(data.reduce((sum, item) => sum + item.attendance, 0) / data.length),
    meetingRate: Math.round(data.reduce((sum, item) => sum + item.participation, 0) / data.length),
    actionRate: Math.round(data.reduce((sum, item) => sum + item.actionRate, 0) / data.length)
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-0">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Attendance</span>
            <span className="text-xl font-bold text-green-600">{averages.attendance}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Meeting Rate</span>
            <span className="text-xl font-bold text-blue-600">{averages.meetingRate}/mo</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Action Rate</span>
            <span className="text-xl font-bold text-amber-600">{averages.actionRate}%</span>
          </div>
        </div>

        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance %"
                stroke="#10B981"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="participation"
                name="Meeting Rate"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="actionRate"
                name="Action Rate"
                stroke="#F59E0B"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
