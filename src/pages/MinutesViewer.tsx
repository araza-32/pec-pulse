
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { MinutesDetailCard } from "@/components/minutes/MinutesDetailCard";
import { AgendaItemsCard } from "@/components/minutes/AgendaItemsCard";
import { ActionsAgreedCard } from "@/components/minutes/ActionsAgreedCard";
import { MinutesDocumentCard } from "@/components/minutes/MinutesDocumentCard";

interface MinutesData {
  id: string;
  workbody_id: string;
  workbodyName?: string;
  date: string;
  location: string;
  agenda_items: string[];
  actions_agreed: string[];
  file_url: string;
  uploaded_at: string;
  agenda_document_url?: string | null;
}

export default function MinutesViewer() {
  const { id } = useParams<{ id: string }>();
  const [minutes, setMinutes] = useState<MinutesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMinutes = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('meeting_minutes')
          .select(`
            *,
            workbodies:workbody_id (
              name
            )
          `)
          .eq('id', id)
          .single();
          
        if (error) throw error;

        const minutesData: MinutesData = {
          id: data.id,
          workbody_id: data.workbody_id,
          workbodyName: data.workbodies?.name || "Unknown",
          date: data.date,
          location: data.location,
          agenda_items: data.agenda_items,
          actions_agreed: data.actions_agreed,
          file_url: data.file_url,
          uploaded_at: data.uploaded_at,
          agenda_document_url: data.agenda_document_url || null
        };
        
        setMinutes(minutesData);
      } catch (error: any) {
        console.error("Error fetching minutes:", error);
        toast({
          title: "Error loading minutes",
          description: error.message || "Could not load meeting minutes",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMinutes();
  }, [id, toast]);

  const handleSaveAgenda = async (newAgendaItems: string[]) => {
    if (!minutes) return;
    
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('meeting_minutes')
        .update({ agenda_items: newAgendaItems })
        .eq('id', minutes.id);
        
      if (error) throw error;
      
      setMinutes(prev => prev ? { ...prev, agenda_items: newAgendaItems } : null);
      
      toast({
        title: "Success",
        description: "Agenda items updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating agenda items:", error);
      toast({
        title: "Error",
        description: "Failed to update agenda items",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveActions = async (newActions: string[]) => {
    if (!minutes) return;
    
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('meeting_minutes')
        .update({ actions_agreed: newActions })
        .eq('id', minutes.id);
        
      if (error) throw error;
      
      setMinutes(prev => prev ? { ...prev, actions_agreed: newActions } : null);
      
      toast({
        title: "Success",
        description: "Actions agreed updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating actions:", error);
      toast({
        title: "Error",
        description: "Failed to update actions agreed",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-96" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!minutes) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Minutes Not Found</h1>
        <p>The requested meeting minutes could not be found.</p>
      </div>
    );
  }

  const formattedDate = new Date(minutes.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{minutes.workbodyName} Minutes</h1>
          <p className="text-muted-foreground">Meeting held on {formattedDate}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => window.open(minutes.file_url, '_blank')}
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
          </CardHeader>
          <CardContent>
            <MinutesDetailCard date={formattedDate} location={minutes.location} />
          </CardContent>
        </Card>
        
        <AgendaItemsCard
          agendaItems={minutes.agenda_items}
          agendaDocumentUrl={minutes.agenda_document_url}
          onSave={handleSaveAgenda}
          isSaving={isSaving}
        />
      </div>
      
      <ActionsAgreedCard
        actionsAgreed={minutes.actions_agreed}
        onSave={handleSaveActions}
        isSaving={isSaving}
      />
      
      <MinutesDocumentCard
        fileUrl={minutes.file_url}
        workbodyName={minutes.workbodyName || ""}
        date={formattedDate}
      />
    </div>
  );
}
