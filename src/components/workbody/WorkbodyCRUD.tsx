
import { useState } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { WorkbodyType } from "@/types";

interface WorkbodyFormData {
  name: string;
  type: WorkbodyType;
  description: string;
  termsOfReference?: string;
  createdDate: Date;
  endDate?: Date;
}

interface WorkbodyCRUDProps {
  userRole: string;
}

export function WorkbodyCRUD({ userRole }: WorkbodyCRUDProps) {
  const { workbodies, createWorkbody, updateWorkbody, deleteWorkbody } = useWorkbodies();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedWorkbody, setSelectedWorkbody] = useState<any>(null);
  const [formData, setFormData] = useState<WorkbodyFormData>({
    name: "",
    type: "committee",
    description: "",
    termsOfReference: "",
    createdDate: new Date(),
    endDate: undefined
  });

  const canEdit = userRole === 'admin' || userRole === 'coordination';

  if (!canEdit) {
    return null;
  }

  const handleCreate = async () => {
    try {
      await createWorkbody.mutateAsync(formData);
      toast({
        title: "Success",
        description: "Workbody created successfully"
      });
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workbody",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedWorkbody) return;
    
    try {
      await updateWorkbody.mutateAsync({
        ...formData,
        id: selectedWorkbody.id
      });
      toast({
        title: "Success",
        description: "Workbody updated successfully"
      });
      setIsEditOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workbody",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workbody?")) return;
    
    try {
      await deleteWorkbody.mutateAsync(id);
      toast({
        title: "Success",
        description: "Workbody deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workbody",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "committee",
      description: "",
      termsOfReference: "",
      createdDate: new Date(),
      endDate: undefined
    });
    setSelectedWorkbody(null);
  };

  const openEditDialog = (workbody: any) => {
    setSelectedWorkbody(workbody);
    setFormData({
      name: workbody.name,
      type: workbody.type,
      description: workbody.description || "",
      termsOfReference: workbody.termsOfReference || "",
      createdDate: new Date(workbody.createdDate),
      endDate: workbody.endDate ? new Date(workbody.endDate) : undefined
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Workbodies</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Workbody
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Workbody</DialogTitle>
            </DialogHeader>
            <WorkbodyForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreate}
              onCancel={() => setIsCreateOpen(false)}
              isLoading={createWorkbody.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {workbodies.map((workbody) => (
          <Card key={workbody.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{workbody.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {workbody.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(workbody)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(workbody.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{workbody.description}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                Created: {new Date(workbody.createdDate).toLocaleDateString()}
                {workbody.endDate && (
                  <span className="ml-4">
                    End Date: {new Date(workbody.endDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Workbody</DialogTitle>
          </DialogHeader>
          <WorkbodyForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEdit}
            onCancel={() => setIsEditOpen(false)}
            isLoading={updateWorkbody.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface WorkbodyFormProps {
  formData: WorkbodyFormData;
  setFormData: (data: WorkbodyFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function WorkbodyForm({ formData, setFormData, onSubmit, onCancel, isLoading }: WorkbodyFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter workbody name"
        />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: WorkbodyType) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="committee">Committee</SelectItem>
            <SelectItem value="working-group">Working Group</SelectItem>
            <SelectItem value="task-force">Task Force</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter description"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="terms">Terms of Reference</Label>
        <Textarea
          id="terms"
          value={formData.termsOfReference || ""}
          onChange={(e) => setFormData({ ...formData, termsOfReference: e.target.value })}
          placeholder="Enter terms of reference"
          rows={4}
        />
      </div>

      {formData.type === 'task-force' && (
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              endDate: e.target.value ? new Date(e.target.value) : undefined 
            })}
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
