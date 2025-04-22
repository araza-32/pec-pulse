
import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TaskforceFormValues } from "@/types/taskforce";
import { PlusCircle, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CompositionSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}

export const CompositionSection = ({ form }: CompositionSectionProps) => {
  const members = form.watch("members") || [];
  
  const addMember = () => {
    if (members.length < 15) {
      form.setValue("members", [
        ...members, 
        { 
          name: "", 
          role: "", 
          expertise: "", 
          responsibilities: "", 
          mobile: "", 
          email: "", 
          address: "" 
        }
      ]);
    }
  };
  
  const removeMember = (index: number) => {
    const updated = [...members];
    updated.splice(index, 1);
    form.setValue("members", updated);
  };

  const updateMemberField = (index: number, field: string, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue("members", updated);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <FormLabel className="text-base">Taskforce Composition</FormLabel>
          <Button
            type="button"
            onClick={addMember}
            variant="outline"
            size="sm"
            disabled={members.length >= 15}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" /> Add Member
          </Button>
        </div>
        
        <FormDescription className="mb-4">
          Define the taskforce members, their roles and responsibilities (maximum 15 members)
        </FormDescription>
      </div>

      {members.length > 0 ? (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Key Responsibilities</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input 
                      value={member.name} 
                      onChange={(e) => updateMemberField(index, "name", e.target.value)}
                      placeholder="Name" 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={member.role} 
                      onChange={(e) => updateMemberField(index, "role", e.target.value)}
                      placeholder="Role" 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={member.expertise} 
                      onChange={(e) => updateMemberField(index, "expertise", e.target.value)}
                      placeholder="Expertise"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={member.responsibilities} 
                      onChange={(e) => updateMemberField(index, "responsibilities", e.target.value)}
                      placeholder="Responsibilities"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={member.mobile} 
                      onChange={(e) => updateMemberField(index, "mobile", e.target.value)}
                      placeholder="Mobile"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={member.email} 
                      onChange={(e) => updateMemberField(index, "email", e.target.value)}
                      placeholder="Email"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={member.address} 
                      onChange={(e) => updateMemberField(index, "address", e.target.value)}
                      placeholder="Address"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeMember(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
          <p className="text-sm text-muted-foreground mb-4">No members added yet</p>
          <Button 
            variant="outline" 
            onClick={addMember}
          >
            Add First Member
          </Button>
        </div>
      )}
      
      <FormMessage />
    </div>
  );
};
