
export type WorkbodyType = 'committee' | 'working-group' | 'task-force';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'secretary' | 'chairman';
  workbodyId?: string; // Only for secretaries
}

export interface Workbody {
  id: string;
  name: string;
  type: WorkbodyType;
  totalMeetings: number;
  meetingsThisYear: number;
  actionsAgreed: number;
  actionsCompleted: number;
  members: WorkbodyMember[];
  description?: string;
  createdDate: string;
  endDate?: string; // For task forces
  termsOfReference?: string;
  torDocumentUrl?: string;
}

export interface WorkbodyMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  hasCV: boolean;
}

export interface AttendanceRecord {
  memberId?: string;
  memberName: string;
  organization?: string;
  present: boolean;
  attendanceStatus?: 'present-physical' | 'present-virtual' | 'absent';
}

export interface ActionItem {
  action: string;
  assignedTo: string;
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  progress?: number;
  isPrevious?: boolean;
}

export interface MeetingMinutes {
  id: string;
  workbodyId: string;
  date: string;
  location: string;
  agendaItems: string[];
  actionsAgreed: string[];
  documentUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  attendance?: AttendanceRecord[];
  actionItems?: ActionItem[];
  agendaDocumentUrl?: string; // Added for agenda PDF
}

export interface ScheduledMeeting {
  id: string;
  workbodyId: string;
  workbodyName: string;
  date: string;
  time: string;
  location: string;
  agendaItems: string[];
  notificationFile?: string | null;
  notificationFilePath?: string | null;
  agendaFile?: string | null; // Added for agenda PDF file name
  agendaFilePath?: string | null; // Added for agenda PDF file path
}

export interface DashboardStat {
  label: string;
  value: number;
  icon: string;
  color: string;
}
