
import { NavLink } from "react-router-dom";
import { 
  BarChart3, 
  Calendar,
  FileText, 
  FileUp, 
  GitMerge,
  Globe,
  Home, 
  Users, 
  X,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Workbody } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  workbodies: Workbody[];
  userRole: 'admin' | 'secretary' | 'chairman';
  userWorkbodyId?: string;
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  workbodies, 
  userRole,
  userWorkbodyId 
}: SidebarProps) {
  // Filter workbodies based on user role and assigned workbody
  const filteredWorkbodies = userRole === 'admin' 
    ? workbodies 
    : userRole === 'chairman'
      ? workbodies // Chairman can see all workbodies
      : workbodies.filter(w => w.id === userWorkbodyId);

  // Group workbodies by type
  const committees = filteredWorkbodies.filter(w => w.type === 'committee');
  const workingGroups = filteredWorkbodies.filter(w => w.type === 'working-group');
  const taskForces = filteredWorkbodies.filter(w => w.type === 'task-force');
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white transition-transform duration-300 md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-pec-green" />
            <span className="font-semibold">PEC Dashboard</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-64px)] px-3 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <NavLink
                to="/"
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
              
              {userRole === 'admin' && (
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
                    to="/manage-workbodies"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-pec-green text-white"
                          : "hover:bg-pec-green-50"
                      )
                    }
                  >
                    <Settings className="h-4 w-4" />
                    Manage Workbodies
                  </NavLink>
                </>
              )}
              
              {/* Calendar link for all users */}
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
              
              {/* Upload Minutes link for secretaries and admins */}
              {(userRole === 'secretary' || userRole === 'admin') && (
                <NavLink
                  to="/upload"
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
              
              {/* Chairman Dashboard link */}
              {userRole === 'chairman' && (
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
            
            <Separator />
            
            <div>
              <h4 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                Committees
              </h4>
              <div className="space-y-1">
                {committees.map(committee => (
                  <NavLink
                    key={committee.id}
                    to={`/workbody/${committee.id}`}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-pec-green text-white"
                          : "hover:bg-pec-green-50"
                      )
                    }
                  >
                    <Users className="h-4 w-4" />
                    {committee.name}
                  </NavLink>
                ))}
              </div>
            </div>
            
            {workingGroups.length > 0 && (
              <div>
                <h4 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                  Working Groups
                </h4>
                <div className="space-y-1">
                  {workingGroups.map(group => (
                    <NavLink
                      key={group.id}
                      to={`/workbody/${group.id}`}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-pec-green text-white"
                            : "hover:bg-pec-green-50"
                        )
                      }
                    >
                      <GitMerge className="h-4 w-4" />
                      {group.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
            
            {taskForces.length > 0 && (
              <div>
                <h4 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                  Task Forces
                </h4>
                <div className="space-y-1">
                  {taskForces.map(taskForce => (
                    <NavLink
                      key={taskForce.id}
                      to={`/workbody/${taskForce.id}`}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-pec-green text-white"
                            : "hover:bg-pec-green-50"
                        )
                      }
                    >
                      <FileText className="h-4 w-4" />
                      {taskForce.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
