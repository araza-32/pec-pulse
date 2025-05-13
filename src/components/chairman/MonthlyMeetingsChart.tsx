
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MonthlyMeetingsChartProps {
  monthlyMeetings?: {
    month: string;
    meetings: number;
  }[];
  timeframe?: "month" | "quarter" | "year";
  setTimeframe?: (timeframe: "month" | "quarter" | "year") => void;
  currentYear?: number;
}

export function MonthlyMeetingsChart({ 
  monthlyMeetings = [], 
  timeframe = "month", 
  setTimeframe = () => {},
  currentYear = new Date().getFullYear()
}: MonthlyMeetingsChartProps) {
  const handleTimeframeChange = (newTimeframe: "month" | "quarter" | "year") => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">
            Monthly Meetings in {currentYear}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={timeframe === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeframeChange("month")}
            >
              Month
            </Button>
            <Button
              variant={timeframe === "quarter" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeframeChange("quarter")}
            >
              Quarter
            </Button>
            <Button
              variant={timeframe === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeframeChange("year")}
            >
              Year
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyMeetings}
                margin={{
                  top: 20,
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
                <Bar name="Meetings" dataKey="meetings" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
