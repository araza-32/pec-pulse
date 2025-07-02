
import { useState } from 'react';
import { useMeetingValidation } from './useMeetingValidation';
import { ScheduledMeeting } from '@/types';

interface MeetingFormData {
  workbodyId: string;
  workbodyName: string;
  date: string;
  time: string;
  location: string;
  agendaItems: string;
}

export const useMeetingForm = (meetings: ScheduledMeeting[]) => {
  const { validateMeetingData } = useMeetingValidation(meetings);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  const [formData, setFormData] = useState<MeetingFormData>({
    workbodyId: '',
    workbodyName: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    location: '',
    agendaItems: ''
  });

  const updateFormData = (field: keyof MeetingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation when user makes changes
    if (validationResult) {
      setValidationResult(null);
    }
  };

  const resetForm = () => {
    setFormData({
      workbodyId: '',
      workbodyName: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      location: '',
      agendaItems: ''
    });
    setValidationResult(null);
  };

  const validateForm = () => {
    const meetingData = {
      workbodyId: formData.workbodyId,
      workbodyName: formData.workbodyName,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      agendaItems: formData.agendaItems.split('\n').filter(item => item.trim() !== ''),
      notificationFile: null,
      notificationFilePath: null,
      agendaFile: null,
      agendaFilePath: null
    };

    const result = validateMeetingData(meetingData);
    setValidationResult(result);
    return result;
  };

  return {
    formData,
    updateFormData,
    resetForm,
    validateForm,
    validationResult,
    setValidationResult
  };
};
