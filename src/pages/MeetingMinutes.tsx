
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MeetingMinutesHeader } from "@/components/minutes/MeetingMinutesHeader";
import { MeetingMinutesGrid } from "@/components/minutes/MeetingMinutesGrid";

interface MeetingMinute {
  id: string;
  workbody_id: string;
  workbody_name: string;
  date: string;
  location: string;
  file_url: string;
  agenda_items: string[];
  actions_agreed: string[];
}

export default function MeetingMinutes() {
  const { id } = useParams();
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      // If there's an ID, redirect to the specific minutes viewer
      navigate(`/minutes/${id}`);
      return;
    }
    
    fetchAllMinutes();
  }, [id, navigate]);

  const fetchAllMinutes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select('*, workbodies(name)')
        .order('date', { ascending: false });

      if (error) throw error;
      
      const formattedMinutes = data.map(item => ({
        id: item.id,
        workbody_id: item.workbody_id,
        workbody_name: item.workbodies?.name || 'Unknown Workbody',
        date: item.date,
        location: item.location,
        file_url: item.file_url,
        agenda_items: item.agenda_items || [],
        actions_agreed: item.actions_agreed || []
      }));
      
      setMinutes(formattedMinutes);
    } catch (error) {
      console.error('Error fetching minutes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch meeting minutes',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMinutes = minutes.filter(minute => {
    return searchTerm === "" || 
      (minute.workbody_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (minute.location.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      <MeetingMinutesHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onUploadClick={() => navigate('/upload-minutes')}
      />

      <Card>
        <CardContent className="p-0">
          <MeetingMinutesGrid
            minutes={filteredMinutes}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onNavigate={navigate}
            onViewDetails={(id) => navigate(`/minutes/${id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
