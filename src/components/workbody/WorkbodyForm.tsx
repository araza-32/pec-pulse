import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Workbody, WorkbodyType } from "@/types";
import { WorkbodyFormData } from "@/types/workbody";
import { cn } from "@/lib/utils";

// Updated schema to make end date required when type is task-force
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  type: z.enum(["committee", "working-group", "task-force"] as const),
  description: z.string().optional(),
  createdDate: z.date(),
  endDate: z.date().optional(),
  termsOfReference: z.string().optional(),
}).refine((data) => {
  // If type is task-force, endDate is required
  return data.type !== "task-force" || data.endDate !== undefined;
}, {
  message: "End date is required for task forces",
  path: ["endDate"]
});

type WorkbodyFormProps = {
  initialData?: Partial<Workbody>;
  onSubmit: (data: WorkbodyFormData) => void;
  onCancel: () => void;
};

export function WorkbodyForm({
  initialData,
  onSubmit,
  onCancel,
}: WorkbodyFormProps) {
  const [showEndDate, setShowEndDate] = useState(
    initialData?.type === "task-force" || false
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: (initialData?.type as WorkbodyType) || "committee",
      description: initialData?.description || "",
      createdDate: initialData?.createdDate
        ? new Date(initialData.createdDate)
        : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      termsOfReference: initialData?.termsOfReference || "",
    },
    mode: "onChange" // Enable validation on change
  });

  // Watch for changes in the type field to show/hide end date field
  const workbodyType = form.watch("type");
  
  useEffect(() => {
    setShowEndDate(workbodyType === "task-force");
    
    // Clear end date if not task-force
    if (workbodyType !== "task-force") {
      form.setValue("endDate", undefined);
    }
  }, [workbodyType, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values as WorkbodyFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter workbody name" {...field} />
              </FormControl>
              <FormDescription>
                Full name of the committee, working group or task force
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={(value: WorkbodyType) => {
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workbody type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="committee">Committee</SelectItem>
                  <SelectItem value="working-group">Working Group</SelectItem>
                  <SelectItem value="task-force">Task Force</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Type of workbody</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description of the workbody"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createdDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Creation Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Date when this workbody was created
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {showEndDate && (
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date <span className="text-red-500">*</span></FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  End date is required for task forces
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="termsOfReference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terms of Reference</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter terms of reference or mandate"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the Terms of Reference or mandate for this workbody
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit">Save Workbody</Button>
        </div>
      </form>
    </Form>
  );
}
