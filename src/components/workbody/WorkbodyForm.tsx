
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualMemberAddition } from "./ManualMemberAddition";
import { DocumentUpload } from "./DocumentUpload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TaskforceForm } from "./taskforce/TaskforceForm";
import { TaskforceFormValues } from "@/types/taskforce";

const standardFormSchema = z.object({
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
  const [membersAdded, setMembersAdded] = useState(false);
  const [isUploadNotificationOpen, setIsUploadNotificationOpen] = useState(false);
  const [isUploadTorOpen, setIsUploadTorOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof standardFormSchema>>({
    resolver: zodResolver(standardFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: (initialData?.type as WorkbodyType) || "committee",
      createdDate: initialData?.createdDate
        ? new Date(initialData.createdDate)
        : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      termsOfReference: initialData?.termsOfReference || "",
    },
    mode: "onChange"
  });

  const workbodyType = form.watch("type");
  
  // Improved function to safely map initial data to taskforce format
  const mapInitialDataToTaskforce = (): Partial<TaskforceFormValues> | undefined => {
    if (!initialData) return undefined;
    
    // Base properties that are always available
    const baseData: Partial<TaskforceFormValues> = {
      name: initialData.name || "",
      type: "task-force" as const,
      createdDate: initialData.createdDate ? new Date(initialData.createdDate) : new Date(),
      endDate: initialData.endDate ? new Date(initialData.endDate) : undefined,
    };

    // Try to parse TOR JSON if it exists
    if (initialData.termsOfReference) {
      try {
        const torData = JSON.parse(initialData.termsOfReference);
        
        return {
          ...baseData,
          proposedBy: torData.overview?.proposedBy || "",
          purpose: torData.overview?.purpose || "",
          alignment: torData.scope?.alignment || "",
          expectedOutcomes: Array.isArray(torData.scope?.expectedOutcomes) ? torData.scope.expectedOutcomes : [],
          mandates: Array.isArray(torData.scope?.mandates) ? torData.scope.mandates : [],
          durationMonths: Number(torData.scope?.durationMonths) || 3,
          members: Array.isArray(torData.composition) ? torData.composition : [],
          meetings: Array.isArray(torData.procedures) ? torData.procedures : [],
          deliverables: Array.isArray(torData.deliverables) ? torData.deliverables : [],
          milestones: Array.isArray(torData.milestones) ? torData.milestones : [],
          proposerName: torData.signatures?.proposer?.name || "",
          proposerDate: torData.signatures?.proposer?.date || "",
          proposerSignature: torData.signatures?.proposer?.signature || "",
          reviewerName: torData.signatures?.reviewer?.name || "",
          reviewerDate: torData.signatures?.reviewer?.date || "",
          reviewerSignature: torData.signatures?.reviewer?.signature || "",
          approverName: torData.signatures?.approver?.name || "",
          approverDate: torData.signatures?.approver?.date || "",
          approverSignature: torData.signatures?.approver?.signature || ""
        };
      } catch (e) {
        console.error("Error parsing TOR JSON:", e);
        // Return base data if JSON parsing fails
        return baseData;
      }
    }
    
    // Return base data if no TOR or parsing failed
    return baseData;
  };
  
  // Show TaskforceForm if type is task-force
  if (workbodyType === "task-force") {
    const mappedInitialData = mapInitialDataToTaskforce();
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Create a Task Force</h2>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        
        <TaskforceForm 
          onSubmit={(data: TaskforceFormValues) => {
            try {
              // Convert TaskforceFormValues to WorkbodyFormData
              onSubmit({
                name: data.name,
                type: "task-force",
                createdDate: data.createdDate,
                endDate: data.endDate,
                description: data.purpose,
                termsOfReference: JSON.stringify({
                  overview: {
                    proposedBy: data.proposedBy,
                    purpose: data.purpose
                  },
                  scope: {
                    alignment: data.alignment,
                    expectedOutcomes: data.expectedOutcomes || [],
                    mandates: data.mandates || [],
                    durationMonths: data.durationMonths
                  },
                  composition: data.members || [],
                  procedures: data.meetings || [],
                  deliverables: data.deliverables || [],
                  milestones: data.milestones || [],
                  signatures: {
                    proposer: {
                      name: data.proposerName,
                      date: data.proposerDate,
                      signature: data.proposerSignature
                    },
                    reviewer: {
                      name: data.reviewerName,
                      date: data.reviewerDate,
                      signature: data.reviewerSignature
                    },
                    approver: {
                      name: data.approverName,
                      date: data.approverDate,
                      signature: data.approverSignature
                    }
                  }
                })
              });
            } catch (error: any) {
              console.error("Error submitting task force form:", error);
              toast({
                title: "Error",
                description: "Failed to create task force. Please try again.",
                variant: "destructive",
              });
            }
          }}
          onCancel={onCancel}
          initialData={mappedInitialData}
        />
      </div>
    );
  }
  
  useEffect(() => {
    setShowEndDate(form.getValues("type") === "task-force");
    
    if (form.getValues("type") === "task-force") {
      form.setValue("endDate", undefined);
    }
  }, [workbodyType, form]);

  useEffect(() => {
    if (!workbodyId && form.formState.isValid && activeTab === "documents") {
      createTemporaryWorkbody();
    }
  }, [form.formState.isValid, activeTab]);

  const createTemporaryWorkbody = async () => {
    try {
      const values = form.getValues();
      
      const { data, error } = await supabase
        .from('workbodies')
        .insert({
          name: values.name,
          type: values.type,
          description: "",
          created_date: values.createdDate.toISOString(),
          end_date: values.endDate ? values.endDate.toISOString() : null,
          terms_of_reference: values.termsOfReference || "",
          total_meetings: 0,
          meetings_this_year: 0,
          actions_agreed: 0,
          actions_completed: 0,
        })
        .select("id")
        .single();

      if (error) throw error;
      
      if (data) {
        setWorkbodyId(data.id);
        
        toast({
          title: "Temporary record created",
          description: "You can now upload documents and add members.",
        });
      }
    } catch (error: any) {
      console.error("Error creating temporary workbody:", error);
      toast({
        title: "Error",
        description: "Failed to create temporary workbody. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (values: z.infer<typeof standardFormSchema>) => {
    if (!workbodyId || !notificationUploaded || !membersAdded) {
      toast({
        title: "Required steps not completed",
        description: "Please upload documents and add members before creating the workbody.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      onSubmit({
        id: workbodyId,
        ...values
      } as any);
      
    } catch (error: any) {
      console.error("Error finalizing workbody:", error);
      toast({
        title: "Error",
        description: "Failed to finalize workbody creation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationUpload = (documentId: string) => {
    setNotificationUploaded(true);
    setIsUploadNotificationOpen(false);
    toast({
      title: "Notification uploaded",
      description: "The notification document has been uploaded successfully."
    });
  };

  const handleTorUpload = (documentId: string) => {
    setTorUploaded(true);
    setIsUploadTorOpen(false);
    toast({
      title: "Terms of Reference uploaded",
      description: "The Terms of Reference document has been uploaded successfully."
    });
  };

  const handleMembersAdded = () => {
    setMembersAdded(true);
    toast({
      title: "Members added",
      description: "Members have been successfully added to the workbody."
    });
    setActiveTab("review");
  };

  const isDocumentsTabEnabled = form.formState.isValid;

  return (
    <div className="space-y-6">
      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="documents" disabled={!isDocumentsTabEnabled}>Documents</TabsTrigger>
          <TabsTrigger value="members" disabled={!workbodyId || (!notificationUploaded && !torUploaded)}>Members</TabsTrigger>
          <TabsTrigger value="review" disabled={!membersAdded}>Review</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-4">Workbody Information</h3>
            <Form {...form}>
              <form className="space-y-6">
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
              </form>
            </Form>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                if (form.formState.isValid) {
                  setActiveTab("documents");
                } else {
                  form.trigger();
                }
              }}
            >
              Next
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-4">Upload Documents</h3>
              
              <div className="border rounded-lg p-4 mb-4">
                <h4 className="text-md font-medium mb-2">Upload Notification</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a notification document containing workbody details and members.
                </p>
                {notificationUploaded ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 flex items-center">
                      <span className="mr-2">✓</span> Notification uploaded successfully
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setIsUploadNotificationOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Upload Notification
                  </Button>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium mb-2">Upload Terms of Reference</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload the terms of reference document for this workbody.
                </p>
                {torUploaded ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 flex items-center">
                      <span className="mr-2">✓</span> Terms of Reference uploaded successfully
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setIsUploadTorOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Upload Terms of Reference
                  </Button>
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
              <Button 
                type="button" 
                onClick={() => {
                  if (notificationUploaded || torUploaded) {
                    setActiveTab("members");
                  } else {
                    toast({
                      title: "Required documents missing",
                      description: "Please upload at least one document before proceeding.",
                      variant: "destructive"
                    });
                  }
                }}
                disabled={!notificationUploaded && !torUploaded}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="members">
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-4">Add Members</h3>
              
              {workbodyId ? (
                <ManualMemberAddition
                  workbodyId={workbodyId}
                  onMembersAdded={handleMembersAdded}
                  onCancel={() => setActiveTab("documents")}
                />
              ) : (
                <div className="flex items-center justify-center h-60 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Loading... Please wait while we prepare the member addition form.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" type="button" onClick={() => setActiveTab("documents")}>
                Back
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="review">
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-4">Review and Create Workbody</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm">Name</h4>
                    <p className="text-muted-foreground">{form.getValues("name")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Type</h4>
                    <p className="text-muted-foreground capitalize">{form.getValues("type").replace("-", " ")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Creation Date</h4>
                    <p className="text-muted-foreground">{format(form.getValues("createdDate"), "PPP")}</p>
                  </div>
                  {form.getValues("endDate") && (
                    <div>
                      <h4 className="font-medium text-sm">End Date</h4>
                      <p className="text-muted-foreground">{format(form.getValues("endDate")!, "PPP")}</p>
                    </div>
                  )}
                </div>
                
                <div className="rounded-lg bg-muted p-3">
                  <h4 className="font-medium text-sm mb-1">Document Status</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> 
                      <span>Notification: {notificationUploaded ? 'Uploaded' : 'Not uploaded'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> 
                      <span>Terms of Reference: {torUploaded ? 'Uploaded' : 'Not uploaded'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> 
                      <span>Members: Added successfully</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" type="button" onClick={() => setActiveTab("members")}>
                Back
              </Button>
              <Button type="button" onClick={() => form.handleSubmit(handleSubmit)()}>
                Create Workbody
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {workbodyId && (
        <>
          <DocumentUpload
            workbodyId={workbodyId}
            documentType="notification"
            isOpen={isUploadNotificationOpen}
            onClose={() => setIsUploadNotificationOpen(false)}
            onUploadComplete={handleNotificationUpload}
          />

          <DocumentUpload
            workbodyId={workbodyId}
            documentType="tor"
            isOpen={isUploadTorOpen}
            onClose={() => setIsUploadTorOpen(false)}
            onUploadComplete={handleTorUpload}
          />
        </>
      )}
    </div>
  );
}
