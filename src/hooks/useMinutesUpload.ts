
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkbodies } from '@/hooks/useWorkbodies';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const useMinutesUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedWorkbodyType, setSelectedWorkbodyType] = useState('');
  const [selectedWorkbody, setSelectedWorkbody] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [meetingNumber, setMeetingNumber] = useState('');
  const [agendaItems, setAgendaItems] = useState<string[]>(['']);
  const [actionsAgreed, setActionsAgreed] = useState<string[]>(['']);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [previousActions, setPreviousActions] = useState<any[]>([]);
  
  const { session } = useAuth();
  const { workbodies, isLoading } = useWorkbodies();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userRole = session?.role || 'user';
  const userWorkbodyId = session?.workbodyId;

  // Set workbody from URL params
  useEffect(() => {
    const workbodyParam = searchParams.get('workbody');
    if (workbodyParam) {
      setSelectedWorkbody(workbodyParam);
      const workbody = workbodies.find(wb => wb.id === workbodyParam);
      if (workbody) {
        setSelectedWorkbodyType(workbody.type);
      }
    }
  }, [searchParams, workbodies]);

  // Fetch previous actions for the selected workbody
  useEffect(() => {
    if (selectedWorkbody) {
      fetchPreviousActions(selectedWorkbody);
    }
  }, [selectedWorkbody]);

  const fetchPreviousActions = async (workbodyId: string) => {
    try {
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select('actions_agreed, date')
        .eq('workbody_id', workbodyId)
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;

      const actions = data?.flatMap(minute => 
        minute.actions_agreed.map((action: string) => ({
          action,
          date: minute.date,
          status: 'pending' // Default status
        }))
      ) || [];

      setPreviousActions(actions);
    } catch (error) {
      console.error('Error fetching previous actions:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAttendanceChange = (memberId: string, attended: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [memberId]: attended
    }));
  };

  const handleActionItemsChange = (items: any[]) => {
    setActionItems(items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !selectedWorkbody || !meetingDate || !meetingLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${selectedWorkbody}-${meetingDate}-${Date.now()}.${fileExt}`;
      const filePath = `meeting-minutes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('workbody-documents')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('workbody-documents')
        .getPublicUrl(filePath);

      // Save meeting minutes to database
      const { error: insertError } = await supabase
        .from('meeting_minutes')
        .insert({
          workbody_id: selectedWorkbody,
          date: meetingDate,
          location: meetingLocation,
          agenda_items: agendaItems.filter(item => item.trim() !== ''),
          actions_agreed: actionsAgreed.filter(item => item.trim() !== ''),
          file_url: publicUrl,
          uploaded_by: session?.id
        });

      if (insertError) throw insertError;

      // Update workbody statistics
      const { data: workbodyData, error: workbodyError } = await supabase
        .from('workbodies')
        .select('total_meetings, meetings_this_year, actions_agreed')
        .eq('id', selectedWorkbody)
        .single();

      if (!workbodyError && workbodyData) {
        const currentYear = new Date().getFullYear();
        const meetingYear = new Date(meetingDate).getFullYear();
        const meetingsThisYearIncrement = meetingYear === currentYear ? 1 : 0;

        await supabase
          .from('workbodies')
          .update({
            total_meetings: workbodyData.total_meetings + 1,
            meetings_this_year: workbodyData.meetings_this_year + meetingsThisYearIncrement,
            actions_agreed: workbodyData.actions_agreed + actionsAgreed.filter(item => item.trim() !== '').length
          })
          .eq('id', selectedWorkbody);
      }

      toast({
        title: "Success!",
        description: "Meeting minutes uploaded successfully.",
      });

      // Reset form
      setSelectedFile(null);
      setMeetingDate('');
      setMeetingLocation('');
      setMeetingNumber('');
      setAgendaItems(['']);
      setActionsAgreed(['']);
      setAttendance({});
      setActionItems([]);

      // Navigate to minutes page
      navigate('/minutes');

    } catch (error) {
      console.error('Error uploading minutes:', error);
      toast({
        title: "Error",
        description: "Failed to upload meeting minutes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    selectedFile,
    selectedWorkbodyType,
    selectedWorkbody,
    meetingDate,
    setMeetingDate,
    meetingLocation,
    setMeetingLocation,
    meetingNumber,
    setMeetingNumber,
    agendaItems,
    setAgendaItems,
    actionsAgreed,
    setActionsAgreed,
    userRole,
    workbodies,
    isLoading,
    userWorkbodyId,
    handleSubmit,
    handleFileChange,
    handleAttendanceChange,
    handleActionItemsChange,
    setSelectedWorkbodyType,
    setSelectedWorkbody,
    previousActions
  };
};
