
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TaskforceFormValues } from "@/types/taskforce";

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

export const useTaskforceForm = (initialData?: Partial<TaskforceFormValues>) => {
  // Safely handle potentially undefined initialData
  const safeInitialData = initialData || {};
  
  // Always initialize the form with these default values
  const form = useForm<TaskforceFormValues>({
    resolver: zodResolver(taskforceSchema),
    defaultValues: {
      name: safeInitialData.name || "",
      proposedBy: safeInitialData.proposedBy || "",
      purpose: safeInitialData.purpose || "",
      
      alignment: safeInitialData.alignment || "",
      expectedOutcomes: safeInitialData.expectedOutcomes || [],
      mandates: safeInitialData.mandates || [],
      durationMonths: safeInitialData.durationMonths || 3,
      
      members: safeInitialData.members || [],
      meetings: safeInitialData.meetings || [],
      deliverables: safeInitialData.deliverables || [],
      milestones: safeInitialData.milestones || [],
      
      proposerName: safeInitialData.proposerName || "",
      proposerDate: safeInitialData.proposerDate || "",
      proposerSignature: safeInitialData.proposerSignature || "",
      
      reviewerName: safeInitialData.reviewerName || "",
      reviewerDate: safeInitialData.reviewerDate || "",
      reviewerSignature: safeInitialData.reviewerSignature || "",
      
      approverName: safeInitialData.approverName || "",
      approverDate: safeInitialData.approverDate || "",
      approverSignature: safeInitialData.approverSignature || "",
      
      type: "task-force",
      createdDate: safeInitialData.createdDate || new Date(),
      endDate: safeInitialData.endDate,
    },
    mode: "onChange"
  });

  return form;
}
