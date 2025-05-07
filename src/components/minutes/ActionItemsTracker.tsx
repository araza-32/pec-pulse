
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionItem } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { v4 as uuidv4 } from 'uuid';

interface ActionItemsTrackerProps {
  actionsAgreed: string[];
  onChange: (actionItems: ActionItem[]) => void;
  previousActions?: ActionItem[];
}

export function ActionItemsTracker({
  actionsAgreed,
  onChange,
  previousActions = []
}: ActionItemsTrackerProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  useEffect(() => {
    if (actionsAgreed.length > 0) {
      // Initialize action items for each action agreed
      const initialActionItems: ActionItem[] = actionsAgreed.map((action, index) => ({
        id: uuidv4(),
        description: action,
        action: action, // For backward compatibility 
        assignedTo: '',
        dueDate: '',
        status: 'pending', // Explicitly using the union type value
        progress: 0
      }));
      setActionItems(initialActionItems);
      onChange(initialActionItems);
    }
  }, [actionsAgreed, onChange]);

  useEffect(() => {
    if (previousActions.length > 0) {
      // Add previous action items for tracking progress
      setActionItems(prev => [...prev, ...previousActions]);
      onChange([...actionItems, ...previousActions]);
    }
  }, [previousActions]);

  const handleActionItemChange = (index: number, field: keyof ActionItem, value: string | number) => {
    const updatedActionItems = [...actionItems];
    (updatedActionItems[index] as any)[field] = value;
    setActionItems(updatedActionItems);
    onChange(updatedActionItems);
  };

  const handleStatusChange = (index: number, status: 'pending' | 'in-progress' | 'completed' | 'delayed') => {
    const updatedActionItems = [...actionItems];
    updatedActionItems[index].status = status;
    
    // If completed, set progress to 100%
    if (status === 'completed' && 'progress' in updatedActionItems[index]) {
      updatedActionItems[index].progress = 100;
    }
    
    setActionItems(updatedActionItems);
    onChange(updatedActionItems);
  };

  if (actionsAgreed.length === 0 && previousActions.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        <p>No action items defined. Enter actions agreed in the previous step.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {previousActions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Previous Action Items Progress</h3>
          
          {previousActions.map((item, index) => (
            <Card key={`prev-${index}`} className="mb-4">
              <CardContent className="pt-4">
                <div className="grid gap-4">
                  <div>
                    <Label className="font-medium">Action</Label>
                    <p className="mt-1">{item.description || item.action}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Assigned To</Label>
                      <p className="text-sm text-muted-foreground">{item.assignedTo || "Not assigned"}</p>
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <p className="text-sm text-muted-foreground">{item.dueDate || "No due date"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`status-${index}`}>Status</Label>
                    <Select
                      value={item.status}
                      onValueChange={(value: 'pending' | 'in-progress' | 'completed' | 'delayed') => 
                        handleActionItemChange(index + actionsAgreed.length, 'status', value)
                      }
                    >
                      <SelectTrigger id={`status-${index}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {item.progress !== undefined && (
                    <div>
                      <Label>Progress (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.progress}
                        onChange={(e) => handleActionItemChange(index + actionsAgreed.length, 'progress', parseInt(e.target.value) || 0)}
                      />
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`completed-${index}`}
                      checked={item.status === 'completed'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleStatusChange(index + actionsAgreed.length, 'completed');
                        }
                      }}
                    />
                    <Label htmlFor={`completed-${index}`}>Mark as completed</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {actionsAgreed.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">New Action Items</h3>
          
          {actionsAgreed.map((action, index) => (
            <Card key={index} className="mb-4">
              <CardContent className="pt-4">
                <div className="grid gap-4">
                  <div>
                    <Label className="font-medium">Action</Label>
                    <p className="mt-1">{action}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`assigned-${index}`}>Assigned To</Label>
                      <Input
                        id={`assigned-${index}`}
                        placeholder="Enter name"
                        value={actionItems[index]?.assignedTo || ''}
                        onChange={(e) => handleActionItemChange(index, 'assignedTo', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`due-${index}`}>Due Date</Label>
                      <Input
                        id={`due-${index}`}
                        type="date"
                        value={actionItems[index]?.dueDate || ''}
                        onChange={(e) => handleActionItemChange(index, 'dueDate', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`status-${index}`}>Status</Label>
                    <Select
                      value={actionItems[index]?.status || 'pending'}
                      onValueChange={(value: 'pending' | 'in-progress' | 'completed' | 'delayed') => 
                        handleStatusChange(index, value)
                      }
                    >
                      <SelectTrigger id={`status-${index}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
