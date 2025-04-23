
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaskforceFormValues } from "@/types/taskforce";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash, Upload } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CompositionSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}

export const CompositionSection = ({ form }: CompositionSectionProps) => {
  const [editMemberIndex, setEditMemberIndex] = useState<number | null>(null);
  const [newCVFile, setNewCVFile] = useState<File | null>(null);
  const { toast } = useToast();
  const members = form.watch("members") || [];

  const handleAddMember = () => {
    const currentMembers = [...members];
    currentMembers.push({
      name: "",
      role: "",
      expertise: "",
      responsibilities: "",
      mobile: "",
      email: "",
      address: ""
    });
    form.setValue("members", currentMembers);
    // Open the edit dialog for the new member
    setEditMemberIndex(currentMembers.length - 1);
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    form.setValue("members", updatedMembers);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check file type
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }
      
      setNewCVFile(file);
    }
  };

  const handleSaveMember = () => {
    if (editMemberIndex !== null) {
      // Handle CV upload if present
      if (newCVFile) {
        // In a real implementation, you would upload the file to storage
        // For now, we'll just update the CV URL with the file name
        const updatedMembers = [...members];
        updatedMembers[editMemberIndex] = {
          ...updatedMembers[editMemberIndex],
          cvUrl: URL.createObjectURL(newCVFile)
        };
        form.setValue("members", updatedMembers);
        
        toast({
          title: "CV uploaded",
          description: `CV for ${updatedMembers[editMemberIndex].name} has been uploaded.`,
        });
        
        setNewCVFile(null);
      }
      
      setEditMemberIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Task Force Members</h3>
      
      <Table>
        <TableCaption>Add members to your task force.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>CV</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => (
            <TableRow key={index}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                {member.cvUrl ? (
                  <a href={member.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                    View CV
                  </a>
                ) : "No CV uploaded"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMemberIndex(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Button type="button" variant="secondary" onClick={handleAddMember}>
        Add Member
      </Button>
      
      {/* Edit Member Dialog */}
      <Dialog open={editMemberIndex !== null} onOpenChange={(open) => {
        if (!open) setEditMemberIndex(null);
      }}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>
              Fill out the member's information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          {editMemberIndex !== null && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`members.${editMemberIndex}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`members.${editMemberIndex}.role`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter role" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name={`members.${editMemberIndex}.expertise`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expertise</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the member's expertise" 
                        className="h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`members.${editMemberIndex}.responsibilities`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the member's responsibilities" 
                        className="h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`members.${editMemberIndex}.mobile`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`members.${editMemberIndex}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name={`members.${editMemberIndex}.address`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter address" 
                        className="h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Upload CV (PDF only, max 2MB)</FormLabel>
                <div className="flex items-center gap-2">
                  <Input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange}
                    className="max-w-md"
                  />
                  {newCVFile && <span className="text-sm text-green-600">Ready to upload: {newCVFile.name}</span>}
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button type="button" onClick={handleSaveMember}>
                  Save Member
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
