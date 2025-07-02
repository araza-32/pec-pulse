
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { File } from "lucide-react";

interface AgendaItemsCardProps {
  agendaItems: string[];
  agendaDocumentUrl?: string | null;
  onSave: (items: string[]) => Promise<void>;
  isSaving: boolean;
}

export function AgendaItemsCard({ 
  agendaItems, 
  agendaDocumentUrl, 
  onSave, 
  isSaving 
}: AgendaItemsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAgenda, setEditedAgenda] = useState(agendaItems.join('\n'));

  const handleSave = async () => {
    const newAgendaItems = editedAgenda
      .split('\n')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    await onSave(newAgendaItems);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAgenda(agendaItems.join('\n'));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Agenda Items</CardTitle>
        <div className="flex space-x-2">
          {agendaDocumentUrl && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(agendaDocumentUrl, '_blank')}
              className="flex items-center gap-1"
            >
              <File className="h-4 w-4" /> View Agenda
            </Button>
          )}
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
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
            {agendaItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
