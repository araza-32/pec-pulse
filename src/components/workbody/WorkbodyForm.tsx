
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Upload } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualMemberAddition } from "./ManualMemberAddition";

// Updated schema without description, as we'll be using members instead
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  type: z.enum(["committee", "working-group", "task-force"] as const),
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
  const [activeTab, setActiveTab] = useState("basic-info");
  const [workbodyId, setWorkbodyId] = useState<string | null>(null);
  const [notificationUploaded, setNotificationUploaded] = useState(false);
  const [torUploaded, setTorUploaded] = useState(false);
  const [addMembersManually, setAddMembersManually] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: (initialData?.type as WorkbodyType) || "committee",
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
    // Pass the data without description, as we'll handle members separately
    onSubmit(values as WorkbodyFormData);
  };

  const handleNotificationUpload = (documentId: string) => {
    setNotificationUploaded(true);
    // We won't extract members automatically if user chose manual addition
  };

  const handleTorUpload = (documentId: string) => {
    setTorUploaded(true);
    // Update terms of reference if needed
  };

  const handleMembersAdded = () => {
    // Move to next tab or close form as needed
    setActiveTab("review");
  };

  // For demo purposes only - in real implementation, this would be the ID from the created workbody
  useEffect(() => {
    if (initialData?.id) {
      setWorkbodyId(initialData.id);
    }
  }, [initialData]);

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="basic-info" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="documents" disabled={!form.formState.isValid}>Documents</TabsTrigger>
          <TabsTrigger value="members" disabled={!form.formState.isValid}>Members</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
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
                            type="button"
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
                              type="button"
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

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onCancel} type="button">
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    if (form.formState.isValid) {
                      setActiveTab("documents");
                    }
                  }}
                  disabled={!form.formState.isValid}
                >
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Upload Documents</h3>
              
              {/* Notification Upload Section */}
              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium mb-2">Upload Notification</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a notification document containing workbody details and members.
                </p>
                {!workbodyId ? (
                  <div className="flex items-center justify-center h-24 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      You'll be able to upload after saving the basic information.
                    </p>
                  </div>
                ) : notificationUploaded ? (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 flex items-center">
                      <span className="mr-2">✓</span> Notification uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Document upload will be available here
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms of Reference Upload Section */}
              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium mb-2">Upload Terms of Reference</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload the terms of reference document for this workbody.
                </p>
                {!workbodyId ? (
                  <div className="flex items-center justify-center h-24 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      You'll be able to upload after saving the basic information.
                    </p>
                  </div>
                ) : torUploaded ? (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 flex items-center">
                      <span className="mr-2">✓</span> Terms of Reference uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Document upload will be available here
                      </p>
                    </div>
                  </div>
                )}

                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="termsOfReference"
                    render={({ field }) => (
                      <FormItem className="mt-4">
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
                </Form>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" type="button" onClick={() => setActiveTab("basic-info")}>
                Back
              </Button>
              <Button type="button" onClick={() => setActiveTab("members")}>
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="members">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Add Members</h3>
            
            {!workbodyId ? (
              <div className="flex items-center justify-center h-60 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  You'll be able to add members after saving the basic information.
                </p>
              </div>
            ) : (
              <ManualMemberAddition
                workbodyId={workbodyId}
                onMembersAdded={handleMembersAdded}
                onCancel={() => {}} // We'll handle this differently
              />
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" type="button" onClick={() => setActiveTab("documents")}>
                Back
              </Button>
              <Button 
                type="button" 
                onClick={() => form.handleSubmit(handleSubmit)()}
              >
                Save Workbody
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
