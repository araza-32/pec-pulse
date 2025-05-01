
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
