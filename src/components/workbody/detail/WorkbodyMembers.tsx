
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberHierarchy } from "@/components/workbody/MemberHierarchy";
import { MemberManagement } from "@/components/workbody/MemberManagement";

interface Member {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  hasCV?: boolean;
}

interface WorkbodyMembersProps {
  workbodyId: string;
  members: Member[];
  userRole: string;
  onMembersUpdate: () => void;
}

export function WorkbodyMembers({ workbodyId, members, userRole, onMembersUpdate }: WorkbodyMembersProps) {
  const [showManagement, setShowManagement] = useState(false);
  
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
            {canManageMembers && (
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowManagement(!showManagement)}
                >
                  {showManagement ? 'Hide Management' : 'Manage Members'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <MemberHierarchy 
            members={members} 
            showActions={canManageMembers}
          />
        </CardContent>
      </Card>

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
