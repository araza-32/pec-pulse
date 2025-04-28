
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  onClick?: () => void;
  clickable?: boolean;
}

export function StatCard({ title, value, icon: Icon, colorClass, onClick, clickable = false }: StatCardProps) {
  const cardClasses = clickable 
    ? "transition-all hover:shadow-lg cursor-pointer transform hover:scale-105" 
    : "";

  return (
    <Card className={cardClasses} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`${colorClass} p-2 rounded-lg`}>
            <Icon className="text-white h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
