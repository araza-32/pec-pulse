
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { BarChart3, Calendar, ChevronRight, ClipboardList, FileText, Home, Settings, Users } from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  current?: boolean;
  children?: SidebarItem[];
  roles?: string[];
}

export function getNavigation(): SidebarItem[] {
  const location = useLocation();
  
  return [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: Home, 
      current: location.pathname === "/dashboard",
      roles: ["admin", "secretary", "chairman", "registrar"]
    },
    { 
      name: "Chairman's Dashboard", 
      href: "/chairman-dashboard", 
      icon: BarChart3, 
      current: location.pathname === "/chairman-dashboard",
      roles: ["admin", "chairman", "registrar"]
    },
    {
      name: "Workbodies",
      href: "/workbodies",
      icon: Users,
      current: location.pathname.startsWith("/workbodies") && location.pathname !== "/workbodies",
      children: [],
      roles: ["admin", "secretary"]
    },
    {
      name: "Meeting Minutes",
      href: "/minutes",
      icon: FileText,
      current: location.pathname.includes("/minutes"),
      roles: ["admin", "secretary"],
      children: [
        {
          name: "Upload Minutes",
          href: "/minutes/upload",
          icon: ChevronRight,
          current: location.pathname === "/minutes/upload",
        }
      ]
    },
    {
      name: "Meeting Calendar",
      href: "/calendar",
      icon: Calendar,
      current: location.pathname === "/calendar",
      roles: ["admin", "secretary", "chairman", "registrar"]
    },
    {
      name: "Reports",
      href: "/reports",
      icon: ClipboardList,
      current: location.pathname === "/reports",
      roles: ["admin", "secretary", "chairman", "registrar"]
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: location.pathname === "/settings",
      roles: ["admin"]
    },
  ];
}

// Create and export the SidebarNavigation component
export function SidebarNavigation({ 
  userRole, 
  showAdminOptions, 
  isCoordinationUser 
}: { 
  userRole: string; 
  showAdminOptions: boolean; 
  isCoordinationUser: boolean; 
}) {
  const allNavigation = getNavigation();
  
  // Filter navigation items based on user role
  const filteredNavigation = allNavigation.filter(item => {
    // If roles are defined, check if user role is included
    if (item.roles) {
      if (userRole === 'admin' || showAdminOptions) {
        // Admin and coordination users can see everything
        return true;
      }
      return item.roles.includes(userRole);
    }
    
    // Items without defined roles are shown to everyone
    return true;
  });

  return (
    <div>
      <h4 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
        Navigation
      </h4>
      <nav className="space-y-1">
        {filteredNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              item.current 
                ? "bg-pec-green text-white" 
                : "hover:bg-pec-green-50"
            }`}
          >
            {item.icon && <item.icon className="h-5 w-5" />}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
