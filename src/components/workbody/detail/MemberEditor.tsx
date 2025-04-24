
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MemberEditorProps {
  isOpen: boolean;
  onClose: () => void;
  member?: {
    id: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
  };
  workbodyId: string;
  onSave: () => void;
}

export function MemberEditor({ isOpen, onClose, member, workbodyId, onSave }: MemberEditorProps) {
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || 'Member');
  const [email, setEmail] = useState(member?.email || '');
  const [phone, setPhone] = useState(member?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (member?.id) {
        // Update existing member
        const { error } = await supabase
          .from('workbody_members')
          .update({ name, role, email, phone })
          .eq('id', member.id);

        if (error) throw error;

        toast({
          title: "Member Updated",
          description: "The member details have been successfully updated."
        });
      } else {
        // Add new member
        const { error } = await supabase
          .from('workbody_members')
          .insert([{ 
            workbody_id: workbodyId,
            name, 
            role,
            email,
            phone
          }]);

        if (error) throw error;

        toast({
          title: "Member Added",
          description: "A new member has been successfully added."
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Member' : 'Add New Member'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter member name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Convener">Convener</SelectItem>
                <SelectItem value="Deputy Convener">Deputy Convener</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : member ? 'Save Changes' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
