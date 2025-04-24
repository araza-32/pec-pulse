
import { NavLink } from "react-router-dom";
import { 
  BarChart3, 
  Calendar,
  FileUp, 
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemsProps {
  userRole: string;
  showAdminOptions: boolean;
  isCoordinationUser: boolean;
}

export function SidebarNavigation({ userRole, showAdminOptions, isCoordinationUser }: NavItemsProps) {
  return (
    <div className="space-y-2">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-pec-green text-white"
              : "hover:bg-pec-green-50"
          )
        }
        end
      >
        <Home className="h-4 w-4" />
        Dashboard
      </NavLink>
      
      {showAdminOptions && (
        <>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-pec-green text-white"
                  : "hover:bg-pec-green-50"
              )
            }
          >
            <BarChart3 className="h-4 w-4" />
            Reports
          </NavLink>
          
          <NavLink
            to="/workbodies"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-pec-green text-white"
                  : "hover:bg-pec-green-50"
              )
            }
          >
            <Calendar className="h-4 w-4" />
            Manage Workbodies
          </NavLink>
        </>
      )}
      
      <NavLink
        to="/calendar"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            isActive
              ? "bg-pec-green text-white"
              : "hover:bg-pec-green-50"
          )
        }
      >
        <Calendar className="h-4 w-4" />
        Calendar
      </NavLink>
      
      {(userRole === 'secretary' || showAdminOptions) && (
        <NavLink
          to="/minutes/upload"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-pec-green text-white"
                : "hover:bg-pec-green-50"
            )
          }
        >
          <FileUp className="h-4 w-4" />
          Upload Minutes
        </NavLink>
      )}
      
      {userRole === 'chairman' && !isCoordinationUser && (
        <NavLink
          to="/chairman-dashboard"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-pec-green text-white"
                : "hover:bg-pec-green-50"
            )
          }
        >
          <BarChart3 className="h-4 w-4" />
          Overview
        </NavLink>
      )}
    </div>
  );
}
