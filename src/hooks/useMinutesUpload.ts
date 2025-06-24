
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AttendanceRecord, ActionItem } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/contexts/AuthContext";

export const useMinutesUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedWorkbodyType, setSelectedWorkbodyType] = useState<string>("");
  const [selectedWorkbody, setSelectedWorkbody] = useState<string>("");
  const [meetingDate, setMeetingDate] = useState<string>("");
  const [meetingLocation, setMeetingLocation] = useState<string>("");
  const [meetingNumber, setMeetingNumber] = useState<string>("");
  const [agendaItems, setAgendaItems] = useState<string>("");
  const [actionsAgreed, setActionsAgreed] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [previousActions, setPreviousActions] = useState<ActionItem[]>([]);

  const userRole = user?.role || "member";
  const userWorkbodyId = user?.workbodyId || null;

  const { workbodies = [], isLoading, refetch } = useWorkbodies();

  // Updated access control - admin and coordination can now draft minutes
  const hasUploadAccess = userRole === 'admin' || 
                         userRole === 'secretary' || 
                         userRole === 'coordination' || 
                         userRole === 'chairman';

  const hasDraftAccess = userRole === 'admin' || 
                        userRole === 'secretary' || 
                        userRole === 'coordination';

  useEffect(() => {
    if (selectedWorkbody) {
      setPreviousActions([]);
      fetchPreviousActions();
    }
  }, [selectedWorkbody]);

  const fetchPreviousActions = async () => {
    try {
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select('*')
        .eq('workbody_id', selectedWorkbody)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching previous actions:", error);
        return;
      }

      if (data && data.actions_agreed && data.actions_agreed.length > 0) {
        const previousActionItems: ActionItem[] = data.actions_agreed.map((action: string) => ({
          id: uuidv4(),
          description: action,
          action: action,
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
    
    if (!hasUploadAccess) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to upload minutes.",
        variant: "destructive"
      });
      return;
    }
    
    // Validation
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
    
    if (!meetingNumber.trim()) {
      toast({
        title: "Meeting Number Required",
        description: "Please provide the meeting number.",
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
    
    if (!meetingLocation.trim()) {
      toast({
        title: "Meeting Location Required",
        description: "Please provide the meeting location.",
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

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    await uploadMinutes();
  };

  const uploadMinutes = async () => {
    setIsUploading(true);

    try {
      console.log("Starting minutes upload process...");

      // Upload file to storage
      const fileExt = selectedFile!.name.split('.').pop();
      const fileName = `${Date.now()}-${selectedWorkbody}-meeting-${meetingNumber}`;
      const filePath = `minutes/${fileName}.${fileExt}`;
      
      console.log("Uploading file:", filePath);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('workbody-documents')
        .upload(filePath, selectedFile!, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error("File upload error:", uploadError);
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('workbody-documents')
        .getPublicUrl(filePath);

      const agendaItemsArray = agendaItems.split('\n').filter(item => item.trim() !== '');
      const actionsAgreedArray = actionsAgreed.split('\n').filter(item => item.trim() !== '');
      
      // Prepare attendance data
      const attendanceData = attendanceRecords.map(record => ({
        member_name: record.memberName,
        organization: record.organization || '',
        present: record.present,
        attendance_status: record.attendanceStatus || 'absent'
      }));

      const minutesPayload = {
        workbody_id: selectedWorkbody,
        meeting_number: meetingNumber,
        date: meetingDate,
        location: meetingLocation,
        agenda_items: agendaItemsArray,
        actions_agreed: actionsAgreedArray,
        file_url: publicUrl,
        uploaded_at: new Date().toISOString(),
        uploaded_by: user?.id,
        attendance: attendanceData
      };

      console.log("Saving meeting minutes with payload:", minutesPayload);
      
      // Insert the meeting minutes
      const { data: minutesData, error: minutesError } = await supabase
        .from('meeting_minutes')
        .insert(minutesPayload)
        .select('id')
        .single();
      
      if (minutesError) {
        console.error("Minutes insertion error:", minutesError);
        throw minutesError;
      }
      
      console.log("Successfully saved meeting minutes:", minutesData);

      // Update workbody stats
      await updateWorkbodyStats();

      toast({
        title: "Minutes Uploaded Successfully",
        description: `Meeting #${meetingNumber} minutes have been uploaded and saved.`,
      });

      resetForm();
      refetch();
      
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

  const updateWorkbodyStats = async () => {
    const workbody = workbodies.find(wb => wb.id === selectedWorkbody);
    if (workbody) {
      const now = new Date();
      const thisYear = now.getFullYear();
      const meetingDateObj = new Date(meetingDate);
      const isMeetingThisYear = meetingDateObj.getFullYear() === thisYear;
      
      const actionsAgreedArray = actionsAgreed.split('\n').filter(item => item.trim() !== '');
      
      const updatePayload = {
        total_meetings: (workbody.totalMeetings || 0) + 1,
        meetings_this_year: isMeetingThisYear ? (workbody.meetingsThisYear || 0) + 1 : (workbody.meetingsThisYear || 0),
        actions_agreed: (workbody.actionsAgreed || 0) + actionsAgreedArray.length
      };

      console.log("Updating workbody stats:", updatePayload);

      const { error: updateError } = await supabase
        .from('workbodies')
        .update(updatePayload)
        .eq('id', selectedWorkbody);

      if (updateError) {
        console.error("Error updating workbody stats:", updateError);
      }
    }
  };

  const resetForm = () => {
    setSelectedWorkbodyType("");
    setSelectedWorkbody("");
    setMeetingDate("");
    setMeetingLocation("");
    setMeetingNumber("");
    setAgendaItems("");
    setActionsAgreed("");
    setSelectedFile(null);
    setAttendanceRecords([]);
    setActionItems([]);
    setPreviousActions([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file only.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleAttendanceChange = (records: AttendanceRecord[]) => {
    console.log("Attendance records updated in hook:", records);
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
    meetingNumber,
    setMeetingNumber,
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
    hasUploadAccess,
    hasDraftAccess,
    handleSubmit,
    handleFileChange,
    handleAttendanceChange,
    handleActionItemsChange,
    setSelectedWorkbodyType,
    setSelectedWorkbody
  };
};
