
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaskforceFormValues, TaskforceMember } from "@/types/taskforce";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CompositionSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}

export const CompositionSection = ({ form }: CompositionSectionProps) => {
  const { toast } = useToast();
  const [members, setMembers] = useState(form.getValues("members") || []);
  const fileInputs = useRef<Array<HTMLInputElement | null>>([]);

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
        cvUrl: undefined
      },
    ]);
  };

  const updateMember = (index: number, field: string, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const updateMemberCvUrl = (index: number, url: string) => {
    const updatedMembers = [...members];
    updatedMembers[index].cvUrl = url;
    setMembers(updatedMembers);
  };

  const deleteMember = (index: number) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are allowed.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum allowed size is 2 MB.",
        variant: "destructive"
      });
      return;
    }

    const memberId = members[index].id || crypto.randomUUID();
    const filePath = `members/cv-${memberId}.pdf`;

    const { data, error } = await supabase.storage
      .from("workbody-member-cvs")
      .upload(filePath, file, { upsert: true, contentType: "application/pdf" });

    if (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("workbody-member-cvs")
      .getPublicUrl(filePath);

    updateMemberCvUrl(index, publicUrlData?.publicUrl || "");
    toast({
      title: "CV uploaded",
      description: "CV uploaded successfully as PDF.",
      variant: "default"
    });
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
            <TableHead>CV (PDF)</TableHead>
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
              {/* CV Upload section */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    ref={el => fileInputs.current[index] = el}
                    onChange={(e) => handleCvUpload(e, index)}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => fileInputs.current[index]?.click()}
                    variant="outline"
                  >
                    <Upload className="w-4 h-4 mr-1" /> {member.cvUrl ? "Re-upload CV" : "Upload CV"}
                  </Button>
                  {member.cvUrl && (
                    <a href={member.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
                      View CV
                    </a>
                  )}
                </div>
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

// NOTE: This file is now quite long (> 200 lines). Please consider splitting into smaller components for maintainability!
