
import { useState, useEffect } from "react";
import { Briefcase, FileText, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface CategoryFilterProps {
  committees: number;
  workingGroups: number;
  taskForces: number;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  committees,
  workingGroups,
  taskForces,
  selectedCategory,
  onCategoryChange
}: CategoryFilterProps) {
  // Keyboard shortcuts (1,2,3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "1") onCategoryChange("committees");
      if (e.key === "2") onCategoryChange("workingGroups");
      if (e.key === "3") onCategoryChange("taskForces");
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCategoryChange]);
  
  return (
    <div className="flex justify-center gap-3 sticky top-0 bg-white py-3 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onCategoryChange("committees")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                "hover:bg-blue-500/5",
                selectedCategory === "committees" 
                  ? "bg-blue-500/10 border-blue-500 text-blue-700 font-medium" 
                  : "border-gray-300"
              )}
            >
              <Briefcase size={16} />
              <span>Committees ({committees})</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Press 1 to select</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onCategoryChange("workingGroups")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                "hover:bg-amber-500/5",
                selectedCategory === "workingGroups" 
                  ? "bg-amber-500/10 border-amber-500 text-amber-700 font-medium" 
                  : "border-gray-300"
              )}
            >
              <FileText size={16} />
              <span>Working Groups ({workingGroups})</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Press 2 to select</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onCategoryChange("taskForces")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                "hover:bg-purple-500/5",
                selectedCategory === "taskForces" 
                  ? "bg-purple-500/10 border-purple-500 text-purple-700 font-medium" 
                  : "border-gray-300"
              )}
            >
              <BookOpen size={16} />
              <span>Task Forces ({taskForces})</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Press 3 to select</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
