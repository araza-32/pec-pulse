
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  onClick?: () => void;
  clickable?: boolean;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  valuePrefix?: string;
  valueSuffix?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  colorClass,
  onClick,
  clickable = false,
  description,
  trend,
  valuePrefix = "",
  valueSuffix = ""
}: StatCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (clickable) {
      // Default navigation based on title if no onClick provided
      switch (title) {
        case "Total Workbodies":
        case "Committees":
        case "Working Groups":
        case "Task Forces":
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

  // Determine gradient class based on colorClass
  const getGradientClass = () => {
    if (colorClass.includes('green') || colorClass.includes('pec-green')) return 'bg-gradient-primary';
    if (colorClass.includes('blue')) return 'bg-gradient-blue';
    if (colorClass.includes('amber') || colorClass.includes('yellow')) return 'bg-gradient-amber';
    if (colorClass.includes('purple')) return 'bg-gradient-purple';
    return colorClass;
  };

  return (
    <Card 
      className={cn(
        `${clickable ? 
          'cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-2 hover:border-accent' : 
          'transition-shadow duration-300 hover:shadow-md'} shadow-card border overflow-hidden`,
        "animate-fade-in colorful-card",
        colorClass.includes('blue') ? 'blue' : 
        colorClass.includes('amber') || colorClass.includes('yellow') ? 'amber' : 
        colorClass.includes('purple') ? 'purple' : ''
      )}
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
            <p className="text-2xl sm:text-3xl font-bold flex items-center gap-1">
              {valuePrefix && <span className="text-muted-foreground text-base">{valuePrefix}</span>}
              {value}
              {valueSuffix && <span className="text-muted-foreground text-base">{valueSuffix}</span>}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-xs font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                <span className={`mr-1 ${trend.isPositive ? 'rotate-0' : 'rotate-180'}`}>
                  ↑
                </span>
                <span>{trend.value}% {trend.isPositive ? 'increase' : 'decrease'}</span>
              </div>
            )}
          </div>
          <div className={`${getGradientClass()} p-3 rounded-lg shadow-sm`}>
            <Icon className="text-white h-5 w-5" />
          </div>
        </div>
      </div>
    </Card>
  );
}
