
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { ActionItem } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActionItemsTrackerProps {
  actionsAgreed: string[];
  onChange: (actionItems: ActionItem[]) => void;
}

export function ActionItemsTracker({ actionsAgreed, onChange }: ActionItemsTrackerProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  // Initialize action items when actionsAgreed changes
  useEffect(() => {
    if (actionsAgreed.length > 0) {
      const initialItems: ActionItem[] = actionsAgreed.map((description, index) => ({
        id: `new-${index}`,
        description,
        status: 'pending' as const,
        meetingId: '',  // Will be set once the meeting is created
      }));
      setActionItems(initialItems);
      onChange(initialItems);
    }
  }, [actionsAgreed, onChange]);

  const handleAddActionItem = () => {
    const newItem: ActionItem = {
      id: `new-${actionItems.length}`,
      description: '',
      status: 'pending',
      meetingId: '',
    };
    
    const updatedItems = [...actionItems, newItem];
    setActionItems(updatedItems);
    onChange(updatedItems);
  };

  const handleRemoveActionItem = (index: number) => {
    const updatedItems = actionItems.filter((_, i) => i !== index);
    setActionItems(updatedItems);
    onChange(updatedItems);
  };

  const handleActionItemChange = (index: number, field: keyof ActionItem, value: any) => {
    const updatedItems = [...actionItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setActionItems(updatedItems);
    onChange(updatedItems);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Label className="mb-4 block text-lg font-medium">Action Items Tracking</Label>
        
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {actionItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 pb-3 border-b">
                <div className="flex-grow">
                  <Input
                    value={item.description}
                    onChange={(e) => handleActionItemChange(index, 'description', e.target.value)}
                    placeholder="Enter action item description"
                  />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      value={item.assignedTo || ''}
                      onChange={(e) => handleActionItemChange(index, 'assignedTo', e.target.value)}
                      placeholder="Assigned to"
                      className="text-sm"
                    />
                    <Input
                      type="date"
                      value={item.dueDate || ''}
                      onChange={(e) => handleActionItemChange(index, 'dueDate', e.target.value)}
                      placeholder="Due date"
                      className="text-sm"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => handleRemoveActionItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Button 
          className="mt-4 w-full"
          variant="outline"
          onClick={handleAddActionItem}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Action Item
        </Button>
      </CardContent>
    </Card>
  );
}
