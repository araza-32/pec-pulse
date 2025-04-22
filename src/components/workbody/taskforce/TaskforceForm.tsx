import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CompositionSection } from "./CompositionSection";
import { DeliverablesSection } from "./DeliverablesSection";
import { OperatingProceduresSection } from "./OperatingProceduresSection";
import { OverviewSection } from "./OverviewSection";
import { ScopeSection } from "./ScopeSection";
import { SignaturesSection } from "./SignaturesSection";
import { TaskforceFormValues } from "@/types/taskforce";
import { useToast } from "@/hooks/use-toast";

// Create schema based on the TaskforceFormValues type
const taskforceSchema = z.object({
  // Overview section
  name: z.string().min(3, "Name must be at least 3 characters"),
  proposedBy: z.string().min(2, "Proposed by is required"),
  purpose: z.string().max(300, "Purpose cannot exceed 300 words"),
  
  // Scope section
  alignment: z.string().max(300, "Alignment cannot exceed 300 words"),
  expectedOutcomes: z.array(z.string()),
  mandates: z.array(z.string()),
  durationMonths: z.number().min(1, "Duration must be at least 1 month"),
  
  // Composition section
  members: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      expertise: z.string(),
      responsibilities: z.string(),
      mobile: z.string(),
      email: z.string(),
      address: z.string(),
    })
  ),
  
  // Operating procedures section
  meetings: z.array(
    z.object({
      meetingRequired: z.string(),
      dateTime: z.string(),
      mode: z.enum(["physical", "hybrid", "virtual"]),
      venue: z.string(),
    })
  ),
  
  // Deliverables section
  deliverables: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      deadline: z.string(),
      status: z.enum(["pending", "in-progress", "completed", "delayed"]),
    })
  ),
  milestones: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
  
  // Signatures section
  proposerName: z.string(),
  proposerDate: z.string(),
  proposerSignature: z.string(),
  
  reviewerName: z.string(),
  reviewerDate: z.string(),
  reviewerSignature: z.string(),
  
  approverName: z.string(),
  approverDate: z.string(),
  approverSignature: z.string(),
  
  // Workbody standard fields
  type: z.literal("task-force"),
  createdDate: z.date(),
  endDate: z.date().optional(),
});

