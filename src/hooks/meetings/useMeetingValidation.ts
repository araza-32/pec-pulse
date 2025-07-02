
import { ScheduledMeeting } from "@/types";

export const useMeetingValidation = (meetings: ScheduledMeeting[]) => {
  const validateMeetingData = (meetingData: Omit<ScheduledMeeting, 'id'>) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for required fields
    if (!meetingData.workbodyId || !meetingData.workbodyName) {
      errors.push('Workbody selection is required');
    }

    if (!meetingData.date) {
      errors.push('Meeting date is required');
    }

    if (!meetingData.time) {
      errors.push('Meeting time is required');
    }

    if (!meetingData.location?.trim()) {
      errors.push('Meeting location is required');
    }

    if (!meetingData.agendaItems || meetingData.agendaItems.length === 0) {
      errors.push('At least one agenda item is required');
    }

    // Check for exact duplicates (same workbody, date, time, and location)
    const exactDuplicate = meetings.find(m => 
      m.workbodyId === meetingData.workbodyId && 
      m.date === meetingData.date &&
      m.time === meetingData.time &&
      m.location.toLowerCase().trim() === meetingData.location.toLowerCase().trim()
    );

    if (exactDuplicate) {
      errors.push('A meeting with identical details already exists');
    }

    // Check for potential conflicts (same workbody, date, and time but different location)
    const potentialConflict = meetings.find(m => 
      m.workbodyId === meetingData.workbodyId && 
      m.date === meetingData.date &&
      m.time === meetingData.time &&
      m.location.toLowerCase().trim() !== meetingData.location.toLowerCase().trim()
    );

    if (potentialConflict) {
      warnings.push(`Another meeting for this workbody is scheduled at the same time but in a different location (${potentialConflict.location})`);
    }

    // Check for meetings scheduled in the past
    const meetingDateTime = new Date(`${meetingData.date}T${meetingData.time}`);
    if (meetingDateTime < new Date()) {
      warnings.push('Meeting is scheduled in the past');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const checkForDuplicates = (meetingData: Omit<ScheduledMeeting, 'id'>) => {
    return meetings.find(m => 
      m.workbodyId === meetingData.workbodyId && 
      m.date === meetingData.date &&
      m.time === meetingData.time &&
      m.location.toLowerCase().trim() === meetingData.location.toLowerCase().trim()
    );
  };

  return { 
    validateMeetingData, 
    checkForDuplicates 
  };
};
