
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { BarChart3, Calendar, FileText, Home, Settings, Users } from "lucide-react";

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
      href: "/", 
      icon: Home, 
      current: location.pathname === "/" || location.pathname === "/dashboard",
      roles: ["admin", "secretary", "chairman", "registrar", "coordination"]
    },
    { 
      name: "Chairman's Dashboard", 
      href: "/chairman-dashboard", 
      icon: BarChart3, 
      current: location.pathname === "/chairman-dashboard",
      roles: ["admin", "chairman", "registrar", "coordination"]
    },
    {
      name: "Workbodies",
      href: "/workbodies",
      icon: Users,
      current: location.pathname === "/workbodies" || location.pathname.startsWith("/workbody/"),
      roles: ["admin", "secretary", "chairman", "registrar", "coordination"]
    },
    {
      name: "Workbodies Overview",
      href: "/workbodies-overview",
      icon: Users,
      current: location.pathname === "/workbodies-overview",
      roles: ["admin", "chairman", "registrar", "coordination"]
    },
    {
      name: "Workbody Management",
      href: "/workbody-management",
      icon: Users,
      current: location.pathname === "/workbody-management",
      roles: ["admin", "coordination"]
    },
    {
      name: "Meeting Minutes",
      href: "/meetings/list", 
      icon: FileText,
      current: location.pathname === "/meetings/list",
      roles: ["admin", "secretary", "chairman", "registrar"]
    },
    {
      name: "Meeting Calendar",
      href: "/calendar",
      icon: Calendar,
      current: location.pathname === "/calendar",
      roles: ["admin", "secretary", "chairman", "registrar"]
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: location.pathname === "/settings",
      roles: ["admin", "coordination"]
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
          <div key={item.name}>
            <Link
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
            
            {item.children && item.children.length > 0 && (
              <div className="ml-6 space-y-1 mt-1">
                {item.children.filter(subItem => {
                  if (subItem.roles) {
                    if (userRole === 'admin' || showAdminOptions) {
                      return true;
                    }
                    return subItem.roles.includes(userRole);
                  }
                  return true;
                }).map(subItem => (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                      subItem.current 
                        ? "bg-pec-green/80 text-white" 
                        : "hover:bg-pec-green-50"
                    }`}
                  >
                    {subItem.icon && <subItem.icon className="h-4 w-4" />}
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
