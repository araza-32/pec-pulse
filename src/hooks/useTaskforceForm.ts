
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
  const form = useForm<TaskforceFormValues>({
    resolver: zodResolver(taskforceSchema),
    defaultValues: {
      name: initialData?.name || "",
      proposedBy: initialData?.proposedBy || "",
      purpose: initialData?.purpose || "",
      
      alignment: initialData?.alignment || "",
      expectedOutcomes: initialData?.expectedOutcomes || [],
      mandates: initialData?.mandates || [],
      durationMonths: initialData?.durationMonths || 3,
      
      members: initialData?.members || [],
      meetings: initialData?.meetings || [],
      deliverables: initialData?.deliverables || [],
      milestones: initialData?.milestones || [],
      
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

  return form;
};
