
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberHierarchy } from "@/components/workbody/MemberHierarchy";
import { MemberManagement } from "@/components/workbody/MemberManagement";
import { CompositionHistory } from "@/components/workbody/CompositionHistory";
import { WorkbodyMember } from "@/types/workbody";
import { useWorkbodyComposition } from "@/hooks/useWorkbodyComposition";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkbodyMembersProps {
  workbodyId: string;
  members: WorkbodyMember[];
  userRole: string;
  onMembersUpdate: () => void;
}

export function WorkbodyMembers({ workbodyId, members, userRole, onMembersUpdate }: WorkbodyMembersProps) {
  const [showManagement, setShowManagement] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const { composition, isLoading } = useWorkbodyComposition(workbodyId);
  const canManageMembers = userRole === 'admin' || userRole === 'coordination';

  // Use composition data if available, fallback to legacy members
  const displayMembers = composition.length > 0 ? 
    composition.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      hasCV: false
    })) : 
    members;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Members</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {displayMembers.length} member{displayMembers.length !== 1 ? 's' : ''} • {composition.length > 0 ? 'Active composition' : 'Legacy data'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide History' : 'View History'}
              </Button>
              {canManageMembers && (
                <Button 
                  variant="outline"
                  onClick={() => setShowManagement(!showManagement)}
                >
                  {showManagement ? 'Hide Management' : 'Manage Members'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MemberHierarchy 
            members={displayMembers} 
            showActions={canManageMembers}
          />
        </CardContent>
      </Card>

      {showHistory && (
        <CompositionHistory workbodyId={workbodyId} />
      )}

      {canManageMembers && showManagement && (
        <Card>
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
          </CardHeader>
          <CardContent>
            <MemberManagement
              workbodyId={workbodyId}
              members={displayMembers}
              onMembersUpdate={onMembersUpdate}
              canManage={canManageMembers}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
