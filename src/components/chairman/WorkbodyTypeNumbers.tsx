
import { Card } from "@/components/ui/card";
import { Users, Layers, Target } from "lucide-react";

interface WorkbodyTypeNumbersProps {
  counts: {
    committees: number;
    workingGroups: number;
    taskForces: number;
  };
}

export function WorkbodyTypeNumbers({ counts }: WorkbodyTypeNumbersProps) {
  const total = counts.committees + counts.workingGroups + counts.taskForces;
  
  const calculatePercentage = (value: number): number => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };
  
  const typeItems = [
    {
      name: "Committees",
      count: counts.committees,
      percentage: calculatePercentage(counts.committees),
      icon: Users,
      color: "bg-blue-100 text-blue-700"
    },
    {
      name: "Working Groups",
      count: counts.workingGroups,
      percentage: calculatePercentage(counts.workingGroups),
      icon: Layers,
      color: "bg-amber-100 text-amber-700"
    },
    {
      name: "Task Forces",
      count: counts.taskForces,
      percentage: calculatePercentage(counts.taskForces),
      icon: Target,
      color: "bg-green-100 text-green-700"
    }
  ];

  return (
    <div className="space-y-4">
      {typeItems.map((item) => (
        <div key={item.name} className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors">
          <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
            <item.icon className="h-6 w-6" />
          </div>
          <div className="flex-grow text-left">
            <div className="text-lg font-semibold">{item.count}</div>
            <div className="text-muted-foreground">{item.name}</div>
          </div>
          <div className="text-lg font-medium">{item.percentage}%</div>
        </div>
      ))}
      
      <div className="pt-2 border-t text-left text-sm text-muted-foreground">
        <span className="font-medium">Total Workbodies:</span> {total}
      </div>
    </div>
  );
}
