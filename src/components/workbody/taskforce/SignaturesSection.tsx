
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TaskforceFormValues } from "@/types/taskforce";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React, { useRef } from "react";
import { TaskforcePrintableSummary } from "./TaskforcePrintableSummary";
import { Table } from "@/components/ui/table";

interface SignaturesSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}

export const SignaturesSection = ({ form }: SignaturesSectionProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:bg-white print:text-black print:shadow-none">
      {/* Hidden printable section */}
      <div style={{ display: "none" }} className="print:block" ref={printRef}>
        <TaskforcePrintableSummary form={form} />
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Review Task Force Details</h3>
        <div className="border rounded-md p-4 bg-muted/50">
          <h4 className="font-medium mb-4">Review all details before finalizing</h4>
          <TaskforcePrintableSummary form={form} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Proposed by</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="proposerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="proposerDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="proposerSignature"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Signature</FormLabel>
                <FormControl>
                  <Input placeholder="Type name to sign" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Reviewed and Recommended by</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="reviewerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead/Co-lead Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="reviewerDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="reviewerSignature"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Signature</FormLabel>
                <FormControl>
                  <Input placeholder="Type name to sign" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Approved by</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="approverName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chairman PEC Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="approverDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="approverSignature"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Signature</FormLabel>
                <FormControl>
                  <Input placeholder="Type name to sign" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-4 print:hidden">
        <Button onClick={handlePrint} type="button" variant="secondary">
          <Printer className="mr-2" /> Print as PDF
        </Button>
      </div>
    </div>
  );
};
