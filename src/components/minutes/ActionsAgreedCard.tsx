
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ActionsAgreedCardProps {
  actionsAgreed: string[];
  onSave: (actions: string[]) => Promise<void>;
  isSaving: boolean;
}

export function ActionsAgreedCard({ 
  actionsAgreed, 
  onSave, 
  isSaving 
}: ActionsAgreedCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedActions, setEditedActions] = useState(actionsAgreed.join('\n'));

  const handleSave = async () => {
    const newActions = editedActions
      .split('\n')
      .map(action => action.trim())
      .filter(action => action !== '');
    
    await onSave(newActions);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedActions(actionsAgreed.join('\n'));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Actions Agreed</CardTitle>
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
      </CardHeader>
      <CardContent>
        {isEditing ? (
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
            {actionsAgreed.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
