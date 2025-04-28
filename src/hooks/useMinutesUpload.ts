import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AttendanceRecord, ActionItem } from "@/types";

export const useMinutesUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedWorkbodyType, setSelectedWorkbodyType] = useState<string>("");
  const [selectedWorkbody, setSelectedWorkbody] = useState<string>("");
  const [meetingDate, setMeetingDate] = useState<string>("");
  const [meetingLocation, setMeetingLocation] = useState<string>("");
  const [agendaItems, setAgendaItems] = useState<string>("");
  const [actionsAgreed, setActionsAgreed] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [previousActions, setPreviousActions] = useState<ActionItem[]>([]);

  const [userRole] = useState<"admin" | "coordination" | "secretary">(
    (window as any).MOCK_USER_ROLE || "admin"
  );
  const userWorkbodyId = (window as any).MOCK_USER_WORKBODY_ID || null;

  const { workbodies = [], isLoading, refetch } = useWorkbodies();

  // Fetch previous action items when workbody is selected
  useEffect(() => {
    if (selectedWorkbody) {
      fetchPreviousActions();
    }
  }, [selectedWorkbody]);

  const fetchPreviousActions = async () => {
    try {
      // Get the most recent meeting minutes for this workbody
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select('*')
        .eq('workbody_id', selectedWorkbody)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        // No previous minutes found, that's OK
        return;
      }

      // If there are actions agreed in the previous minutes, add them to the form
      if (data.actions_agreed && data.actions_agreed.length > 0) {
        const previousActionItems: ActionItem[] = data.actions_agreed.map((action: string) => ({
          action,
          assignedTo: '',
          dueDate: '',
          status: 'pending' as const,
          progress: 0,
          isPrevious: true
        }));
        
        setPreviousActions(previousActionItems);
      }
    } catch (error) {
      console.error("Error fetching previous actions:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWorkbodyType) {
      toast({
        title: "Select Workbody Type",
        description: "Please select the type of workbody.",
        variant: "destructive"
      });
      return;
    }
    if (!selectedWorkbody) {
      toast({
        title: "Select Workbody",
        description: "Please select a workbody for the minutes upload.",
        variant: "destructive"
      });
      return;
    }
    if (!meetingDate) {
      toast({
        title: "Meeting Date Required",
        description: "Please provide the date when the meeting was held.",
        variant: "destructive"
      });
      return;
    }
    if (!selectedFile) {
      toast({
        title: "Minutes File Required",
        description: "Please upload the minutes file in PDF format.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${selectedWorkbody}`;
      const filePath = `minutes/${fileName}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('workbody-documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('workbody-documents')
        .getPublicUrl(filePath);

      const agendaItemsArray = agendaItems.split('\n').filter(item => item.trim() !== '');
      const actionsAgreedArray = actionsAgreed.split('\n').filter(item => item.trim() !== '');
      
      // Insert the meeting minutes
      const { data: minutesData, error: minutesError } = await supabase
        .from('meeting_minutes')
        .insert({
          workbody_id: selectedWorkbody,
          date: meetingDate,
          location: meetingLocation,
          agenda_items: agendaItemsArray,
          actions_agreed: actionsAgreedArray,
          file_url: publicUrl,
          uploaded_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (minutesError) throw minutesError;
      
      // Store attendance records
      if (attendanceRecords.length > 0) {
        console.log("Attendance records:", attendanceRecords);
        // In a production app, this would be stored in a separate table
        // For now we're just logging them
      }
      
      // Store action items
      if (actionItems.length > 0 && minutesData) {
        // Update action items with the meeting ID
        const updatedActionItems = actionItems.map(item => ({
          ...item,
          meetingId: minutesData.id
        }));
        console.log("Action items:", updatedActionItems);
        
        // Update any completed previous actions
        const completedPreviousActions = actionItems.filter(
          item => item.isPrevious && item.status === 'completed'
        );
        
        if (completedPreviousActions.length > 0) {
          console.log("Completed previous actions:", completedPreviousActions);
          // Update workbody stats for completed actions
          const workbody = workbodies.find(wb => wb.id === selectedWorkbody);
          if (workbody) {
            await supabase
              .from('workbodies')
              .update({
                actions_completed: workbody.actionsCompleted + completedPreviousActions.length
              })
              .eq('id', selectedWorkbody);
          }
        }
      }

      // Update workbody stats
      const workbody = workbodies.find(wb => wb.id === selectedWorkbody);
      if (workbody) {
        const now = new Date();
        const thisYear = now.getFullYear();
        const meetingDateObj = new Date(meetingDate);
        const isMeetingThisYear = meetingDateObj.getFullYear() === thisYear;
        
        await supabase
          .from('workbodies')
          .update({
            total_meetings: workbody.totalMeetings + 1,
            meetings_this_year: isMeetingThisYear ? workbody.meetingsThisYear + 1 : workbody.meetingsThisYear,
            actions_agreed: workbody.actionsAgreed + actionsAgreedArray.length
          })
          .eq('id', selectedWorkbody);
      }

      toast({
        title: "Minutes Uploaded Successfully",
        description: "The meeting minutes have been uploaded and saved.",
      });

      // Reset form
      setSelectedWorkbodyType("");
      setSelectedWorkbody("");
      setMeetingDate("");
      setMeetingLocation("");
      setAgendaItems("");
      setActionsAgreed("");
      setSelectedFile(null);
      setAttendanceRecords([]);
      setActionItems([]);
      setPreviousActions([]);
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "There was a problem uploading the minutes.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAttendanceChange = (records: AttendanceRecord[]) => {
    setAttendanceRecords(records);
  };

  const handleActionItemsChange = (items: ActionItem[]) => {
    setActionItems(items);
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
    agendaItems,
    setAgendaItems,
    actionsAgreed,
    setActionsAgreed,
    attendanceRecords,
    setAttendanceRecords,
    actionItems,
    setActionItems,
    previousActions,
    userRole,
    workbodies,
    isLoading,
    userWorkbodyId,
    handleSubmit,
    handleFileChange,
    handleAttendanceChange,
    handleActionItemsChange,
    setSelectedWorkbodyType,
    setSelectedWorkbody
  };
};
