
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useMinutesUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedWorkbodyType, setSelectedWorkbodyType] = useState("");
  const [selectedWorkbody, setSelectedWorkbody] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [meetingNumber, setMeetingNumber] = useState("");
  const [agendaItems, setAgendaItems] = useState<string[]>([]);
  const [actionsAgreed, setActionsAgreed] = useState<string[]>([]);
  const [previousActions, setPreviousActions] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [actionItems, setActionItems] = useState<any[]>([]);
  
  const { toast } = useToast();
  const { workbodies, isLoading } = useWorkbodies();
  const { session } = useAuth();
  const navigate = useNavigate();
  
  const userRole = session?.role || 'user';
  const userWorkbodyId = session?.workbodyId;

  useEffect(() => {
    if (selectedWorkbody) {
      fetchPreviousActions();
    }
  }, [selectedWorkbody]);

  const fetchPreviousActions = async () => {
    try {
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select('actions_agreed')
        .eq('workbody_id', selectedWorkbody)
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      const actions = data?.flatMap(item => item.actions_agreed || []) || [];
      setPreviousActions(actions);
    } catch (error) {
      console.error('Error fetching previous actions:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleAttendanceChange = (memberId: string, attended: boolean) => {
    setAttendanceData(prev => {
      const existing = prev.find(item => item.memberId === memberId);
      if (existing) {
        return prev.map(item => 
          item.memberId === memberId 
            ? { ...item, attended }
            : item
        );
      } else {
        return [...prev, { memberId, attended }];
      }
    });
  };

  const handleActionItemsChange = (items: any[]) => {
    setActionItems(items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !selectedWorkbody || !meetingDate || !meetingLocation) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      console.log('Starting file upload process...');
      
      // Generate unique filename
      const timestamp = new Date().getTime();
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `minutes_${selectedWorkbody}_${timestamp}.${fileExtension}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('workbody-documents')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('workbody-documents')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      // Check if there's a corresponding meeting in the meetings table
      const { data: existingMeeting } = await supabase
        .from('meetings')
        .select('id')
        .eq('workbody_id', selectedWorkbody)
        .gte('datetime', `${meetingDate}T00:00:00`)
        .lt('datetime', `${meetingDate}T23:59:59`)
        .single();

      // Save to database
      const { data: minutesData, error: dbError } = await supabase
        .from('meeting_minutes')
        .insert({
          workbody_id: selectedWorkbody,
          date: meetingDate,
          location: meetingLocation,
          file_url: publicUrl,
          agenda_items: agendaItems,
          actions_agreed: actionsAgreed,
          uploaded_by: session?.id,
          ocr_status: 'pending'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      // Update meeting status if it exists
      if (existingMeeting) {
        await supabase
          .from('meetings')
          .update({ status: 'completed' })
          .eq('id', existingMeeting.id);
      }


      console.log('Minutes saved to database:', minutesData);

      // Update workbody statistics
      const { data: workbodyData, error: workbodyError } = await supabase
        .from('workbodies')
        .select('total_meetings, meetings_this_year, actions_agreed')
        .eq('id', selectedWorkbody)
        .single();

      if (!workbodyError && workbodyData) {
        await supabase
          .from('workbodies')
          .update({
            total_meetings: workbodyData.total_meetings + 1,
            meetings_this_year: workbodyData.meetings_this_year + 1,
            actions_agreed: workbodyData.actions_agreed + actionsAgreed.length
          })
          .eq('id', selectedWorkbody);
      }

      // Log composition history if attendance data indicates changes
      if (attendanceData.length > 0) {
        const changes = attendanceData.filter(member => member.isNewMember || member.roleChanged);
        
        for (const change of changes) {
          await supabase
            .from('workbody_composition_history')
            .insert({
              workbody_id: selectedWorkbody,
              change_type: change.isNewMember ? 'member_added' : 'member_role_changed',
              change_details: {
                member_name: change.name,
                member_role: change.role,
                previous_role: change.previousRole || null
              },
              changed_by: session?.email || 'System',
              source_document: fileName,
              notes: `Updated during minutes upload for meeting on ${meetingDate}`
            });
        }
      }

      toast({
        title: "Success",
        description: "Meeting minutes uploaded successfully"
      });

      // Reset form
      setSelectedFile(null);
      setSelectedWorkbody("");
      setSelectedWorkbodyType("");
      setMeetingDate("");
      setMeetingLocation("");
      setMeetingNumber("");
      setAgendaItems([]);
      setActionsAgreed([]);
      setAttendanceData([]);
      setActionItems([]);

      // Navigate to minutes list
      navigate('/minutes');

    } catch (error) {
      console.error('Upload error:', error);
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
