
import { ScheduledMeeting } from "@/types";

export const useMeetingValidation = (meetings: ScheduledMeeting[]) => {
  const checkForDuplicates = (meetingData: Omit<ScheduledMeeting, 'id'>) => {
    // Check for exact duplicates - same workbody and same date AND same time
    return meetings.find(m => 
      m.workbodyId === meetingData.workbodyId && 
      m.date === meetingData.date &&
      m.time === meetingData.time
    );
  };

  return { checkForDuplicates };
};
