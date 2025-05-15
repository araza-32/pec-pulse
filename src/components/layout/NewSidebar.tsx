
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  ChevronLeft,
  ChevronRight, 
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  BarChart3,
  Settings,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userRole?: string;
  isOpen: boolean; 
  toggle: () => void;
}

export function NewSidebar({ userRole = 'admin', isOpen, toggle }: SidebarProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Navigation items with role-based access
  // Removed Executive Dashboard entry from this array
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "secretary", "chairman", "registrar", "convener", "member"]
    },
    {
      name: "Meetings",
      href: "/calendar",
      icon: Calendar,
      roles: ["admin", "secretary", "chairman", "registrar", "convener", "member"]
    },
    {
      name: "Work-Bodies",
      href: "/workbodies",
      icon: Briefcase,
      roles: ["admin", "secretary", "chairman", "registrar", "convener", "member"],
      submenu: [
        {
          name: "Committees",
          href: "/workbodies/committees",
          roles: ["admin", "secretary", "chairman", "registrar", "convener", "member"]
        },
        {
          name: "Working Groups",
          href: "/workbodies/working-groups",
          roles: ["admin", "secretary", "chairman", "registrar", "convener", "member"]
        },
        {
          name: "Task Forces",
          href: "/workbodies/task-forces",
          roles: ["admin", "secretary", "chairman", "registrar", "convener", "member"]
        }
      ]
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FileText,
      roles: ["admin", "secretary", "chairman", "registrar", "convener", "member"]
    },
    {
      name: "Reports & Insights",
      href: "/reports",
      icon: BarChart3,
      roles: ["admin", "secretary", "chairman", "registrar", "convener"]
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["admin"]
    }
  ];

  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={toggle}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full transform transition-all duration-300 ease-in-out",
          isOpen ? "w-64 translate-x-0" : "w-16 translate-x-0",
          "bg-gradient-to-b from-white to-blue-50 dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col shadow-md"
        )}
      >
        {/* Header with logo */}
        <div className="h-16 flex items-center px-4 border-b dark:border-gray-800 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className={cn(
            "flex items-center transition-all duration-300",
            isOpen ? "justify-between w-full" : "justify-center"
          )}>
            {isOpen ? (
              <>
                <div className="flex items-center">
                  <img 
                    src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
                    alt="PEC Logo" 
                    className="h-8 w-auto" 
                  />
                  <span className="ml-3 text-lg font-semibold text-white">
                    PEC Pulse
                  </span>
                </div>
                <button 
                  onClick={toggle}
                  className="p-1 rounded-full hover:bg-blue-500 text-white"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <img 
                  src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
                  alt="PEC Logo" 
                  className="h-8 w-auto" 
                />
                <button 
                  onClick={toggle}
                  className="absolute right-0 p-1 rounded-full hover:bg-blue-500 text-white -mr-3 bg-blue-600 border border-blue-500"
                  style={{ transform: "translateX(50%)" }}
                  aria-label="Expand sidebar"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.submenu && item.submenu.some(subItem => location.pathname === subItem.href));
              
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => cn(
                      "flex items-center py-2 px-3 rounded-lg transition-colors",
                      isActive 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5",
                      isOpen ? "mr-3" : "mx-auto"
                    )} />
                    {isOpen && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </NavLink>
                  
                  {/* Submenu items */}
                  {isOpen && item.submenu && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {item.submenu
                        .filter(subItem => subItem.roles.includes(userRole))
                        .map(subItem => (
                          <li key={subItem.name}>
                            <NavLink
                              to={subItem.href}
                              className={({ isActive }) => cn(
                                "flex items-center py-1.5 px-3 rounded-md text-sm transition-colors",
                                isActive 
                                  ? "bg-blue-100 text-blue-700 font-medium" 
                                  : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800"
                              )}
                            >
                              <span>{subItem.name}</span>
                            </NavLink>
                          </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t dark:border-gray-800 bg-blue-50/50">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>PEC Pulse v2.0</p>
              <p>© {new Date().getFullYear()} Pakistan Engineering Council</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
