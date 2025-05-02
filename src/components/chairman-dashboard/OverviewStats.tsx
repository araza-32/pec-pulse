
import { Users, CalendarClock, CheckSquare, Bell } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useNavigate } from "react-router-dom";

interface OverviewStatsProps {
  stats: {
    totalWorkbodies: number;
    activeMeetings: number;
    completionRate: number;
    upcomingDeadlines: number;
  };
}

export const OverviewStats = ({ stats }: OverviewStatsProps) => {
  const navigate = useNavigate();
  
  const handleClick = (type: string) => {
    switch (type) {
      case 'totalWorkbodies':
        navigate('/workbodies/list');
        break;
      case 'activeMeetings':
        navigate('/meetings/year');
        break;
      case 'completionRate':
        navigate('/reports');
        break;
      case 'upcomingDeadlines':
        navigate('/calendar');
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      <StatCard
        title="Total Workbodies"
        value={stats.totalWorkbodies}
        icon={Users}
        colorClass="bg-pec-green"
        clickable={true}
        onClick={() => handleClick('totalWorkbodies')}
      />
      <StatCard
        title="Active Meetings"
        value={stats.activeMeetings}
        icon={CalendarClock}
        colorClass="bg-amber-500"
        clickable={true}
        onClick={() => handleClick('activeMeetings')}
      />
      <StatCard
        title="Action Completion"
        value={`${stats.completionRate}%`}
        icon={CheckSquare}
        colorClass="bg-blue-500"
        clickable={true}
        onClick={() => handleClick('completionRate')}
      />
      <StatCard
        title="Upcoming Deadlines"
        value={stats.upcomingDeadlines}
        icon={Bell}
        colorClass={stats.upcomingDeadlines > 0 ? "bg-red-500" : "bg-green-500"}
        clickable={true}
        onClick={() => handleClick('upcomingDeadlines')}
      />
    </div>
  );
};
