
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUpload } from "@/components/workbody/DocumentUpload";
import { ManualMemberAddition } from "@/components/workbody/ManualMemberAddition";
import { Workbody, WorkbodyType } from "@/types";
import { WorkbodyFormData } from "@/types/workbody";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  type: z.enum(["committee", "working-group", "task-force"] as const),
  createdDate: z.date(),
  endDate: z.date().optional(),
  termsOfReference: z.string().optional(),
}).refine((data) => {
  return data.type !== "task-force" || data.endDate !== undefined;
}, {
  message: "End date is required for task forces",
  path: ["endDate"]
});

type CreateWorkbodyFormProps = {
  initialData?: Partial<Workbody>;
  onSubmit: (data: WorkbodyFormData) => void;
  onCancel: () => void;
};

export function CreateWorkbodyForm({
  initialData,
  onSubmit,
  onCancel,
}: CreateWorkbodyFormProps) {
  const [showEndDate, setShowEndDate] = useState(
    initialData?.type === "task-force" || false
  );
  const [manualMemberAddition, setManualMemberAddition] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: (initialData?.type as WorkbodyType) || "committee",
      createdDate: initialData?.createdDate ? new Date(initialData.createdDate) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      termsOfReference: initialData?.termsOfReference || "",
    },
    mode: "onChange"
  });

  const workbodyType = form.watch("type");
  
  const handleDocumentUpload = (documentId: string) => {
    setDocumentUploaded(true);
    toast({
      title: "Document uploaded",
      description: "The notification has been successfully uploaded.",
    });
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    onSubmit(values as WorkbodyFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
            <TabsTrigger value="members" className="flex-1">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter workbody name" {...field} />
                  </FormControl>
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
                      setShowEndDate(value === "task-force");
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
                      />
                    </PopoverContent>
                  </Popover>
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
                    <FormLabel>End Date</FormLabel>
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Notification</h4>
                <DocumentUpload
                  workbodyId={initialData?.id || "temp"}
                  documentType="notification"
                  isOpen={true}
                  onClose={() => {}}
                  onUploadComplete={handleDocumentUpload}
                />
              </div>
              
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="termsOfReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms of Reference</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter terms of reference"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4 mt-4">
            <div className="space-y-4">
              <ManualMemberAddition
                workbodyId={initialData?.id || "temp"}
                onMembersAdded={() => {
                  toast({
                    title: "Members Added",
                    description: "Members have been successfully added to the workbody.",
                  });
                }}
                onCancel={() => {}}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit">Save Workbody</Button>
        </div>
      </form>
    </Form>
  );
}
