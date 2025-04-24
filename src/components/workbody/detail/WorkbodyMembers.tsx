
import { useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Pencil, Trash2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MemberEditor } from "./MemberEditor";

interface WorkbodyMembersProps {
  workbodyId: string;
  members: any[];
  userRole?: string;
  onMembersUpdate: () => void;
}

export function WorkbodyMembers({ workbodyId, members, userRole, onMembersUpdate }: WorkbodyMembersProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const { toast } = useToast();
  
  // Allow admins and coordination roles to manage members
  const canManageMembers = userRole === 'admin' || userRole === 'coordination';

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setIsEditorOpen(true);
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setIsEditorOpen(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      const { error } = await supabase
        .from('workbody_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Member Deleted",
        description: "The member has been successfully removed."
      });
      
      onMembersUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Workbody Composition</CardTitle>
        {canManageMembers && (
          <Button 
            onClick={handleAddMember}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {members.length > 0 ? (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-pec-green text-white">
                      {member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    {member.email && (
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    )}
                    {member.phone && (
                      <p className="text-sm text-muted-foreground">{member.phone}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {member.hasCV && (
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View CV
                    </Button>
                  )}
                  {canManageMembers && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMember(member)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No members available</p>
          </div>
        )}
      </CardContent>

      <MemberEditor 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        member={selectedMember}
        workbodyId={workbodyId}
        onSave={onMembersUpdate}
      />
    </Card>
  );
}
