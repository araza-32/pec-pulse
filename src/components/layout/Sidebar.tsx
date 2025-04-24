
import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarNavigation } from "./SidebarNavigation";
import { WorkbodySection } from "./WorkbodySection";
import { useWorkbodies } from "@/hooks/useWorkbodies";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
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
            <Calendar className="h-6 w-6 text-pec-green" />
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
            <SidebarNavigation 
              userRole={userRole} 
              showAdminOptions={showAdminOptions} 
              isCoordinationUser={isCoordinationUser} 
            />
            
            <Separator />
            
            <WorkbodySection 
              isLoading={isLoading}
              showAdminOptions={showAdminOptions}
              userRole={userRole}
              isCoordinationUser={isCoordinationUser}
              filteredWorkbodies={filteredWorkbodies}
              committees={committees}
              workingGroups={workingGroups}
              taskForces={taskForces}
            />
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
