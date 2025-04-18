import { useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { WorkbodyForm } from "@/components/workbody/WorkbodyForm";
import { Workbody, WorkbodyType, WorkbodyMember } from "@/types";
import { DocumentUpload } from "@/components/workbody/DocumentUpload";
import { CompositionHistory } from "@/components/workbody/CompositionHistory";
import { WorkbodyTable } from "@/components/workbody/WorkbodyTable";
import { DeleteWorkbodyDialog } from "@/components/workbody/DeleteWorkbodyDialog";
import { TermsOfReferenceDialog } from "@/components/workbody/TermsOfReferenceDialog";
import { ExpiringTaskForceAlert } from "@/components/workbody/ExpiringTaskForceAlert";
import { usePdfMemberExtraction } from "@/hooks/usePdfMemberExtraction";

export default function WorkbodyManagement() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTorDialogOpen, setIsTorDialogOpen] = useState(false);
  const [selectedWorkbody, setSelectedWorkbody] = useState<Workbody | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadNotificationOpen, setIsUploadNotificationOpen] = useState(false);
  const [isUploadTorOpen, setIsUploadTorOpen] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const queryClient = useQueryClient();

  const { data: workbodies = [], isLoading } = useQuery({
    queryKey: ['workbodies'],
    queryFn: async () => {
      console.log("Fetching workbodies from Supabase");
      const { data, error } = await supabase
        .from('workbodies')
        .select(`
          *,
          workbody_members (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching workbodies:", error);
        toast({
          title: "Error",
          description: "Failed to load workbodies. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Workbodies fetched:", data);
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type as WorkbodyType,
        description: item.description || undefined,
        createdDate: item.created_date,
        endDate: item.end_date || undefined,
        termsOfReference: item.terms_of_reference || undefined,
        totalMeetings: item.total_meetings || 0,
        meetingsThisYear: item.meetings_this_year || 0,
        actionsAgreed: item.actions_agreed || 0,
        actionsCompleted: item.actions_completed || 0,
        members: (item.workbody_members || []).map(member => ({
          id: member.id,
          name: member.name,
          role: member.role,
          email: member.email || undefined,
          phone: member.phone || undefined,
          hasCV: member.has_cv || false
        }))
      })) as Workbody[];
    }
  });

  const createWorkbodyMutation = useMutation({
    mutationFn: async (newWorkbody: Omit<Workbody, 'id' | 'members'>) => {
      console.log("Creating new workbody:", newWorkbody);
      const { data, error } = await supabase
        .from('workbodies')
        .insert({
          name: newWorkbody.name,
          type: newWorkbody.type,
          description: newWorkbody.description,
          created_date: newWorkbody.createdDate,
          end_date: newWorkbody.endDate,
          terms_of_reference: newWorkbody.termsOfReference,
          total_meetings: 0,
          meetings_this_year: 0,
          actions_agreed: 0,
          actions_completed: 0
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting workbody:", error);
        throw error;
      }
      console.log("Workbody created successfully:", data);
      return data;
    },
    onSuccess: () => {
      console.log("Invalidating workbodies query cache");
      queryClient.invalidateQueries({ queryKey: ['workbodies'] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    }
  });

  const updateWorkbodyMutation = useMutation({
    mutationFn: async (updatedWorkbody: Partial<Workbody> & { id: string }) => {
      const { data, error } = await supabase
        .from('workbodies')
        .update({
          name: updatedWorkbody.name,
          type: updatedWorkbody.type,
          description: updatedWorkbody.description,
          created_date: updatedWorkbody.createdDate,
          end_date: updatedWorkbody.endDate,
          terms_of_reference: updatedWorkbody.termsOfReference
        })
        .eq('id', updatedWorkbody.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating workbody:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workbodies'] });
    }
  });

  const deleteWorkbodyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workbodies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workbodies'] });
    }
  });

  const { extractMembersFromPdf, isExtracting } = usePdfMemberExtraction();

  const handleAddSubmit = async (data: any) => {
    try {
      console.log("Submitting new workbody data:", data);
      await createWorkbodyMutation.mutateAsync({
        name: data.name,
        type: data.type,
        description: data.description,
        createdDate: data.createdDate.toISOString(),
        endDate: data.endDate?.toISOString(),
        termsOfReference: data.termsOfReference,
        totalMeetings: 0,
        meetingsThisYear: 0,
        actionsAgreed: 0,
        actionsCompleted: 0
      });

      toast({
        title: "Workbody Created",
        description: `${data.name} has been successfully created.`,
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating workbody:', error);
      toast({
        title: "Error",
        description: "Failed to create workbody. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (data: any) => {
    if (!selectedWorkbody) return;

    try {
      await updateWorkbodyMutation.mutateAsync({
        id: selectedWorkbody.id,
        name: data.name,
        type: data.type,
        description: data.description,
        createdDate: data.createdDate.toISOString(),
        endDate: data.endDate?.toISOString(),
        termsOfReference: data.termsOfReference,
      });

      toast({
        title: "Workbody Updated",
        description: `${data.name} has been successfully updated.`,
      });
      setIsEditDialogOpen(false);
      setSelectedWorkbody(null);
    } catch (error) {
      console.error('Error updating workbody:', error);
      toast({
        title: "Error",
        description: "Failed to update workbody. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkbody = async () => {
    if (!selectedWorkbody) return;

    try {
      await deleteWorkbodyMutation.mutateAsync(selectedWorkbody.id);
      
      toast({
        title: "Workbody Deleted",
        description: `${selectedWorkbody.name} has been successfully deleted.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedWorkbody(null);
    } catch (error) {
      console.error('Error deleting workbody:', error);
      toast({
        title: "Error",
        description: "Failed to delete workbody. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTorSubmit = async (data: { termsOfReference: FormDataEntryValue | null }) => {
    if (!selectedWorkbody) return;
    
    try {
      await updateWorkbodyMutation.mutateAsync({
        id: selectedWorkbody.id,
        termsOfReference: data.termsOfReference?.toString(),
      });
      
      toast({
        title: "Terms of Reference Updated",
        description: `Terms of Reference for ${selectedWorkbody.name} has been updated.`,
      });
      setIsTorDialogOpen(false);
    } catch (error) {
      console.error('Error updating terms of reference:', error);
      toast({
        title: "Error",
        description: "Failed to update terms of reference. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationUpload = async (documentId: string) => {
    if (selectedWorkbody) {
      try {
        console.log("Handling notification upload for document:", documentId);
        await extractMembersFromPdf(documentId, selectedWorkbody.id);
        
        toast({
          title: "Members Extracted",
          description: "Members have been extracted from the notification document.",
        });
        
        queryClient.invalidateQueries({ queryKey: ['workbodies'] });
        
        setIsHistoryVisible(true);
        setIsUploadNotificationOpen(false);
      } catch (error) {
        console.error('Error extracting members:', error);
        toast({
          title: "Extraction Error",
          description: "Failed to extract members from document. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredWorkbodies = workbodies.filter(
    (workbody) =>
      workbody.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workbody.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkExpiringTaskForces = () => {
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);

    return workbodies.filter(
      (wb) =>
        wb.type === "task-force" &&
        wb.endDate &&
        new Date(wb.endDate) <= twoWeeksFromNow &&
        new Date(wb.endDate) >= today
    );
  };

  const expiringTaskForces = checkExpiringTaskForces();

  console.log("Rendering workbodies:", filteredWorkbodies);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workbody Management</h1>
        <p className="text-muted-foreground">
          Add, edit or remove workbodies and manage their details
        </p>
      </div>

      {expiringTaskForces.length > 0 && (
        <ExpiringTaskForceAlert expiringTaskForces={expiringTaskForces} />
      )}

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workbodies..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-x-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Workbody
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading workbodies...</div>
      ) : filteredWorkbodies.length === 0 ? (
        <div className="text-center py-8">No workbodies found</div>
      ) : (
        <WorkbodyTable 
          workbodies={filteredWorkbodies}
          onEdit={(workbody) => {
            setSelectedWorkbody(workbody);
            setIsEditDialogOpen(true);
          }}
          onViewTor={(workbody) => {
            setSelectedWorkbody(workbody);
            setIsTorDialogOpen(true);
          }}
          onUploadNotification={(workbody) => {
            setSelectedWorkbody(workbody);
            setIsUploadNotificationOpen(true);
          }}
          onViewHistory={(workbody) => {
            setSelectedWorkbody(workbody);
            setIsHistoryVisible(true);
          }}
          onDelete={(workbody) => {
            setSelectedWorkbody(workbody);
            setIsDeleteDialogOpen(true);
          }}
        />
      )}

      {selectedWorkbody && (
        <>
          <DocumentUpload
            workbodyId={selectedWorkbody.id}
            documentType="notification"
            isOpen={isUploadNotificationOpen}
            onClose={() => setIsUploadNotificationOpen(false)}
            onUploadComplete={(documentId) => handleNotificationUpload(documentId)}
          />

          <DocumentUpload
            workbodyId={selectedWorkbody.id}
            documentType="tor"
            isOpen={isUploadTorOpen}
            onClose={() => setIsUploadTorOpen(false)}
            onUploadComplete={() => {
              queryClient.invalidateQueries({ queryKey: ['workbodies'] });
            }}
          />

          {isHistoryVisible && (
            <CompositionHistory
              workbodyId={selectedWorkbody.id}
              onClose={() => setIsHistoryVisible(false)}
            />
          )}
        </>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Workbody</DialogTitle>
          </DialogHeader>
          <WorkbodyForm
            onSubmit={handleAddSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Workbody</DialogTitle>
          </DialogHeader>
          {selectedWorkbody && (
            <WorkbodyForm
              initialData={selectedWorkbody}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteWorkbodyDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        workbodyName={selectedWorkbody?.name || ""}
        onDelete={handleDeleteWorkbody}
      />

      <TermsOfReferenceDialog
        isOpen={isTorDialogOpen}
        onClose={() => setIsTorDialogOpen(false)}
        workbodyName={selectedWorkbody?.name || ""}
        initialTermsOfReference={selectedWorkbody?.termsOfReference || ""}
        onSubmit={handleTorSubmit}
      />
    </div>
  );

  // Copy missing functions
  function handleEditSubmit(data: any) {
    if (!selectedWorkbody) return;

    try {
      updateWorkbodyMutation.mutate({
        id: selectedWorkbody.id,
        name: data.name,
        type: data.type,
        description: data.description,
        createdDate: data.createdDate.toISOString(),
        endDate: data.endDate?.toISOString(),
        termsOfReference: data.termsOfReference,
      });

      toast({
        title: "Workbody Updated",
        description: `${data.name} has been successfully updated.`,
      });
      setIsEditDialogOpen(false);
      setSelectedWorkbody(null);
    } catch (error) {
      console.error('Error updating workbody:', error);
      toast({
        title: "Error",
        description: "Failed to update workbody. Please try again.",
        variant: "destructive",
      });
    }
  }

  function handleDeleteWorkbody() {
    if (!selectedWorkbody) return;

    try {
      deleteWorkbodyMutation.mutate(selectedWorkbody.id);
      
      toast({
        title: "Workbody Deleted",
        description: `${selectedWorkbody.name} has been successfully deleted.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedWorkbody(null);
    } catch (error) {
      console.error('Error deleting workbody:', error);
      toast({
        title: "Error",
        description: "Failed to delete workbody. Please try again.",
        variant: "destructive",
      });
    }
  }

  function handleTorSubmit(data: { termsOfReference: FormDataEntryValue | null }) {
    if (!selectedWorkbody) return;
    
    try {
      updateWorkbodyMutation.mutate({
        id: selectedWorkbody.id,
        termsOfReference: data.termsOfReference?.toString(),
      });
      
      toast({
        title: "Terms of Reference Updated",
        description: `Terms of Reference for ${selectedWorkbody.name} has been updated.`,
      });
      setIsTorDialogOpen(false);
    } catch (error) {
      console.error('Error updating terms of reference:', error);
      toast({
        title: "Error",
        description: "Failed to update terms of reference. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Add the missing mutations
  const updateWorkbodyMutation = useMutation({
    mutationFn: async (updatedWorkbody: Partial<Workbody> & { id: string }) => {
      console.log("Updating workbody:", updatedWorkbody);
      const { data, error } = await supabase
        .from('workbodies')
        .update({
          name: updatedWorkbody.name,
          type: updatedWorkbody.type,
          description: updatedWorkbody.description,
          created_date: updatedWorkbody.createdDate,
          end_date: updatedWorkbody.endDate,
          terms_of_reference: updatedWorkbody.termsOfReference
        })
        .eq('id', updatedWorkbody.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating workbody:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workbodies'] });
    },
    onError: (error) => {
      console.error("Update mutation error:", error);
    }
  });

  const deleteWorkbodyMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting workbody:", id);
      const { error } = await supabase
        .from('workbodies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting workbody:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workbodies'] });
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
    }
  });
}
