
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskforceFormValues } from "@/types/taskforce";

interface TaskforceSignaturesSectionProps {
  form: UseFormReturn<TaskforceFormValues>;
}

export const TaskforceSignaturesSection = ({ form }: TaskforceSignaturesSectionProps) => {
  const values = form.getValues();

  return (
    <div className="space-y-6 mt-8 page-break-before">
      <h2 className="text-xl font-bold border-b pb-2">6. Signatures</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-lg">Proposed by:</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="font-semibold">Name:</p>
              <p>{values.proposerName || "___________________"}</p>
            </div>
            <div>
              <p className="font-semibold">Date:</p>
              <p>{values.proposerDate || "___________________"}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Signature:</p>
            <p>{values.proposerSignature || "___________________"}</p>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="font-medium text-lg">Reviewed and Recommended by:</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="font-semibold">Name:</p>
              <p>{values.reviewerName || "___________________"}</p>
            </div>
            <div>
              <p className="font-semibold">Date:</p>
              <p>{values.reviewerDate || "___________________"}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Signature:</p>
            <p>{values.reviewerSignature || "___________________"}</p>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="font-medium text-lg">Approved by:</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="font-semibold">Name:</p>
              <p>{values.approverName || "___________________"}</p>
            </div>
            <div>
              <p className="font-semibold">Date:</p>
              <p>{values.approverDate || "___________________"}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Signature:</p>
            <p>{values.approverSignature || "___________________"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
