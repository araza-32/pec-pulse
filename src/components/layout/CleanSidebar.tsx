
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Crown,
  Upload,
  FolderOpen
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  className?: string;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "coordination", "registrar", "member", "chairman", "secretary"]
  },
  {
    title: "Chairman Dashboard",
    href: "/chairman-dashboard",
    icon: Crown,
    roles: ["chairman", "admin"]
  },
  {
    title: "Workbodies",
    href: "/workbodies",
    icon: Users
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

export function CleanSidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const hasAccess = (roles?: string[]) => {
    if (!roles) return true;
    return user?.role && roles.includes(user.role);
  };

  const filteredItems = navigationItems.filter(item => hasAccess(item.roles));

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
        <div className="w-3 h-8 bg-green-600 rounded-full"></div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">PEC</h2>
          <p className="text-sm text-gray-500">Dashboard</p>
        </div>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Button
                key={item.title}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-12 px-4 text-left font-normal",
                  "hover:bg-green-50 hover:text-green-700",
                  isActive && "bg-green-100 text-green-800 font-medium"
                )}
                asChild
              >
                <Link to={item.href}>
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {user?.name && (
            <p>Logged in as <span className="font-medium">{user.name}</span></p>
          )}
        </div>
      </div>
    </div>
  );
}
