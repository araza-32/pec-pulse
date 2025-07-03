
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Crown,
  Upload,
  FolderOpen,
  Edit
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkbodies } from "@/hooks/useWorkbodies";

interface SidebarProps {
  className?: string;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: string[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "coordination", "registrar", "member"]
  },
  {
    title: "Chairman Dashboard",
    href: "/chairman-dashboard",
    icon: Crown,
    roles: ["chairman", "admin"]
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar
  },
  {
    title: "Meeting Minutes",
    href: "/meetings/list",
    icon: FileText
  },
  {
    title: "Upload Minutes",
    href: "/upload-minutes",
    icon: Upload,
    roles: ["admin", "secretary", "chairman", "coordination"]
  },
  {
    title: "Draft Minutes",
    href: "/draft-minutes",
    icon: Edit,
    roles: ["secretary", "admin", "coordination"]
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FolderOpen
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["admin", "chairman", "coordination", "registrar"]
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings
  }
];

export function SimplifiedSidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { workbodies, isLoading } = useWorkbodies();

  const hasAccess = (roles?: string[]) => {
    if (!roles) return true;
    return user?.role && roles.includes(user.role);
  };

  const renderNavigationItem = (item: NavigationItem) => {
    if (!hasAccess(item.roles)) return null;

    const isActive = location.pathname === item.href;

    return (
      <Button
        key={item.title}
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 hover:bg-green-50 hover:text-green-700 text-sm h-10 px-3 py-2",
          "whitespace-normal text-left break-words min-h-[2.5rem]",
          isActive && "bg-green-100 text-green-800 font-medium"
        )}
        asChild
      >
        <Link to={item.href}>
          <item.icon className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left leading-tight">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {item.badge}
            </Badge>
          )}
        </Link>
      </Button>
    );
  };

  const renderWorkbodyItem = (workbody: any) => {
    const isActive = location.pathname === `/workbodies/${workbody.id}`;
    const displayText = `${workbody.name} (${workbody.code})`;
    
    return (
      <TooltipProvider key={workbody.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 hover:bg-green-50 hover:text-green-700 text-sm ml-4 px-3 py-2",
                "whitespace-normal text-left break-words min-h-[2.25rem]",
                isActive && "bg-green-100 text-green-800 font-medium"
              )}
              asChild
            >
              <Link 
                to={`/workbodies/${workbody.id}`}
                aria-label={`View ${workbody.name}`}
              >
                <Users className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <span className="flex-1 text-xs leading-tight">
                  {displayText}
                </span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p className="text-sm font-medium">{workbody.name}</p>
            <p className="text-xs text-muted-foreground">Code: {workbody.code}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className={cn("fixed left-0 top-0 z-30 h-screen w-72 bg-white border-r border-gray-200 flex flex-col", className)}>
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="w-2 h-8 bg-green-600 rounded-full flex-shrink-0"></div>
        <h2 className="text-lg font-semibold text-green-800">Navigation</h2>
      </div>
      
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <nav className="grid gap-1">
              {navigationItems.map(renderNavigationItem)}
              
              {/* Workbodies Section */}
              <div className="pt-4">
                <div className="px-2 mb-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Workbodies
                  </h3>
                </div>
                {isLoading ? (
                  <div className="ml-4 text-xs text-gray-500">Loading workbodies...</div>
                ) : (
                  <div className="space-y-1">
                    {workbodies.map(renderWorkbodyItem)}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
