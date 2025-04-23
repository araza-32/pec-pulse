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
}

export function TaskforceForm({ onSubmit, onCancel, initialData }: TaskforceFormProps) {
  const [userRole] = useState<"admin" | "coordination" | "secretary">(
    (window as any).MOCK_USER_ROLE || "admin"
  );
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const form = useTaskforceForm(initialData);

  const handleSubmit = (data: TaskforceFormValues) => {
    try {
      const endDate = new Date(data.createdDate);
      endDate.setMonth(endDate.getMonth() + data.durationMonths);
      data.endDate = endDate;
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
      case "signatures":
        setActiveTab("review");
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
      case "review":
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
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scope">Scope & ToRs</TabsTrigger>
            <TabsTrigger value="composition">Composition</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="signatures">Signatures</TabsTrigger>
            <TabsTrigger value="review">{
              userRole === "secretary" ? "Submit Request" : "Review Details"
            }</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <OverviewSection form={form} />
            </div>
            <TaskforceNavigation
              activeTab={activeTab}
              onPrevious={() => navigateToPreviousTab(activeTab)}
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

          <TabsContent value="signatures" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <SignaturesSection form={form} />
            </div>
            <TaskforceNavigation
              activeTab={activeTab}
              onPrevious={() => navigateToPreviousTab(activeTab)}
              onNext={() => navigateToNextTab(activeTab)}
              onCancel={onCancel}
              isLastTab={false}
            />
          </TabsContent>

          <TabsContent value="review" className="space-y-6 pt-4 bg-white print:bg-white">
            <div className="rounded-lg border p-6 bg-white print:bg-white">
              <TaskforcePrintableSummary form={form} userRole={userRole} />
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-end">
              {userRole === "secretary" ? (
                <Button type="submit" className="bg-pec-green hover:bg-pec-green-600">
                  Submit Request
                </Button>
              ) : (
                <Button type="button" variant="secondary" onClick={handlePrint}>
                  Print / Save as PDF
                </Button>
              )}
              <TaskforceNavigation
                activeTab={activeTab}
                onPrevious={() => navigateToPreviousTab(activeTab)}
                onNext={() => {}}
                onCancel={onCancel}
                isLastTab={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
