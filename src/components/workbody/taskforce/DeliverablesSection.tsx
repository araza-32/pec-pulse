
import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TaskforceFormValues } from "@/types/taskforce";
import { PlusCircle, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DeliverablesSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}

export const DeliverablesSection = ({ form }: DeliverablesSectionProps) => {
  const deliverables = form.watch("deliverables") || [];
  const milestones = form.watch("milestones") || [];
  
  const addDeliverable = () => {
    if (deliverables.length < 15) {
      form.setValue("deliverables", [
        ...deliverables, 
        { 
          name: "", 
          description: "", 
          deadline: "", 
          status: "pending" 
        }
      ]);
    }
  };
  
  const removeDeliverable = (index: number) => {
    const updated = [...deliverables];
    updated.splice(index, 1);
    form.setValue("deliverables", updated);
  };

  const updateDeliverableField = (index: number, field: string, value: string) => {
    const updated = [...deliverables];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue("deliverables", updated);
  };

  const addMilestone = () => {
    if (milestones.length < 15) {
      form.setValue("milestones", [
        ...milestones, 
        { name: "", description: "" }
      ]);
    }
  };
  
  const removeMilestone = (index: number) => {
    const updated = [...milestones];
    updated.splice(index, 1);
    form.setValue("milestones", updated);
  };

  const updateMilestoneField = (index: number, field: string, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue("milestones", updated);
  };
  
  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <FormLabel className="text-base">Key Deliverables</FormLabel>
            <Button
              type="button"
              onClick={addDeliverable}
              variant="outline"
              size="sm"
              disabled={deliverables.length >= 15}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Add Deliverable
            </Button>
          </div>
          
          <FormDescription className="mb-4">
            Define the key deliverables for this taskforce (maximum 15 entries)
          </FormDescription>
        </div>

        {deliverables.length > 0 ? (
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deliverable</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliverables.map((deliverable, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input 
                        value={deliverable.name} 
                        onChange={(e) => updateDeliverableField(index, "name", e.target.value)}
                        placeholder="Deliverable name" 
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea 
                        value={deliverable.description} 
                        onChange={(e) => updateDeliverableField(index, "description", e.target.value)}
                        placeholder="Description" 
                        className="min-h-[80px]"
                        wordLimit={150}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={deliverable.deadline} 
                        onChange={(e) => updateDeliverableField(index, "deadline", e.target.value)}
                        placeholder="Deadline"
                        type="date" 
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={deliverable.status} 
                        onValueChange={(value) => updateDeliverableField(index, "status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeDeliverable(index)}
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
            <p className="text-sm text-muted-foreground mb-4">No deliverables added yet</p>
            <Button 
              variant="outline" 
              onClick={addDeliverable}
            >
              Add First Deliverable
            </Button>
          </div>
        )}
        
        <FormMessage />
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <FormLabel className="text-base">Milestones</FormLabel>
            <Button
              type="button"
              onClick={addMilestone}
              variant="outline"
              size="sm"
              disabled={milestones.length >= 15}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Add Milestone
            </Button>
          </div>
          
          <FormDescription className="mb-4">
            Define the milestones for this taskforce (maximum 15 entries)
          </FormDescription>
        </div>

        {milestones.length > 0 ? (
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {milestones.map((milestone, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input 
                        value={milestone.name} 
                        onChange={(e) => updateMilestoneField(index, "name", e.target.value)}
                        placeholder="Milestone name" 
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea 
                        value={milestone.description} 
                        onChange={(e) => updateMilestoneField(index, "description", e.target.value)}
                        placeholder="Description" 
                        className="min-h-[80px]"
                        wordLimit={150}
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeMilestone(index)}
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
            <p className="text-sm text-muted-foreground mb-4">No milestones added yet</p>
            <Button 
              variant="outline" 
              onClick={addMilestone}
            >
              Add First Milestone
            </Button>
          </div>
        )}
        
        <FormMessage />
      </div>
    </div>
  );
};