interface TaskforceFormProps {
  onSubmit: (data: TaskforceFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<TaskforceFormValues>;
}

export function TaskforceForm({ onSubmit, onCancel, initialData }: TaskforceFormProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Set up default values with safety checks for all properties
  // Handle arrays specially since they are often causing issues
  const getDefaultMembers = () => {
    if (initialData?.members && Array.isArray(initialData.members)) {
      return initialData.members;
    }
    return [];
  };

  const getDefaultMeetings = () => {
    if (initialData?.meetings && Array.isArray(initialData.meetings)) {
      return initialData.meetings;
    }
    return [];
  };

  const getDefaultDeliverables = () => {
    if (initialData?.deliverables && Array.isArray(initialData.deliverables)) {
      return initialData.deliverables;
    }
    return [];
  };

  const getDefaultMilestones = () => {
    if (initialData?.milestones && Array.isArray(initialData.milestones)) {
      return initialData.milestones;
    }
    return [];
  };

  const getDefaultExpectedOutcomes = () => {
    if (initialData?.expectedOutcomes && Array.isArray(initialData.expectedOutcomes)) {
      return initialData.expectedOutcomes;
    }
    return [];
  };

  const getDefaultMandates = () => {
    if (initialData?.mandates && Array.isArray(initialData.mandates)) {
      return initialData.mandates;
    }
    return [];
  };

  // Set up the form with proper default values and safety checks
  const form = useForm<TaskforceFormValues>({
    resolver: zodResolver(taskforceSchema),
    defaultValues: {
      name: initialData?.name || "",
      proposedBy: initialData?.proposedBy || "",
      purpose: initialData?.purpose || "",
      
      alignment: initialData?.alignment || "",
      expectedOutcomes: getDefaultExpectedOutcomes(),
      mandates: getDefaultMandates(),
      durationMonths: initialData?.durationMonths || 3,
      
      members: getDefaultMembers(),
      meetings: getDefaultMeetings(),
      deliverables: getDefaultDeliverables(),
      milestones: getDefaultMilestones(),
      
      proposerName: initialData?.proposerName || "",
      proposerDate: initialData?.proposerDate || "",
      proposerSignature: initialData?.proposerSignature || "",
      
      reviewerName: initialData?.reviewerName || "",
      reviewerDate: initialData?.reviewerDate || "",
      reviewerSignature: initialData?.reviewerSignature || "",
      
      approverName: initialData?.approverName || "",
      approverDate: initialData?.approverDate || "",
      approverSignature: initialData?.approverSignature || "",
      
      type: "task-force",
      createdDate: initialData?.createdDate || new Date(),
      endDate: initialData?.endDate,
    },
    mode: "onChange"
  });

  const handleSubmit = (data: TaskforceFormValues) => {
    try {
      // Calculate end date based on duration in months
      const endDate = new Date(data.createdDate);
      endDate.setMonth(endDate.getMonth() + data.durationMonths);
      data.endDate = endDate;
      
      // Submit the form data
      onSubmit(data);
    } catch (error) {
      console.error("Error in TaskforceForm handleSubmit:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting the form. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigateToNextTab = (currentTab: string) => {
    switch(currentTab) {
      case "overview":
        setActiveTab("scope");
        break;
      case "scope":
        setActiveTab("composition");
        break;
      case "composition":
        setActiveTab("procedures");
        break;
      case "procedures":
        setActiveTab("deliverables");
        break;
      case "deliverables":
        setActiveTab("signatures");
        break;
      default:
        break;
    }
  };

  const navigateToPreviousTab = (currentTab: string) => {
    switch(currentTab) {
      case "scope":
        setActiveTab("overview");
        break;
      case "composition":
        setActiveTab("scope");
        break;
      case "procedures":
        setActiveTab("composition");
        break;
      case "deliverables":
        setActiveTab("procedures");
        break;
      case "signatures":
        setActiveTab("deliverables");
        break;
      default:
        break;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scope">Scope & ToRs</TabsTrigger>
            <TabsTrigger value="composition">Composition</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="signatures">Signatures</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <OverviewSection form={form} />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button 
                type="button" 
                onClick={() => {
                  form.trigger(["name", "proposedBy", "purpose"]).then(isValid => {
                    if (isValid) {
                      navigateToNextTab("overview");
                    } else {
                      toast({
                        title: "Validation Error",
                        description: "Please fill in all required fields correctly before proceeding.",
                        variant: "destructive",
                      });
                    }
                  });
                }}
              >
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="scope" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <ScopeSection form={form} />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigateToPreviousTab("scope")}>Previous</Button>
              <Button 
                type="button" 
                onClick={() => {
                  form.trigger(["alignment", "durationMonths"]).then(isValid => {
                    if (isValid) {
                      navigateToNextTab("scope");
                    } else {
                      toast({
                        title: "Validation Error",
                        description: "Please fill in all required fields correctly before proceeding.",
                        variant: "destructive",
                      });
                    }
                  });
                }}
              >
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="composition" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <CompositionSection form={form} />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigateToPreviousTab("composition")}>Previous</Button>
              <Button type="button" onClick={() => navigateToNextTab("composition")}>Next</Button>
            </div>
          </TabsContent>

          <TabsContent value="procedures" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <OperatingProceduresSection form={form} />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigateToPreviousTab("procedures")}>Previous</Button>
              <Button type="button" onClick={() => navigateToNextTab("procedures")}>Next</Button>
            </div>
          </TabsContent>

          <TabsContent value="deliverables" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <DeliverablesSection form={form} />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigateToPreviousTab("deliverables")}>Previous</Button>
              <Button type="button" onClick={() => navigateToNextTab("deliverables")}>Next</Button>
            </div>
          </TabsContent>

          <TabsContent value="signatures" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <SignaturesSection form={form} />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigateToPreviousTab("signatures")}>Previous</Button>
              <Button type="submit">Submit Taskforce</Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
