
import { Workbody, MeetingMinutes, User, ScheduledMeeting } from '../types';

// All data now comes from Supabase - no mock data
export const users: User[] = [];
export const workbodies: Workbody[] = [];
export const meetingMinutes: MeetingMinutes[] = [];
export const initialMeetings: ScheduledMeeting[] = [];

// Helper function to get workbody statistics from real data
export const getWorkbodyStats = (workbodies: Workbody[]) => {
  const committees = workbodies.filter(w => w.type === 'committee').length;
  const workingGroups = workbodies.filter(w => w.type === 'working-group').length;
  const taskForces = workbodies.filter(w => w.type === 'task-force').length;
  
  const totalMeetings = workbodies.reduce((sum, w) => sum + (w.totalMeetings || 0), 0);
  const meetingsThisYear = workbodies.reduce((sum, w) => sum + (w.meetingsThisYear || 0), 0);
  
  const totalActions = workbodies.reduce((sum, w) => sum + (w.actionsAgreed || 0), 0);
  const completedActions = workbodies.reduce((sum, w) => sum + (w.actionsCompleted || 0), 0);
  const completionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  return {
    committees,
    workingGroups,
    taskForces,
    totalWorkbodies: committees + workingGroups + taskForces,
    totalMeetings,
    meetingsThisYear,
    totalActions,
    completedActions,
    completionRate
  };
};
