
import { Button } from "@/components/ui/button";
import { Check, Printer } from "lucide-react";

interface TaskforceSubmitSectionProps {
  handlePrint: () => void;
  requestSubmitted: boolean;
}

export function TaskforceSubmitSection({
  handlePrint,
  requestSubmitted
}: TaskforceSubmitSectionProps) {
  return (
    <>
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
      
      {requestSubmitted && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">Your task force formation request has been submitted and is being reviewed by the Admin/Coordination team.</p>
          </div>
          <p className="mt-2 text-green-700">You can track the status in the "Task Force Requests" tab.</p>
        </div>
      )}
    </>
  );
}
