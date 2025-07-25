
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
  Building,
  Briefcase,
  Cog,
  Target,
  Scale,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  className?: string;
}

interface NavigationItem {
  title: string;
  href?: string; // Made optional for parent categories
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: string[];
  children?: NavigationItem[];
}

// Workbody categories based on the organizational chart with proper filtering
const workbodyCategories = [
  {
    title: "Executive",
    icon: Crown,
    children: [
      {
        title: "Governing Body",
        href: "/workbodies/governing-body",
        icon: Building
      },
      {
        title: "Management Committee",
        href: "/workbodies/management-committee",
        icon: Users
      }
    ]
  },
  {
    title: "Regulations",
    icon: Scale,
    children: [
      {
        title: "EC (Examination Committee)",
        href: "/workbodies/ec",
        icon: FileText
      },
      {
        title: "ESC (Engineering Services Committee)",
        href: "/workbodies/esc",
        icon: Cog
      },
      {
        title: "EAB (Engineering Accreditation Board)",
        href: "/workbodies/eab",
        icon: Shield
      },
      {
        title: "EPDC (Engineering Practices & Development Committee)",
        href: "/workbodies/epdc",
        icon: Target
      },
      {
        title: "TF-CPD Policy Revision",
        href: "/workbodies/tf-cpd-policy",
        icon: Edit
      },
      {
        title: "A&BC (Appeals & Bylaws Committee)",
        href: "/workbodies/abc",
        icon: BarChart3
      },
      {
        title: "QEC (Quality Enhancement Committee)",
        href: "/workbodies/qec",
        icon: Settings
      }
    ]
  },
  {
    title: "Operations",
    icon: Cog,
    children: [
      {
        title: "WG-PECIR (Working Group - PEC Information Repository)",
        href: "/workbodies/wg-pecir",
        icon: Users
      },
      {
        title: "WG-PECADM (Working Group - PEC Administration)",
        href: "/workbodies/wg-pecadm",
        icon: Users
      },
      {
        title: "CPC (Central Procurement Committee)",
        href: "/workbodies/cpc",
        icon: Briefcase
      },
      {
        title: "Special Initiatives",
        href: "/workbodies/special-initiatives",
        icon: Target
      }
    ]
  },
  {
    title: "Corporate Affairs",
    icon: Building,
    children: [
      {
        title: "Think Tank",
        href: "/workbodies/think-tank",
        icon: Users
      },
      {
        title: "WG-Technical Codes & Standards",
        href: "/workbodies/wg-technical-codes",
        icon: FileText
      },
      {
        title: "WG-PSII (Working Group - Power Sector Industrial Initiative)",
        href: "/workbodies/wg-psii",
        icon: Users
      },
      {
        title: "TF-Power Sector Engineering",
        href: "/workbodies/tf-power-sector",
        icon: Target
      },
      {
        title: "WG-YEA (Working Group - Young Engineers Activities)",
        href: "/workbodies/wg-yea",
        icon: Users
      },
      {
        title: "WG-CID (Working Group - Corporate & Industrial Development)",
        href: "/workbodies/wg-cid",
        icon: Users
      },
      {
        title: "WG-IALD (Working Group - International Affairs & Linkages Development)",
        href: "/workbodies/wg-iald",
        icon: Users
      },
      {
        title: "IPEA-Monitoring (Independent Power Evaluation & Assessment)",
        href: "/workbodies/ipea-monitoring",
        icon: BarChart3
      }
    ]
  }
];

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
    icon: Users,
    children: workbodyCategories
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
        roles: ["secretary", "admin", "coordination"]
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

    const isActive = item.href && location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems.includes(item.title);
    const hasActiveChild = item.children?.some(child => 
      child.href && (location.pathname === child.href || 
      child.children?.some(subChild => subChild.href && location.pathname === subChild.href))
    );

    if (hasChildren) {
      return (
        <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 hover:bg-green-50 hover:text-green-700 text-sm",
                depth > 0 && "ml-4 w-[calc(100%-1rem)] text-xs",
                depth > 1 && "ml-8 w-[calc(100%-2rem)] text-xs",
                (isActive || hasActiveChild) && "bg-green-100 text-green-800 font-medium"
              )}
            >
              <item.icon className={cn("h-4 w-4", depth > 0 && "h-3 w-3")} />
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
              {isOpen ? (
                <ChevronDown className={cn("h-4 w-4", depth > 0 && "h-3 w-3")} />
              ) : (
                <ChevronRight className={cn("h-4 w-4", depth > 0 && "h-3 w-3")} />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children?.map(child => renderNavigationItem(child, depth + 1))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    // Only render as Link if item has href
    if (item.href) {
      return (
        <Button
          key={item.title}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 hover:bg-green-50 hover:text-green-700 text-sm",
            depth > 0 && "ml-4 w-[calc(100%-1rem)] text-xs",
            depth > 1 && "ml-8 w-[calc(100%-2rem)] text-xs",
            isActive && "bg-green-100 text-green-800 font-medium"
          )}
          asChild
        >
          <Link to={item.href}>
            <item.icon className={cn("h-4 w-4", depth > 0 && "h-3 w-3")} />
            <span className="flex-1 text-left">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        </Button>
      );
    }

    // Fallback for items without href (shouldn't happen with current structure)
    return null;
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen w-64 transform bg-gradient-to-b from-white to-green-50/30 border-r border-green-200 transition-transform duration-300 ease-in-out lg:translate-x-0",
      className
    )}>
      <ScrollArea className="h-full py-4">
        <div className="space-y-4">
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
      </ScrollArea>
    </div>
  );
}
