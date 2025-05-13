
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { ArrowUpRight } from "lucide-react";

interface WorkBodyCardProps {
  id: string;
  abbreviation: string;
  name: string;
  meetingsYtd: number;
  actionsClosed: number;
  progressPercent: number; // 0-100
  onClick: () => void;
  type: "committee" | "working-group" | "task-force";
}

export function WorkBodyCard({
  id,
  abbreviation,
  name,
  meetingsYtd,
  actionsClosed,
  progressPercent,
  onClick,
  type
}: WorkBodyCardProps) {
  // Determine progress badge color
  const getProgressBadgeClass = () => {
    if (progressPercent >= 75) return "bg-emerald-100 text-emerald-600";
    if (progressPercent >= 40) return "bg-amber-100 text-amber-600";
    return "bg-rose-100 text-rose-600";
  };
  
  // Determine progress status for screen readers
  const getProgressStatus = () => {
    if (progressPercent >= 75) return "success";
    if (progressPercent >= 40) return "caution";
    return "danger";
  };
  
  // Determine border color based on workbody type
  const getBorderColor = () => {
    switch (type) {
      case "committee": return "border-blue-300 hover:border-blue-500";
      case "working-group": return "border-amber-300 hover:border-amber-500";
      case "task-force": return "border-purple-300 hover:border-purple-500";
      default: return "border-gray-300";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            role="gridcell"
            className={cn(
              "w-full text-left transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "hover:scale-[1.02]"
            )}
            onClick={onClick}
          >
            <Card className={cn(
              "border-2 overflow-hidden shadow-sm hover:shadow-md transition-all",
              getBorderColor()
            )}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-lg">{abbreviation}</div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-sm font-medium flex items-center",
                    getProgressBadgeClass()
                  )}>
                    <span>{progressPercent}%</span>
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                    <span className="sr-only">Progress: {getProgressStatus()}</span>
                  </div>
                </div>
                
                <div className="mt-1 text-sm font-medium text-gray-700">{name}</div>
                
                <div className="mt-3 grid grid-cols-2 gap-x-2 text-sm">
                  <div className="text-gray-600">Meetings YTD:</div>
                  <div className="font-medium text-right">{meetingsYtd}</div>
                  
                  <div className="text-gray-600">Actions closed:</div>
                  <div className="font-medium text-right">{actionsClosed}%</div>
                </div>
              </CardContent>
            </Card>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Click for details (⏎)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
