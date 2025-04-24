
import React from 'react';
import { NavLink } from "react-router-dom";
import { Users, GitMerge, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface WorkbodyGroupProps {
  title: string;
  items: any[];
  icon: string;
}

export const WorkbodyGroup = ({ title, items, icon }: WorkbodyGroupProps) => {
  // Select the appropriate icon component based on the passed string
  const IconComponent = () => {
    switch (icon) {
      case 'Users':
        return <Users className="h-4 w-4" />;
      case 'GitMerge':
        return <GitMerge className="h-4 w-4" />;
      case 'FileText':
        return <FileText className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-pec-green-50">
        <div className="flex items-center gap-3">
          <IconComponent />
          <span>{title}</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-9 mt-1">
        {items.map(item => (
          <NavLink
            key={item.id}
            to={`/workbodies/${item.id}`}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-pec-green text-white"
                  : "hover:bg-pec-green-50"
              )
            }
          >
            {item.name}
          </NavLink>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
