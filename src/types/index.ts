
export interface Workbody {
  id: string;
  name: string;
  type: WorkbodyType;
  description?: string;
  createdDate: string;
  endDate?: string;
  termsOfReference?: string;
  totalMeetings: number;
  meetingsThisYear: number;
  actionsAgreed: number;
  actionsCompleted: number;
  members: WorkbodyMember[];
}

export type WorkbodyType = 'committee' | 'working-group' | 'task-force';

export interface WorkbodyMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  hasCV: boolean;
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
  agendaFile?: string | null;
  agendaFilePath?: string | null;
}

export interface MeetingMinutes {
  id: string;
  workbodyId: string;
  workbodyName: string;
  meetingDate: string;
  venue: string;
  attendees: Attendee[];
  agenda: string[];
  minutes: MinuteItem[];
  actionItems: ActionItem[];
  decisions: string[];
  createdAt: string;
  updatedAt: string;
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
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'chairman' | 'secretary' | 'member' | 'registrar' | 'coordination';
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
