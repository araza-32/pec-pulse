
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MetricStatus, MetricType } from "@/hooks/usePerformanceMetrics";

interface PerformanceMetricsCardProps {
  title: string;
  metric: MetricType;
  status: MetricStatus;
  icon: React.ComponentType<{ className?: string }>;
  unit?: string;
}

export function PerformanceMetricsCard({ 
  title, 
  metric, 
  status, 
  icon: Icon, 
  unit = '' 
}: PerformanceMetricsCardProps) {
  const getStatusColor = (status: 'good' | 'warning' | 'danger') => {
    switch (status) {
      case 'good': return 'bg-green-50 text-green-700 border-green-200';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'danger': return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatValue = (value: number, metric: MetricType) => {
    if (metric === 'deliverable_quality_score') {
      return value.toFixed(1);
    }
    if (metric === 'attendance_rate' || metric === 'action_item_completion' || metric === 'doc_submission_timeliness') {
      return `${value.toFixed(1)}%`;
    }
    if (metric === 'average_decision_turnaround') {
      return `${Math.round(value)} days`;
    }
    return Math.round(value).toString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              {formatValue(status.value, metric)}
            </div>
            {getTrendIcon(status.trend)}
          </div>
          <Badge 
            variant="outline" 
            className={getStatusColor(status.status)}
          >
            {status.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
