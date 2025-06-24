
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  hasCV?: boolean;
}

interface MemberManagementProps {
  workbodyId: string;
  members: Member[];
  onMembersUpdate: () => void;
  canManage: boolean;
}

const ROLE_OPTIONS = [
  'Convener',
  'Chairman',
  'Co-lead',
  'Deputy Chair',
  'Deputy Chairman',
  'Deputy Convener',
  'Senior Vice Chairman',
  'Vice Chairman Sindh',
  'Vice Chairman KP',
  'Vice Chairman Balochistan',
  'Vice Chairman Punjab',
  'Vice Chairman',
  'Vice Chair',
  'Member',
  'Secretary'
];

export function MemberManagement({ workbodyId, members, onMembersUpdate, canManage }: MemberManagementProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    hasCV: false
  });
  const { toast } = useToast();

  if (!canManage) {
    return null;
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      hasCV: false
    });
    setSelectedMember(null);
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.role) {
      toast({
        title: "Error",
        description: "Name and role are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('workbody_members')
        .insert({
          workbody_id: workbodyId,
          name: formData.name,
          role: formData.role,
          email: formData.email || null,
          phone: formData.phone || null,
          has_cv: formData.hasCV
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member added successfully"
      });

      setIsAddOpen(false);
      resetForm();
      onMembersUpdate();
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedMember || !formData.name || !formData.role) {
      toast({
        title: "Error",
        description: "Name and role are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('workbody_members')
        .update({
          name: formData.name,
          role: formData.role,
          email: formData.email || null,
          phone: formData.phone || null,
          has_cv: formData.hasCV
        })
        .eq('id', selectedMember.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member updated successfully"
      });

      setIsEditOpen(false);
      resetForm();
      onMembersUpdate();
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const { error } = await supabase
        .from('workbody_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member removed successfully"
      });

      onMembersUpdate();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email || '',
      phone: member.phone || '',
      hasCV: member.hasCV || false
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Members</h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <MemberForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAdd}
              onCancel={() => setIsAddOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">{member.name}</h4>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              {member.email && (
                <p className="text-xs text-muted-foreground">{member.email}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditDialog(member)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(member.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <MemberForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEdit}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MemberFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function MemberForm({ formData, setFormData, onSubmit, onCancel }: MemberFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter member name"
        />
      </div>

      <div>
        <Label htmlFor="role">Role *</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter email address"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter phone number"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
}
