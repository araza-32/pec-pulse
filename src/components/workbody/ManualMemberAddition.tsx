
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { WorkbodyMember } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ManualMemberAdditionProps {
  workbodyId: string;
  onMembersAdded: () => void;
  onCancel: () => void;
}

export function ManualMemberAddition({ workbodyId, onMembersAdded, onCancel }: ManualMemberAdditionProps) {
  const [members, setMembers] = useState<Partial<WorkbodyMember>[]>([
    { name: '', role: 'Member', hasCV: false }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addMember = () => {
    setMembers([...members, { name: '', role: 'Member', hasCV: false }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, field: keyof WorkbodyMember, value: any) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all members have names
    if (members.some(member => !member.name || member.name.trim() === '')) {
      toast({
        title: 'Validation Error',
        description: 'Please provide names for all members',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert members into database
      const { error } = await supabase
        .from('workbody_members')
        .insert(
          members.map(member => ({
            workbody_id: workbodyId,
            name: member.name,
            role: member.role,
            has_cv: member.hasCV || false,
            source_document_id: null // Manual addition
          }))
        );

      if (error) {
        throw error;
      }

      toast({
        title: 'Members Added',
        description: `Successfully added ${members.length} members to the workbody.`
      });
      
      onMembersAdded();
    } catch (error: any) {
      console.error('Error adding members:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add members to the workbody',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manually Add Members</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {members.map((member, index) => (
            <div key={index} className="space-y-3 pb-4">
              {index > 0 && <Separator className="my-4" />}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Member {index + 1}</p>
                {members.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeMember(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor={`name-${index}`}>Name</Label>
                  <Input 
                    id={`name-${index}`} 
                    value={member.name || ''} 
                    onChange={e => updateMember(index, 'name', e.target.value)}
                    placeholder="Enter member name"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor={`role-${index}`}>Role</Label>
                  <Select 
                    value={member.role || 'Member'} 
                    onValueChange={value => updateMember(index, 'role', value)}
                  >
                    <SelectTrigger id={`role-${index}`}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Convener">Convener</SelectItem>
                      <SelectItem value="Deputy Convener">Deputy Convener</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={addMember}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Member
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Members'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
