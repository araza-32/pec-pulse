import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, FileText as FileTextIcon, File } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

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
  agenda_document_url?: string;
}

export default function MinutesViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState<MinutesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingAgenda, setIsEditingAgenda] = useState(false);
  const [isEditingActions, setIsEditingActions] = useState(false);
  const [editedAgenda, setEditedAgenda] = useState<string>("");
  const [editedActions, setEditedActions] = useState<string>("");
  const [isAgendaPdfOpen, setIsAgendaPdfOpen] = useState(false);
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
        setEditedAgenda(minutesData.agenda_items.join('\n'));
        setEditedActions(minutesData.actions_agreed.join('\n'));
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

  const handleSaveAgenda = async () => {
    if (!minutes) return;
    
    try {
      setIsSaving(true);
      const newAgendaItems = editedAgenda
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== '');
        
      const { error } = await supabase
        .from('meeting_minutes')
        .update({ agenda_items: newAgendaItems })
        .eq('id', minutes.id);
        
      if (error) throw error;
      
      setMinutes(prev => prev ? { ...prev, agenda_items: newAgendaItems } : null);
      setIsEditingAgenda(false);
      
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

  const handleSaveActions = async () => {
    if (!minutes) return;
    
    try {
      setIsSaving(true);
      const newActions = editedActions
        .split('\n')
        .map(action => action.trim())
        .filter(action => action !== '');
        
      const { error } = await supabase
        .from('meeting_minutes')
        .update({ actions_agreed: newActions })
        .eq('id', minutes.id);
        
      if (error) throw error;
      
      setMinutes(prev => prev ? { ...prev, actions_agreed: newActions } : null);
      setIsEditingActions(false);
      
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
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Date</h3>
              <p>{formattedDate}</p>
            </div>
            <div>
              <h3 className="font-medium">Location</h3>
              <p>{minutes.location}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Agenda Items</CardTitle>
            <div className="flex space-x-2">
              {minutes?.agenda_document_url && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAgendaPdfOpen(true)}
                  className="flex items-center gap-1"
                >
                  <File className="h-4 w-4" /> View Agenda
                </Button>
              )}
              {!isEditingAgenda ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditingAgenda(true)}
                >
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleSaveAgenda}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsEditingAgenda(false);
                      setEditedAgenda(minutes.agenda_items.join('\n'));
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingAgenda ? (
              <div className="space-y-2">
                <Label htmlFor="agenda-items">Edit Agenda Items (one per line)</Label>
                <Textarea
                  id="agenda-items"
                  value={editedAgenda}
                  onChange={(e) => setEditedAgenda(e.target.value)}
                  rows={6}
                />
              </div>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {minutes.agenda_items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Actions Agreed</CardTitle>
          {!isEditingActions ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditingActions(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSaveActions}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsEditingActions(false);
                  setEditedActions(minutes.actions_agreed.join('\n'));
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isEditingActions ? (
            <div className="space-y-2">
              <Label htmlFor="actions-agreed">Edit Actions Agreed (one per line)</Label>
              <Textarea
                id="actions-agreed"
                value={editedActions}
                onChange={(e) => setEditedActions(e.target.value)}
                rows={6}
              />
            </div>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {minutes.actions_agreed.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Minutes Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4 flex flex-col items-center justify-center">
            <iframe 
              src={`${minutes.file_url}#toolbar=0`} 
              className="w-full h-[500px] border-0"
              title={`Minutes for ${minutes.workbodyName} meeting on ${formattedDate}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Agenda PDF Viewer Dialog */}
      <Dialog 
        open={isAgendaPdfOpen} 
        onOpenChange={(open) => setIsAgendaPdfOpen(open)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] h-[90vh] flex flex-col p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Meeting Agenda</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsAgendaPdfOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            {minutes.agenda_document_url && (
              <iframe 
                src={minutes.agenda_document_url} 
                className="w-full h-full border-0"
                title="Meeting Agenda"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
