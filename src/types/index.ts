
// TODO: ISSUE-005 - Consolidated type definitions
// Re-export workbody types to maintain compatibility
export type { Workbody, WorkbodyMember, WorkbodyFormData } from './workbody';

export type WorkbodyType = 'committee' | 'working-group' | 'task-force';

export interface ScheduledMeeting {
  id: string;
  workbodyId: string;
  workbodyName: string;
  date: string;
  time: string;
  location: string;
  agendaItems: string[];
  notificationFile?: string;
  notificationFilePath?: string;
  agendaFile?: string | null;
  agendaFilePath?: string | null;
}

export interface MeetingMinutes {
  id: string;
  workbodyId: string;
  workbodyName: string;
  meetingDate: string;
  date: string;  // Adding this for backward compatibility
  venue: string;
  location: string; // Adding this for backward compatibility
  attendees: Attendee[];
  agenda: string[];
  minutes: MinuteItem[];
  actionItems: ActionItem[];
  decisions: string[];
  createdAt: string;
  updatedAt: string;
  documentUrl?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  agendaItems?: string[];
  actionsAgreed?: string[];
}

export interface Attendee {
  id: string;
  name: string;
  role: string;
  status: 'present' | 'absent' | 'apology';
}

export interface MinuteItem {
  id: string;
  agendaItem: string;
  discussion: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  action?: string; // For backward compatibility
  progress?: number; // Adding this for trackers that use progress
  isPrevious?: boolean; // For tracking previous action items
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'chairman' | 'secretary' | 'member' | 'registrar' | 'coordination' | 'ChairmanPEC';
  workbodyId?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  generatedDate: string;
  type: string;
  filePath: string;
}

export interface AttendanceRecord {
  memberId?: string;
  memberName: string;
  present: boolean;
  organization?: string;
  attendanceStatus: 'absent' | 'present-physical' | 'present-virtual';
}

// Activity feed types
export interface Activity {
  id: string;
  type: 'meeting' | 'document' | 'member' | 'action' | 'progress';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  workbody?: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalWorkbodies: number;
  committees: number;
  workingGroups: number;
  taskForces: number;
  meetingsThisYear: number;
  completionRate: number;
  upcomingMeetingsCount: number;
  actionsCompleted: number;
  actionsAgreed: number;
  overdueActions: number;
}

// Form types
export interface CreateUserForm {
  email: string;
  password: string;
  name: string;
  role: string;
  workbodyId?: string;
}

// Meeting validation types
export interface MeetingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
