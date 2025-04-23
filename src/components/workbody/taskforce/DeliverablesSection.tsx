
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaskforceFormValues } from "@/types/taskforce";
import { UseFormReturn } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

interface DeliverablesSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}
export const DeliverablesSection = ({ form }: DeliverablesSectionProps) => {
  const [deliverables, setDeliverables] = useState(form.getValues("deliverables") || []);
  const [milestones, setMilestones] = useState(form.getValues("milestones") || []);

  const addDeliverable = () => {
    const newDeliverable = {
      id: uuidv4(),
      name: "",
      description: "",
      deadline: "",
      status: "pending" as "pending" | "in-progress" | "completed" | "delayed",
    };
    setDeliverables([...deliverables, newDeliverable]);
    form.setValue("deliverables", [...deliverables, newDeliverable]);
  };

  const updateDeliverable = (id: string, field: string, value: string) => {
    const updatedDeliverables = deliverables.map(deliverable =>
      deliverable.id === id ? { ...deliverable, [field]: value } : deliverable
    );
    setDeliverables(updatedDeliverables);
    form.setValue("deliverables", updatedDeliverables);
  };

  const removeDeliverable = (id: string) => {
    const updatedDeliverables = deliverables.filter(deliverable => deliverable.id !== id);
    setDeliverables(updatedDeliverables);
    form.setValue("deliverables", updatedDeliverables);
  };

  const addMilestone = () => {
    const newMilestone = {
      id: uuidv4(),
      name: "",
      description: "",
    };
    setMilestones([...milestones, newMilestone]);
    form.setValue("milestones", [...milestones, newMilestone]);
  };

  const updateMilestone = (id: string, field: string, value: string) => {
    const updatedMilestones = milestones.map(milestone =>
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    );
    setMilestones(updatedMilestones);
    form.setValue("milestones", updatedMilestones);
  };

  const removeMilestone = (id: string) => {
    const updatedMilestones = milestones.filter(milestone => milestone.id !== id);
    setMilestones(updatedMilestones);
    form.setValue("milestones", updatedMilestones);
  };

  return (
    <div className="space-y-8 print:bg-white print:text-black print:shadow-none">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Deliverables & Deadlines</h3>
        {deliverables.map((deliverable, index) => (
          <div key={deliverable.id || index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name={`deliverables.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deliverable Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter deliverable name"
                      value={deliverable.name || field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        updateDeliverable(deliverable.id || "", "name", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`deliverables.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="min-h-[40px]"
                      value={deliverable.description || field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        updateDeliverable(deliverable.id || "", "description", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`deliverables.${index}.deadline`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-full pl-3 text-left font-normal"
                        >
                          {deliverable.deadline ? (
                            format(new Date(deliverable.deadline), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deliverable.deadline ? new Date(deliverable.deadline) : undefined}
                        onSelect={(date) => {
                          const dateString = date ? date.toISOString() : "";
                          field.onChange(dateString);
                          updateDeliverable(deliverable.id || "", "deadline", dateString);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`deliverables.${index}.status`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      updateDeliverable(deliverable.id || "", "status", value);
                    }}
                    defaultValue={deliverable.status || field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-end justify-end">
              <Button type="button" variant="destructive" size="sm" onClick={() => removeDeliverable(deliverable.id || "")}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" onClick={addDeliverable}>Add Deliverable</Button>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Milestones</h3>
        {milestones.map((milestone, index) => (
          <div key={milestone.id || index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`milestones.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Milestone Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter milestone name"
                      value={milestone.name || field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        updateMilestone(milestone.id || "", "name", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`milestones.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="min-h-[40px]"
                      value={milestone.description || field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        updateMilestone(milestone.id || "", "name", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-end justify-end">
              <Button type="button" variant="destructive" size="sm" onClick={() => removeMilestone(milestone.id || "")}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" onClick={addMilestone}>Add Milestone</Button>
      </div>
    </div>
  );
};
