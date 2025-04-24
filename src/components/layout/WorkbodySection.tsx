
import { NavLink } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkbodyGroup } from "./WorkbodyGroup";
import { cn } from "@/lib/utils";

interface WorkbodySectionProps {
  isLoading: boolean;
  showAdminOptions: boolean;
  userRole: string;
  isCoordinationUser: boolean;
  filteredWorkbodies: any[];
  committees: any[];
  workingGroups: any[];
  taskForces: any[];
}

export function WorkbodySection({
  isLoading,
  showAdminOptions,
  userRole,
  isCoordinationUser,
  filteredWorkbodies,
  committees,
  workingGroups,
  taskForces
}: WorkbodySectionProps) {
  if (isLoading) {
    return (
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
    );
  }
  
  if ((showAdminOptions || userRole === 'chairman') && (
    committees.length > 0 || workingGroups.length > 0 || taskForces.length > 0
  )) {
    return (
      <div className="space-y-2">
        {committees.length > 0 && (
          <WorkbodyGroup title="Committees" items={committees} icon="Users" />
        )}
        
        {workingGroups.length > 0 && (
          <WorkbodyGroup title="Working Groups" items={workingGroups} icon="GitMerge" />
        )}
        
        {taskForces.length > 0 && (
          <WorkbodyGroup title="Task Forces" items={taskForces} icon="FileText" />
        )}
      </div>
    );
  }
  
  if (userRole === 'secretary' && !isCoordinationUser && filteredWorkbodies.length > 0) {
    return (
      <div>
        <h4 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
          My Workbody
        </h4>
        <div className="space-y-1">
          {filteredWorkbodies.map(workbody => (
            <NavLink
              key={workbody.id}
              to={`/workbodies/${workbody.id}`}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-pec-green text-white"
                    : "hover:bg-pec-green-50"
                )
              }
            >
              {workbody.name}
            </NavLink>
          ))}
        </div>
      </div>
    );
  }
  
  return null;
}
