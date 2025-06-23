import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Crown,
  Upload,
  FolderOpen,
  Edit,
  UserCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  className?: string;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: string[];
  children?: NavigationItem[];
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
    title: "Workbodies",
    href: "/workbodies",
    icon: Users,
    children: [
      {
        title: "All Workbodies",
        href: "/workbodies",
        icon: Users
      },
      {
        title: "Committees",
        href: "/workbodies/committees",
        icon: Users
      },
      {
        title: "Working Groups",
        href: "/workbodies/working-groups",
        icon: Users
      },
      {
        title: "Task Forces",
        href: "/workbodies/task-forces",
        icon: Users
      }
    ]
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar
  },
  {
    title: "Meeting Minutes",
    href: "/meetings/list",
    icon: FileText,
    children: [
      {
        title: "View Minutes",
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
        roles: ["secretary"]
      }
    ]
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

export function NewSidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setOpenItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const hasAccess = (roles?: string[]) => {
    if (!roles) return true;
    return user?.role && roles.includes(user.role);
  };

  const renderNavigationItem = (item: NavigationItem, depth = 0) => {
    if (!hasAccess(item.roles)) return null;

    const isActive = location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems.includes(item.title);
    const hasActiveChild = item.children?.some(child => location.pathname === child.href);

    if (hasChildren) {
      return (
        <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 hover:bg-green-50 hover:text-green-700",
                depth > 0 && "ml-4 w-[calc(100%-1rem)]",
                (isActive || hasActiveChild) && "bg-green-100 text-green-800 font-medium"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children?.map(child => renderNavigationItem(child, depth + 1))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.title}
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 hover:bg-green-50 hover:text-green-700",
          depth > 0 && "ml-4 w-[calc(100%-1rem)]",
          isActive && "bg-green-100 text-green-800 font-medium"
        )}
        asChild
      >
        <Link to={item.href}>
          <item.icon className="h-4 w-4" />
          <span className="flex-1 text-left">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      </Button>
    );
  };

  return (
    <div className={cn("pb-12 min-h-screen bg-gradient-to-b from-white to-green-50/30", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-4 mb-4">
            <div className="w-2 h-8 bg-green-600 rounded-full"></div>
            <h2 className="text-lg font-semibold text-green-800">Navigation</h2>
          </div>
          <div className="space-y-1">
            <nav className="grid gap-1">
              {navigationItems.map(item => renderNavigationItem(item))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
