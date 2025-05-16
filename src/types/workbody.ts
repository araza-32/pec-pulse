
export interface Workbody {
  id: string;
  name: string;
  description?: string;
  type: 'committee' | 'working-group' | 'task-force';
  abbreviation?: string; // Added this property
  status?: 'active' | 'inactive' | 'pending'; // Added this property
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
}
