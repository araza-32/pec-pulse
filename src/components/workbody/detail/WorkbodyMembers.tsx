
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberHierarchy } from "@/components/workbody/MemberHierarchy";
import { MemberManagement } from "@/components/workbody/MemberManagement";
import { CompositionHistory } from "@/components/workbody/CompositionHistory";
import { WorkbodyMember } from "@/types/workbody";

interface WorkbodyMembersProps {
  workbodyId: string;
  members: WorkbodyMember[];
  userRole: string;
  onMembersUpdate: () => void;
}

export function WorkbodyMembers({ workbodyId, members, userRole, onMembersUpdate }: WorkbodyMembersProps) {
  const [showManagement, setShowManagement] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const canManageMembers = userRole === 'admin' || userRole === 'coordination';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Members</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {members.length} member{members.length !== 1 ? 's' : ''} • Organized by seniority
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
            members={members} 
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
              members={members}
              onMembersUpdate={onMembersUpdate}
              canManage={canManageMembers}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
