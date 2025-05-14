
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DataPoint[];
}

export function DonutChart({ data }: DonutChartProps) {
  // Check if data is empty
  if (!data || data.length === 0 || data.every(item => item.value === 0)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${value}`, 'Count']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
