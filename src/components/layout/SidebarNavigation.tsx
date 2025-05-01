
import { useLocation } from "react-router-dom";
import { BarChart3, Calendar, ChevronRight, ClipboardList, FileText, Home, Settings, UploadCloud, Users } from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  current?: boolean;
  children?: SidebarItem[];
}

export function getNavigation(): SidebarItem[] {
  const location = useLocation();
  
  return [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: Home, 
      current: location.pathname === "/dashboard" 
    },
    { 
      name: "Chairman's Dashboard", 
      href: "/chairman-dashboard", 
      icon: BarChart3, 
      current: location.pathname === "/chairman-dashboard" 
    },
    { 
      name: "Executive Dashboard", 
      href: "/chairman-executive-dashboard", 
      icon: BarChart3, 
      current: location.pathname === "/chairman-executive-dashboard" 
    },
    {
      name: "Workbodies",
      href: "/workbodies",
      icon: Users,
      current: location.pathname.startsWith("/workbodies") && location.pathname !== "/workbodies",
      children: []
    },
    {
      name: "Meeting Minutes",
      href: "/minutes",
      icon: FileText,
      current: location.pathname.includes("/minutes"),
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
    },
    {
      name: "Reports",
      href: "/reports",
      icon: ClipboardList,
      current: location.pathname === "/reports",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: location.pathname === "/settings",
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
  const navigation = getNavigation();
  
  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => {
    // Show Chairman's Dashboard only to chairman or admin/coordination users
    if (item.name === "Chairman's Dashboard" || item.name === "Executive Dashboard") {
      return userRole === 'chairman' || showAdminOptions;
    }
    
    // Show all other items
    return true;
  });

  return (
    <div>
      <h4 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
        Navigation
      </h4>
      <nav className="space-y-1">
        {filteredNavigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              item.current 
                ? "bg-pec-green text-white" 
                : "hover:bg-pec-green-50"
            }`}
          >
            {item.icon && <item.icon className="h-5 w-5" />}
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
}
