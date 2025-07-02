
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { ScheduledMeeting, Workbody } from "@/types";
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, isWithinInterval } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PerformanceMetricsCard } from "./PerformanceMetricsCard";
import { usePerformanceMetrics, TimePeriod, MetricType } from "@/hooks/usePerformanceMetrics";
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Award, 
  BarChart3, 
  UserMinus, 
  GitMerge 
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PerformanceMetricsProps {
  workbodies: Workbody[];
  meetings: ScheduledMeeting[];
  timeFilter: TimePeriod;
  isLoading: boolean;
}

export const PerformanceMetrics = ({ 
  workbodies, 
  meetings, 
  timeFilter, 
  isLoading 
}: PerformanceMetricsProps) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('attendance_rate');
  const { 
    workbodies: performanceWorkbodies, 
    getTopPerformers, 
    getAlerts,
    isLoading: metricsLoading 
  } = usePerformanceMetrics(timeFilter);

  const metricIcons = {
    attendance_rate: Users,
    action_item_completion: CheckCircle,
    doc_submission_timeliness: FileText,
    deliverable_quality_score: Award,
    average_decision_turnaround: Clock,
    meetings_held: Calendar,
    member_turnover: UserMinus,
    recommendations_issued: BarChart3,
    cross_workbody_collaborations: GitMerge
  };

  const metricTitles = {
    attendance_rate: 'Attendance Rate',
    action_item_completion: 'Action Completion',
    doc_submission_timeliness: 'Doc Timeliness',  
    deliverable_quality_score: 'Quality Score',
    average_decision_turnaround: 'Decision Time',
    meetings_held: 'Meetings Held',
    member_turnover: 'Member Turnover',
    recommendations_issued: 'Recommendations',
    cross_workbody_collaborations: 'Collaborations'
  };

  // Calculate overall metrics from all workbodies
  const calculateOverallMetrics = () => {
    if (performanceWorkbodies.length === 0) return {};
    
    const metrics: Record<MetricType, number> = {
      attendance_rate: 0,
      action_item_completion: 0,
      doc_submission_timeliness: 0,
      deliverable_quality_score: 0,
      average_decision_turnaround: 0,
      meetings_held: 0,
      member_turnover: 0,
      recommendations_issued: 0,
      cross_workbody_collaborations: 0
    };

    performanceWorkbodies.forEach(wb => {
      Object.keys(metrics).forEach(key => {
        metrics[key as MetricType] += wb.performanceMetrics[key as MetricType].value;
      });
    });

    // Calculate averages
    Object.keys(metrics).forEach(key => {
      metrics[key as MetricType] = metrics[key as MetricType] / performanceWorkbodies.length;
    });

    return metrics;
  };

  const overallMetrics = calculateOverallMetrics();
  const topPerformers = getTopPerformers(selectedMetric);
  const alerts = getAlerts();

  if (isLoading || metricsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(overallMetrics).slice(0, 6).map(([metric, value]) => {
          const metricType = metric as MetricType;
          const status = { value, status: 'good' as const, trend: 'stable' as const };
          
          return (
            <PerformanceMetricsCard
              key={metric}
              title={metricTitles[metricType]}
              metric={metricType}
              status={status}
              icon={metricIcons[metricType]}
            />
          );
        })}
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Performance Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <span className="font-medium">{alert.workbody.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {metricTitles[alert.metric]}: {alert.status.value}
                    </span>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Performers Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Top Performers</CardTitle>
            <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as MetricType)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(metricTitles).map(([key, title]) => (
                  <SelectItem key={key} value={key}>{title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workbody</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">{metricTitles[selectedMetric]}</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPerformers.map((workbody) => {
                const metric = workbody.performanceMetrics[selectedMetric];
                return (
                  <TableRow key={workbody.id}>
                    <TableCell className="font-medium">{workbody.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        workbody.type === "committee" ? "border-green-500 text-green-500" :
                        workbody.type === "working-group" ? "border-blue-500 text-blue-500" :
                        "border-amber-500 text-amber-500"
                      }>
                        {workbody.type === "committee" ? "Committee" : 
                         workbody.type === "working-group" ? "Working Group" : "Task Force"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{metric.value.toFixed(1)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={
                        metric.status === 'good' ? 'default' :
                        metric.status === 'warning' ? 'secondary' : 'destructive'
                      }>
                        {metric.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
