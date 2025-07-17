
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarClock, CheckSquare, TrendingUp } from "lucide-react";

interface CleanDashboardContainerProps {
  workbodiesStats: {
    totalWorkbodies: number;
    meetingsThisYear: number;
    completionRate: number;
    upcomingMeetingsCount: number;
    committees: number;
    workingGroups: number;
    taskForces: number;
  };
}

export function CleanDashboardContainer({ workbodiesStats }: CleanDashboardContainerProps) {
  const stats = [
    {
      title: "Total Workbodies",
      value: workbodiesStats.totalWorkbodies,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Meetings This Year",
      value: workbodiesStats.meetingsThisYear,
      icon: CalendarClock,
      color: "text-green-600"
    },
    {
      title: "Completion Rate",
      value: `${workbodiesStats.completionRate}%`,
      icon: CheckSquare,
      color: "text-purple-600"
    },
    {
      title: "Upcoming Meetings",
      value: workbodiesStats.upcomingMeetingsCount,
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const breakdown = [
    { label: "Committees", value: workbodiesStats.committees },
    { label: "Working Groups", value: workbodiesStats.workingGroups },
    { label: "Task Forces", value: workbodiesStats.taskForces }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workbody Breakdown */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Workbody Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {breakdown.map((item) => (
              <div key={item.label} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-semibold text-gray-900 mb-1">{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
