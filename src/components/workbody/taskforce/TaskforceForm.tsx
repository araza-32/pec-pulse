
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { TaskforceFormValues } from "@/types/taskforce";
import { useToast } from "@/hooks/use-toast";
import { OverviewSection } from "./OverviewSection";
import { ScopeSection } from "./ScopeSection";
import { CompositionSection } from "./CompositionSection";
import { OperatingProceduresSection } from "./OperatingProceduresSection";
import { DeliverablesSection } from "./DeliverablesSection";
import { SignaturesSection } from "./SignaturesSection";
import { TaskforceNavigation } from "./TaskforceNavigation";
import { useTaskforceForm } from "@/hooks/useTaskforceForm";
import { TaskforcePrintableSummary } from "./TaskforcePrintableSummary";

interface TaskforceFormProps {
  onSubmit: (data: TaskforceFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<TaskforceFormValues>;
  onAfterSubmit?: () => void; // New callback for after submission actions
}

export function TaskforceForm({ onSubmit, onCancel, initialData, onAfterSubmit }: TaskforceFormProps) {
  // MOCK_USER_ROLE is a fallback. In app, role should come from auth/user context.
  const [userRole] = useState<"admin" | "coordination" | "secretary">(
    (window as any).MOCK_USER_ROLE || "admin"
  );
  // The review tab is only shown to secretary
  const showSubmitTab = userRole === "secretary";
  // Print is only for admin/coordination
  const canPrint = userRole === "admin" || userRole === "coordination";

  // Remove 'review' tab for admin/coordination
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const form = useTaskforceForm(initialData);

  // For post-submission success state
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleSubmit = (data: TaskforceFormValues) => {
    try {
      // Calculate endDate based on durationMonths for storage consistency
      const endDate = new Date(data.createdDate);
      endDate.setMonth(endDate.getMonth() + data.durationMonths);
      data.endDate = endDate;
      onSubmit(data);
      
      // Handle secretary submission flow
      if (userRole === "secretary") {
        setRequestSubmitted(true);
        toast({
          title: "Request Submitted",
          description: "Your Task Force Formation request has been submitted successfully and is being reviewed.",
        });
        // Call the onAfterSubmit callback if provided
        if (onAfterSubmit) {
          setTimeout(() => onAfterSubmit(), 3000);
        }
      }
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
      case "signatures":
        if (showSubmitTab) setActiveTab("submit-request");
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
      case "submit-request":
        setActiveTab("signatures");
        break;
      default:
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={canPrint ? "grid w-full grid-cols-6" : "grid w-full grid-cols-7"}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scope">Scope & ToRs</TabsTrigger>
            <TabsTrigger value="composition">Composition</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="signatures">Signatures</TabsTrigger>
            {showSubmitTab && <TabsTrigger value="submit-request">Submit Request</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <OverviewSection form={form} />
            </div>
            <TaskforceNavigation
              activeTab={activeTab}
              onPrevious={onCancel}
              onNext={() => {
                form.trigger(["name", "proposedBy", "purpose"]).then(isValid => {
                  if (isValid) {
                    navigateToNextTab(activeTab);
                  } else {
                    toast({
                      title: "Validation Error",
                      description: "Please fill in all required fields correctly before proceeding.",
                      variant: "destructive",
                    });
                  }
                });
              }}
              onCancel={onCancel}
              isFirstTab={true}
            />
          </TabsContent>

          <TabsContent value="scope" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <ScopeSection form={form} />
            </div>
            <TaskforceNavigation
              activeTab={activeTab}
              onPrevious={() => navigateToPreviousTab(activeTab)}
              onNext={() => navigateToNextTab(activeTab)}
              onCancel={onCancel}
            />
          </TabsContent>
          <TabsContent value="composition" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <CompositionSection form={form} />
            </div>
            <TaskforceNavigation
              activeTab={activeTab}
              onPrevious={() => navigateToPreviousTab(activeTab)}
              onNext={() => navigateToNextTab(activeTab)}
              onCancel={onCancel}
            />
          </TabsContent>
          <TabsContent value="procedures" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <OperatingProceduresSection form={form} />
            </div>
            <TaskforceNavigation
              activeTab={activeTab}
              onPrevious={() => navigateToPreviousTab(activeTab)}
              onNext={() => navigateToNextTab(activeTab)}
              onCancel={onCancel}
            />
          </TabsContent>
          <TabsContent value="deliverables" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <DeliverablesSection form={form} />
            </div>
            <TaskforceNavigation
              activeTab={activeTab}
              onPrevious={() => navigateToPreviousTab(activeTab)}
              onNext={() => navigateToNextTab(activeTab)}
              onCancel={onCancel}
            />
          </TabsContent>

          {/* Move Signatures before review/submit-request */}
          <TabsContent value="signatures" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <SignaturesSection form={form} />
            </div>
            <TaskforceNavigation
              activeTab={activeTab}
              onPrevious={() => navigateToPreviousTab(activeTab)}
              onNext={() => {
                if (showSubmitTab) {
                  navigateToNextTab(activeTab);
                } else {
                  // If admin/coordination: skip review, just inform user to print, no need to show next
                  // Potential: Could show a summary if desired
                }
              }}
              onCancel={onCancel}
              isLastTab={!showSubmitTab}
            />
          </TabsContent>

          {/* Secretary: the final Submit Request section */}
          {showSubmitTab && (
          <TabsContent value="submit-request" className="space-y-6 pt-4 bg-white print:bg-white">
            <div className="rounded-lg border p-6 bg-white print:bg-white">
              <TaskforcePrintableSummary form={form} userRole={userRole} />
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-end">
              <Button type="submit" className="bg-pec-green hover:bg-pec-green-600">
                Submit Request
              </Button>
              <TaskforceNavigation
                activeTab={activeTab}
                onPrevious={() => navigateToPreviousTab(activeTab)}
                onNext={() => {}}
                onCancel={onCancel}
                isLastTab={true}
              />
            </div>
            {requestSubmitted && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 mt-4 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="text-green-700 font-medium">Your task force formation request has been submitted and is being reviewed by the Admin/Coordination team.</p>
                </div>
                <p className="mt-2 text-green-700">You can track the status in the "Task Force Requests" tab.</p>
              </div>
            )}
          </TabsContent>
          )}

          {/* Admin/Coordination: after Signatures show only Print button, no review section */}
          {(canPrint && !showSubmitTab) && (
            <TabsContent value="signatures" className="space-y-6 pt-4 bg-white print:bg-white">
              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="secondary" onClick={handlePrint}>
                  Print / Save as PDF
                </Button>
              </div>
            </TabsContent>
          )}

        </Tabs>
      </form>
    </Form>
  );
}
