
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { Workbody } from "@/types/workbody";

export default function WorkbodyEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workbodies, refetch } = useWorkbodies();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Workbody>>({
    name: "",
    abbreviation: "",
    description: "",
    type: "committee",
    status: "active"
  });

  useEffect(() => {
    // Find the workbody with the matching ID
    const workbody = workbodies.find(w => w.id === id);
    if (workbody) {
      setFormData({
        name: workbody.name,
        abbreviation: workbody.abbreviation || "",
        description: workbody.description || "",
        type: workbody.type || "committee",
        status: workbody.status || "active"
      });
    }
  }, [id, workbodies]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update the workbody in the database
      const { error } = await supabase
        .from('workbodies')
        .update({
          name: formData.name,
          abbreviation: formData.abbreviation,
          description: formData.description,
          type: formData.type,
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Show success toast
      toast({
        title: "Workbody Updated",
        description: "The workbody has been updated successfully.",
      });
      
      // Refresh workbodies data
      refetch();
      
      // Navigate back to the workbody detail page
      navigate(`/workbody/${id}`);
    } catch (error: any) {
      console.error('Error updating workbody:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update workbody. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(`/workbody/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Workbody</h1>
          <p className="text-muted-foreground">
            Update the details of this workbody.
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Workbody Information</CardTitle>
            <CardDescription>
              Make changes to the workbody information here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="abbreviation">Abbreviation</Label>
              <Input 
                id="abbreviation"
                value={formData.abbreviation}
                onChange={(e) => handleChange('abbreviation', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="committee">Committee</SelectItem>
                  <SelectItem value="working-group">Working Group</SelectItem>
                  <SelectItem value="task-force">Task Force</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(`/workbody/${id}`)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-pec-green hover:bg-pec-green-600"
            >
              {isLoading ? "Saving..." : "Save Changes"}
              {!isLoading && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
