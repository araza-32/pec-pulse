import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaskforceFormValues } from "@/types/taskforce";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

interface OperatingProceduresSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}
export const OperatingProceduresSection = ({ form }: OperatingProceduresSectionProps) => {
  const handleAddMeeting = () => {
    form.setValue("meetings", [
      ...form.getValues().meetings,
      { meetingRequired: "", dateTime: "", mode: "physical", venue: "" },
    ]);
  };

  const handleRemoveMeeting = (index: number) => {
    const updatedMeetings = [...form.getValues().meetings];
    updatedMeetings.splice(index, 1);
    form.setValue("meetings", updatedMeetings);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Meetings</h3>
      <Table>
        <TableCaption>Add details of required meetings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Meeting Required</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {form.getValues().meetings.map((meeting, index) => (
            <TableRow key={index}>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`meetings.${index}.meetingRequired`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter meeting requirement" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`meetings.${index}.dateTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`meetings.${index}.mode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="physical">Physical</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="virtual">Virtual</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`meetings.${index}.venue`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter venue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMeeting(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button type="button" variant="secondary" onClick={handleAddMeeting}>
        Add Meeting
      </Button>
    </div>
  );
};
