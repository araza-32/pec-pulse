export interface TaskforceMember {
  id?: string;
  name: string;
  role: string;
  expertise: string;
  responsibilities: string;
  mobile: string;
  email: string;
  address: string;
}

export interface TaskforceMeeting {
  id?: string;
  meetingRequired: string;
  dateTime: string;
  mode: "physical" | "hybrid" | "virtual";
  venue: string;
}

export interface TaskforceDeliverable {
  id?: string;
  name: string;
  description: string;
  deadline: string;
  status: "pending" | "in-progress" | "completed" | "delayed";
}

export interface TaskforceMilestone {
  id?: string;
  name: string;
  description: string;
}

export interface TaskforceFormValues {
  // Overview Section
  name: string;
  proposedBy: string;
  purpose: string;
  
  // Scope Section
  alignment: string;
  expectedOutcomes: string[];
  mandates: string[];
  durationMonths: number;
  
  // Composition Section
  members: TaskforceMember[];
  
  // Operating Procedures
  meetings: TaskforceMeeting[];
  
  // Deliverables
  deliverables: TaskforceDeliverable[];
  milestones: TaskforceMilestone[];
  
  // Signatures
  proposerName: string;
  proposerDate: string;
  proposerSignature: string;
  
  reviewerName: string;
  reviewerDate: string;
  reviewerSignature: string;
  
  approverName: string;
  approverDate: string;
  approverSignature: string;
  
  // Standard fields for workbody
  type: "task-force";
  createdDate: Date;
  endDate?: Date;
}
