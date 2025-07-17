import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { Calendar, Users, CheckCircle, Clock, FileText, Activity, TrendingUp, Bell } from "lucide-react";

export function EnhancedOverviewStats() {
  const { workbodies, isLoading } = useWorkbodies();

  if (isLoading) {
    return <div className="animate-pulse">Loading stats...</div>;
  }

  // Enhanced calculations for comprehensive metrics
  const totalMeetingsThisYear = workbodies.reduce((sum, w) => sum + (w.meetingsThisYear || 0), 0);
  const totalActions = workbodies.reduce((sum, w) => sum + (w.actionsAgreed || 0), 0);
  const completedActions = workbodies.reduce((sum, w) => sum + (w.actionsCompleted || 0), 0);
  const completionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;
  
  const stats = [
    {
      title: "Total Workbodies",
      value: workbodies.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Committees",
      value: workbodies.filter(w => w.type === 'committee').length,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Working Groups", 
      value: workbodies.filter(w => w.type === 'working-group').length,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Task Forces",
      value: workbodies.filter(w => w.type === 'task-force').length,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Meetings This Year",
      value: totalMeetingsThisYear,
      icon: Calendar,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Upcoming Meetings",
      value: 12, // This would come from scheduled meetings
      icon: Bell,
      color: "text-rose-600",
      bgColor: "bg-rose-100"
    },
    {
      title: "Recent Activities",
      value: 28, // This would come from activity logs
      icon: Activity,
      color: "text-teal-600",
      bgColor: "bg-teal-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-current">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="flex items-center text-sm text-gray-500">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span>+5.2% from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}