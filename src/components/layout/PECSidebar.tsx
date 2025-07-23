import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Bot, 
  Settings, 
  ChevronDown,
  Plus,
  Eye,
  File,
  UserCog,
  Activity
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface PECSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  title: string;
  href?: string;
  icon: any;
  children?: NavItem[];
  adminOnly?: boolean;
}

export function PECSidebar({ collapsed }: PECSidebarProps) {
  const location = useLocation();
  const { session } = useAuth();
  const [openSections, setOpenSections] = useState<string[]>(['workbodies', 'meetings']);

  const isAdmin = session?.role === 'admin' || session?.role === 'chairman';

  const navigation: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Workbodies",
      icon: Users,
      children: [
        { title: "View All", href: "/workbodies", icon: Eye },
        { title: "Add New", href: "/workbodies/management", icon: Plus },
      ],
    },
    {
      title: "Meetings",
      icon: Calendar,
      children: [
        { title: "Calendar", href: "/calendar", icon: Calendar },
        { title: "Minutes Templates", href: "/minutes/draft", icon: File },
      ],
    },
    {
      title: "AI Summaries",
      href: "/minutes/enhanced",
      icon: Bot,
    },
    {
      title: "Administration",
      icon: UserCog,
      adminOnly: true,
      children: [
        { title: "Users", href: "/admin/users", icon: Users },
        { title: "Audit Logs", href: "/admin/audit", icon: Activity },
      ],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(s => s !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    if (item.adminOnly && !isAdmin) return null;

    if (item.children) {
      const isOpen = openSections.includes(item.title.toLowerCase());
      const hasActiveChild = item.children.some(child => child.href && isActive(child.href));

      return (
        <Collapsible open={isOpen} onOpenChange={() => toggleSection(item.title.toLowerCase())}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-10",
                level > 0 && "ml-4",
                (hasActiveChild || isOpen) && "bg-muted text-primary",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.title}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          {!collapsed && (
            <CollapsibleContent className="space-y-1">
              {item.children.map((child) => (
                <NavItemComponent key={child.title} item={child} level={level + 1} />
              ))}
            </CollapsibleContent>
          )}
        </Collapsible>
      );
    }

    return (
      <NavLink to={item.href!} className="block">
        {({ isActive: navIsActive }) => (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10",
              level > 0 && "ml-4",
              (navIsActive || isActive(item.href!)) && "bg-primary/10 text-primary border-r-2 border-primary",
              collapsed && "justify-center"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="flex-1 text-left">{item.title}</span>}
          </Button>
        )}
      </NavLink>
    );
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-background/95 backdrop-blur transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo Area */}
        <div className="flex h-16 items-center border-b px-4">
          {collapsed ? (
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PEC</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">PEC Pulse</h2>
                <p className="text-xs text-muted-foreground">Management Portal</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navigation.map((item) => (
            <NavItemComponent key={item.title} item={item} />
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground text-center">
              v2.1.0
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}