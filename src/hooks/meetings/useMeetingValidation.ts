
import { ScheduledMeeting } from "@/types";

export const useMeetingValidation = (meetings: ScheduledMeeting[]) => {
  const checkForDuplicates = (meetingData: Omit<ScheduledMeeting, 'id'>) => {
    return meetings.find(m => 
      m.workbodyId === meetingData.workbodyId && 
      m.date === meetingData.date
    );
  };

  return { checkForDuplicates };
};
