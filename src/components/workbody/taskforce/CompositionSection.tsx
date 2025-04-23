import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaskforceFormValues } from "@/types/taskforce";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CompositionSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}
export const CompositionSection = ({ form }: CompositionSectionProps) => {
  const { toast } = useToast();
  const [members, setMembers] = useState(form.getValues("members") || []);

  useEffect(() => {
    form.setValue("members", members);
  }, [members, form]);

  const addMember = () => {
    setMembers([
      ...members,
      {
        name: "",
        role: "",
        expertise: "",
        responsibilities: "",
        mobile: "",
        email: "",
        address: "",
      },
    ]);
  };

  const updateMember = (index: number, field: string, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const deleteMember = (index: number) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>Add members to the task force.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Expertise</TableHead>
            <TableHead>Responsibilities</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => (
            <TableRow key={index}>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`members.${index}.name` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter name"
                          value={member.name}
                          onChange={(e) => updateMember(index, "name", e.target.value)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`members.${index}.role` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter role"
                          value={member.role}
                          onChange={(e) => updateMember(index, "role", e.target.value)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`members.${index}.expertise` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter expertise"
                          value={member.expertise}
                          onChange={(e) => updateMember(index, "expertise", e.target.value)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`members.${index}.responsibilities` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter responsibilities"
                          value={member.responsibilities}
                          onChange={(e) => updateMember(index, "responsibilities", e.target.value)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`members.${index}.mobile` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter mobile number"
                          value={member.mobile}
                          onChange={(e) => updateMember(index, "mobile", e.target.value)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`members.${index}.email` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter email address"
                          value={member.email}
                          onChange={(e) => updateMember(index, "email", e.target.value)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`members.${index}.address` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter address"
                          value={member.address}
                          onChange={(e) => updateMember(index, "address", e.target.value)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMember(index)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button type="button" onClick={addMember}>
        Add Member
      </Button>
    </div>
  );
};
