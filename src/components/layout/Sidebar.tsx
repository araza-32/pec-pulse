
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
  Settings,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'admin' | 'secretary' | 'chairman';
  userWorkbodyId?: string;
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  userRole,
  userWorkbodyId 
}: SidebarProps) {
  const { workbodies, isLoading } = useWorkbodies();
  
  // Get user information to check if it's coordination user
  const userEmail = JSON.parse(localStorage.getItem('user') || '{}')?.email || '';
  const isCoordinationUser = userEmail.includes('coordination');

  // Show admin options for both admin role and coordination user
  const showAdminOptions = userRole === 'admin' || isCoordinationUser;

  const filteredWorkbodies = userRole === 'secretary' && !isCoordinationUser
    ? workbodies.filter(w => w.id === userWorkbodyId)
    : workbodies;

  const committees = filteredWorkbodies
    .filter(w => w.type === 'committee')
    .sort((a, b) => a.name.localeCompare(b.name));
  const workingGroups = filteredWorkbodies
    .filter(w => w.type === 'working-group')
    .sort((a, b) => a.name.localeCompare(b.name));
  const taskForces = filteredWorkbodies
    .filter(w => w.type === 'task-force')
    .sort((a, b) => a.name.localeCompare(b.name));

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const WorkbodyGroup = ({ title, items, icon: Icon }: { title: string; items: any[]; icon: any }) => (
    <Collapsible className="w-full">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-pec-green-50">
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-9 mt-1">
        {items.map(item => (
          <NavLink
            key={item.id}
            to={`/workbody/${item.id}`}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-pec-green text-white"
                  : "hover:bg-pec-green-50"
              )
            }
          >
            {item.name}
          </NavLink>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
  
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 md:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white transition-transform duration-300 md:relative md:translate-x-0 h-screen overflow-hidden flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between border-b px-4 flex-shrink-0">
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
        
        <ScrollArea className="flex-1 px-3 py-4">
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
            
            <Separator />
            
            {isLoading ? (
              <div className="space-y-3">
                <h4 className="px-3 text-xs font-semibold uppercase text-muted-foreground">
                  Loading workbodies...
                </h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 rounded-md px-3 py-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {(showAdminOptions || userRole === 'chairman') && (
                  <div className="space-y-2">
                    {committees.length > 0 && (
                      <WorkbodyGroup title="Committees" items={committees} icon={Users} />
                    )}
                    
                    {workingGroups.length > 0 && (
                      <WorkbodyGroup title="Working Groups" items={workingGroups} icon={GitMerge} />
                    )}
                    
                    {taskForces.length > 0 && (
                      <WorkbodyGroup title="Task Forces" items={taskForces} icon={FileText} />
                    )}
                  </div>
                )}
                
                {userRole === 'secretary' && !isCoordinationUser && filteredWorkbodies.length > 0 && (
                  <div>
                    <h4 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                      My Workbody
                    </h4>
                    <div className="space-y-1">
                      {filteredWorkbodies.map(workbody => (
                        <NavLink
                          key={workbody.id}
                          to={`/workbody/${workbody.id}`}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                              isActive
                                ? "bg-pec-green text-white"
                                : "hover:bg-pec-green-50"
                            )
                          }
                        >
                          {workbody.type === 'committee' && <Users className="h-4 w-4" />}
                          {workbody.type === 'working-group' && <GitMerge className="h-4 w-4" />}
                          {workbody.type === 'task-force' && <FileText className="h-4 w-4" />}
                          {workbody.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
