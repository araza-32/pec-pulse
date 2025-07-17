
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  CheckSquare, 
  AlertTriangle,
  Clock,
  FileText
} from 'lucide-react';

interface DetailedAnalyticsProps {
  workbodiesStats: {
    totalWorkbodies: number;
    committees: number;
    workingGroups: number;
    taskForces: number;
    meetingsThisYear: number;
    completionRate: number;
    upcomingMeetingsCount: number;
    actionsCompleted: number;
    actionsAgreed: number;
    overdueActions: number;
  };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function DetailedAnalytics({ workbodiesStats }: DetailedAnalyticsProps) {
  // Mock detailed data - in real implementation, this would come from Supabase
  const performanceData = [
    { month: 'Jan', meetings: 45, completion: 78, actions: 156 },
    { month: 'Feb', meetings: 52, completion: 82, actions: 174 },
    { month: 'Mar', meetings: 48, completion: 75, actions: 162 },
    { month: 'Apr', meetings: 61, completion: 85, actions: 203 },
    { month: 'May', meetings: 55, completion: 88, actions: 189 },
    { month: 'Jun', meetings: 58, completion: 91, actions: 215 }
  ];

  const workbodyDistribution = [
    { name: 'Committees', value: workbodiesStats.committees, color: '#3B82F6' },
    { name: 'Working Groups', value: workbodiesStats.workingGroups, color: '#10B981' },
    { name: 'Task Forces', value: workbodiesStats.taskForces, color: '#F59E0B' }
  ];

  const topWorkbodies = [
    { name: 'Engineering Standards Committee', meetings: 24, completion: 95, trend: 'up' },
    { name: 'Professional Development WG', meetings: 18, completion: 92, trend: 'up' },
    { name: 'Digital Transformation TF', meetings: 16, completion: 88, trend: 'up' },
    { name: 'Ethics Review Committee', meetings: 22, completion: 85, trend: 'down' },
    { name: 'Research & Innovation WG', meetings: 14, completion: 82, trend: 'up' }
  ];

  const kpiCards = [
    {
      title: 'Meeting Efficiency',
      value: '87%',
      change: '+5%',
      trend: 'up',
      icon: Clock,
      description: 'Average meeting completion rate'
    },
    {
      title: 'Document Processing',
      value: '156',
      change: '+12',
      trend: 'up',
      icon: FileText,
      description: 'Documents processed this month'
    },
    {
      title: 'Member Engagement',
      value: '92%',
      change: '+3%',
      trend: 'up',
      icon: Users,
      description: 'Average attendance rate'
    },
    {
      title: 'Action Follow-up',
      value: '74%',
      change: '-2%',
      trend: 'down',
      icon: CheckSquare,
      description: 'Actions completed on time'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-semibold">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <kpi.icon className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="meetings" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Meetings"
                />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Completion %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Workbody Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Workbody Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workbodyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {workbodyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Workbodies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topWorkbodies.map((workbody, index) => (
              <div key={workbody.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{workbody.name}</p>
                    <p className="text-sm text-gray-600">{workbody.meetings} meetings held</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold">{workbody.completion}%</p>
                    <p className="text-xs text-gray-500">completion</p>
                  </div>
                  {workbody.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items Status */}
      <Card>
        <CardHeader>
          <CardTitle>Action Items Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm text-gray-600">{workbodiesStats.actionsCompleted}</span>
              </div>
              <Progress value={(workbodiesStats.actionsCompleted / workbodiesStats.actionsAgreed) * 100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">In Progress</span>
                <span className="text-sm text-gray-600">
                  {workbodiesStats.actionsAgreed - workbodiesStats.actionsCompleted - workbodiesStats.overdueActions}
                </span>
              </div>
              <Progress 
                value={((workbodiesStats.actionsAgreed - workbodiesStats.actionsCompleted - workbodiesStats.overdueActions) / workbodiesStats.actionsAgreed) * 100} 
                className="[&>div]:bg-yellow-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Overdue</span>
                <span className="text-sm text-gray-600">{workbodiesStats.overdueActions}</span>
              </div>
              <Progress 
                value={(workbodiesStats.overdueActions / workbodiesStats.actionsAgreed) * 100} 
                className="[&>div]:bg-red-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
