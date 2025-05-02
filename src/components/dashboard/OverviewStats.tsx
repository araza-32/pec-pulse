
import { Users, CalendarClock, CheckSquare, BookOpen } from "lucide-react";
import { StatCard } from "./StatCard";
import { useNavigate } from "react-router-dom";

interface OverviewStatsProps {
  stats: {
    totalWorkbodies: number;
    meetingsThisYear: number;
    completionRate: number;
    upcomingMeetingsCount: number;
  };
  onStatClick?: (statType: string) => void;
}

export const OverviewStats = ({ stats, onStatClick }: OverviewStatsProps) => {
  const navigate = useNavigate();

  const handleClick = (statType: string) => {
    // Handle navigation based on stat type
    switch (statType) {
      case 'totalWorkbodies':
        navigate('/workbodies/list');
        break;
      case 'meetingsThisYear':
        navigate('/meetings/year');
        break;
      case 'upcomingMeetings':
        navigate('/calendar');
        break;
      case 'actionCompletion':
        navigate('/reports');
        break;
      default:
        // For Dialog-based stats, use the original handler
        if (onStatClick) {
          onStatClick(statType);
        }
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      <StatCard
        title="Total Workbodies"
        value={stats.totalWorkbodies}
        icon={Users}
        colorClass="bg-pec-green"
        onClick={() => handleClick('totalWorkbodies')}
        clickable={true}
      />
      <StatCard
        title="Meetings This Year"
        value={stats.meetingsThisYear}
        icon={CalendarClock}
        colorClass="bg-amber-500"
        onClick={() => handleClick('meetingsThisYear')}
        clickable={true}
      />
      <StatCard
        title="Action Completion"
        value={`${stats.completionRate}%`}
        icon={CheckSquare}
        colorClass="bg-blue-500"
        onClick={() => handleClick('actionCompletion')}
        clickable={true}
      />
      <StatCard
        title="Upcoming Meetings"
        value={stats.upcomingMeetingsCount}
        icon={BookOpen}
        colorClass="bg-purple-500"
        onClick={() => handleClick('upcomingMeetings')}
        clickable={true}
      />
    </div>
  );
};
