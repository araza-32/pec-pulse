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
  Activity,
  Crown,
  Upload,
  FolderOpen,
  BarChart3,
  Edit,
  Building,
  Briefcase,
  Target,
  Scale,
  Shield,
  Cog,
  UserPlus,
  ClipboardList,
  BookOpen
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
  const [openSections, setOpenSections] = useState<string[]>(['workbodies', 'meetings', 'minutes']);

  const isAdmin = session?.role === 'admin';
  const isChairman = session?.role === 'chairman';
  const isCoordination = session?.role === 'coordination';
  const isSecretary = session?.role === 'secretary';
  const isRegistrar = session?.role === 'registrar';
  
  const hasManagementAccess = isAdmin || isCoordination || isChairman;
  const hasReportsAccess = isAdmin || isChairman || isCoordination || isRegistrar;
  const hasMinutesUpload = isAdmin || isSecretary || isChairman || isCoordination;

  const navigation: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Chairman Dashboard",
      href: "/chairman-dashboard",
      icon: Crown,
      adminOnly: isChairman || isAdmin || isCoordination,
    },
    {
      title: "Workbodies",
      icon: Users,
      children: [
        { title: "View All", href: "/workbodies", icon: Eye },
        { title: "Overview", href: "/workbodies/overview", icon: ClipboardList },
        ...(hasManagementAccess ? [
          { title: "Management", href: "/workbodies/management", icon: Plus },
        ] : []),
      ],
    },
    {
      title: "Meetings",
      icon: Calendar,
      children: [
        { title: "Calendar", href: "/calendar", icon: Calendar },
        { title: "Scheduled Meetings", href: "/meetings", icon: ClipboardList },
      ],
    },
    {
      title: "Minutes",
      icon: FileText,
      children: [
        { title: "View Minutes", href: "/minutes", icon: BookOpen },
        { title: "AI Enhanced", href: "/minutes/enhanced", icon: Bot },
        ...(hasMinutesUpload ? [
          { title: "Upload Minutes", href: "/minutes/upload", icon: Upload },
        ] : []),
        ...(isSecretary || isAdmin || isCoordination ? [
          { title: "Draft Minutes", href: "/minutes/draft", icon: Edit },
        ] : []),
      ],
    },
    {
      title: "Documents",
      href: "/documents",
      icon: FolderOpen,
    },
    ...(hasReportsAccess ? [{
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
    }] : []),
    ...(isAdmin ? [{
      title: "Administration",
      icon: UserCog,
      adminOnly: true,
      children: [
        { title: "Users", href: "/admin/users", icon: Users },
        { title: "Audit Logs", href: "/admin/audit", icon: Activity },
      ],
    }] : []),
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ].filter(Boolean) as NavItem[];

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
    if (item.adminOnly && !hasManagementAccess) return null;

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
            <div className="mx-auto">
              <img 
                src="/lovable-uploads/d4de5e78-8184-4eee-8353-5838044f5ef8.png" 
                alt="PEC Pulse Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center relative overflow-hidden hidden">
                <span className="text-primary-foreground font-bold text-xs">P</span>
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-accent rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/d4de5e78-8184-4eee-8353-5838044f5ef8.png" 
                alt="PEC Pulse Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center relative overflow-hidden hidden">
                <span className="text-primary-foreground font-bold text-sm">PEC</span>
                <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></div>
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">PEC Pulse</h2>
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