
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
  memberId: string;
  memberName: string;
  present: boolean;
  attendanceType?: 'physical' | 'virtual';
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo?: string;
  dueDate?: string;
  status: 'pending' | 'completed' | 'delayed';
  completedDate?: string;
  meetingId: string;
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
}

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
}

export interface DashboardStat {
  label: string;
  value: number;
  icon: string;
  color: string;
}
