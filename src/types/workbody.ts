export interface Workbody {
  id: string;
  code: string; // Short code like "EC", "ESC"
  name: string;
  description?: string;
  type: 'committee' | 'working-group' | 'task-force';
  status?: 'active' | 'inactive' | 'pending';
  chairman?: string;
  secretary?: string;
  createdAt?: string;
  updatedAt?: string;
  totalMeetings?: number;
  meetingsThisYear?: number;
  actionsAgreed?: number;
  actionsCompleted?: number;
  daysUntilMeeting?: number | null;
  lastMeeting?: string | null;
  nextMeeting?: string | null;
  endDate?: string | null;
  createdDate?: string;
  termsOfReference?: string;
  members?: WorkbodyMember[];
  parentId?: string | null; // For task force nesting
  childWorkbodies?: Workbody[]; // Nested task forces
}

export interface WorkbodyMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  hasCV: boolean;
}

export interface CompositionHistoryProps {
  workbodyId: string;
  onClose: () => void;
}

export interface WorkbodyFormData {
  name: string;
  type: 'committee' | 'working-group' | 'task-force';
  category?: string;
  subcategory?: string;
  description?: string;
  createdDate: Date;
  endDate?: Date;
  termsOfReference?: string;
  parentId?: string | null; // For task force nesting
}

export interface DocumentUploadResult {
  id: string;
  file_url: string;
  document_type: 'notification' | 'tor';
  uploaded_at: string;
}
