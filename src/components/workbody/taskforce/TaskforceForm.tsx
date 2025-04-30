
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
import { Check, Printer } from "lucide-react"; // Add the missing import for Check and Printer icons

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
    // Create a new window with just the printable content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Could not open print window. Please check if pop-ups are blocked.",
        variant: "destructive"
      });
      return;
    }
    
    // Get the HTML content of the printable summary
    const printContent = document.getElementById('taskforce-printable-summary');
    
    if (!printContent) {
      printWindow.close();
      toast({
        title: "Error",
        description: "Print content not found.",
        variant: "destructive"
      });
      return;
    }

    // Write the HTML to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Task Force Formation - ${form.getValues().name}</title>
          <style>
            @media print {
              @page {
                margin: 2cm;
                size: portrait;
              }
              body {
                font-family: 'Arial', sans-serif;
                font-size: 12pt;
                color: #000;
                background: #fff;
              }
              .page-break-before {
                page-break-before: always;
              }
              table {
                page-break-inside: avoid;
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1rem;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
              h1, h2, h3 {
                page-break-after: avoid;
              }
              table thead {
                display: table-header-group;
              }
              table tfoot {
                display: table-row-group;
              }
              table tr {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            setTimeout(() => { 
              window.print();
              setTimeout(() => { window.close(); }, 500);
            }, 500);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
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

          <TabsContent value="signatures" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <SignaturesSection form={form} />
            </div>
            
            {/* Hidden div containing printable content */}
            <div id="taskforce-printable-summary" className="hidden">
              <TaskforcePrintableSummary form={form} userRole={userRole} />
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={handlePrint}
                className="flex items-center"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print / Save as PDF
              </Button>
              
              <TaskforceNavigation
                activeTab={activeTab}
                onPrevious={() => navigateToPreviousTab(activeTab)}
                onNext={() => {
                  if (showSubmitTab) {
                    navigateToNextTab(activeTab);
                  }
                }}
                onCancel={onCancel}
                isLastTab={!showSubmitTab}
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

          {/* Secretary: the final Submit Request section */}
          {showSubmitTab && (
          <TabsContent value="submit-request" className="space-y-6 pt-4">
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4">Review and Submit Request</h3>
              
              <p className="mb-4">
                Please review your task force formation request before submission. 
                You can go back to previous tabs to make any changes, or use the print button to generate a PDF.
              </p>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={handlePrint}
                className="mb-6 flex items-center"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print / Save as PDF
              </Button>
              
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Final Confirmation</h4>
                <p>
                  By submitting this request, you confirm that all information provided is 
                  accurate and complete to the best of your knowledge.
                </p>
              </div>
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
        </Tabs>
      </form>
    </Form>
  );
}
