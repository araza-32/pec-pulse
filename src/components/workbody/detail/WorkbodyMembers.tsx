
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberHierarchy } from "@/components/workbody/MemberHierarchy";
import { Plus } from "lucide-react";

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
  const [isAddingMember, setIsAddingMember] = useState(false);
  
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
              <Button 
                onClick={() => setIsAddingMember(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
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
    </div>
  );
}
