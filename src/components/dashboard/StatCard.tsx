
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  onClick?: () => void;
  clickable?: boolean;
}

export function StatCard({ title, value, icon: Icon, colorClass, onClick, clickable = false }: StatCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (clickable) {
      // Default navigation based on title if no onClick provided
      switch (title) {
        case "Total Workbodies":
          navigate("/workbodies/list");
          break;
        case "Meetings This Year":
          navigate("/meetings/year");
          break;
        case "Action Completion Rate":
        case "Action Completion":
          navigate("/reports");
          break;
        case "Upcoming Meetings":
          navigate("/calendar");
          break;
        default:
          // No default navigation
          break;
      }
    }
  };

  return (
    <Card 
      className={`${clickable ? 
        'cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover border-2 hover:border-gray-300' : 
        'transition-shadow duration-300 hover:shadow-card'} shadow-card border overflow-hidden`}
      onClick={clickable ? handleClick : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold">{value}</p>
          </div>
          <div className={`${colorClass} p-3 rounded-lg`}>
            <Icon className="text-white h-5 w-5" />
          </div>
        </div>
      </div>
    </Card>
  );
}
