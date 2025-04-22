
import { Button } from "@/components/ui/button";
import { FormDescription, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskforceFormValues } from "@/types/taskforce";
import { PlusCircle, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OperatingProceduresSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}

export const OperatingProceduresSection = ({ form }: OperatingProceduresSectionProps) => {
  const meetings = form.watch("meetings") || [];
  
  const addMeeting = () => {
    if (meetings.length < 15) {
      form.setValue("meetings", [
        ...meetings, 
        { 
          meetingRequired: "", 
          dateTime: "", 
          mode: "physical", 
          venue: "" 
        }
      ]);
    }
  };
  
  const removeMeeting = (index: number) => {
    const updated = [...meetings];
    updated.splice(index, 1);
    form.setValue("meetings", updated);
  };

  const updateMeetingField = (index: number, field: string, value: string) => {
    const updated = [...meetings];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue("meetings", updated);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <FormLabel className="text-base">Operating Procedures</FormLabel>
          <Button
            type="button"
            onClick={addMeeting}
            variant="outline"
            size="sm"
            disabled={meetings.length >= 15}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" /> Add Meeting
          </Button>
        </div>
        
        <FormDescription className="mb-4">
          Define the meetings required for this taskforce (maximum 15 entries)
        </FormDescription>
      </div>

      {meetings.length > 0 ? (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meetings Required</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input 
                      value={meeting.meetingRequired} 
                      onChange={(e) => updateMeetingField(index, "meetingRequired", e.target.value)}
                      placeholder="Meeting description" 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={meeting.dateTime} 
                      onChange={(e) => updateMeetingField(index, "dateTime", e.target.value)}
                      placeholder="Date & Time" 
                      type="datetime-local"
                    />
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={meeting.mode} 
                      onValueChange={(value) => updateMeetingField(index, "mode", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical">Physical</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={meeting.venue} 
                      onChange={(e) => updateMeetingField(index, "venue", e.target.value)}
                      placeholder="Venue"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeMeeting(index)}
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
          <p className="text-sm text-muted-foreground mb-4">No meetings added yet</p>
          <Button 
            variant="outline" 
            onClick={addMeeting}
          >
            Add First Meeting
          </Button>
        </div>
      )}
      
      <FormMessage />
    </div>
  );
};
