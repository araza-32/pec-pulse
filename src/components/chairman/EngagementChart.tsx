
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface EngagementChartProps {
  data: Array<{
    month: string;
    attendance: number;
    participation: number;
    actionRate: number;
  }>;
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <div className="w-full h-[300px]">
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
            name="Participation"
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
  );
}
