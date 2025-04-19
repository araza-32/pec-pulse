import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { WorkbodyForm } from "@/components/workbody/WorkbodyForm";
import { Workbody } from "@/types";
import { WorkbodyFormData } from "@/types/workbody";
import { DocumentUpload } from "@/components/workbody/DocumentUpload";
import { CompositionHistory } from "@/components/workbody/CompositionHistory";
import { WorkbodyTable } from "@/components/workbody/WorkbodyTable";
import { DeleteWorkbodyDialog } from "@/components/workbody/DeleteWorkbodyDialog";
import { TermsOfReferenceDialog } from "@/components/workbody/TermsOfReferenceDialog";
import { ExpiringTaskForceAlert } from "@/components/workbody/ExpiringTaskForceAlert";
import { usePdfMemberExtraction } from "@/hooks/usePdfMemberExtraction";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { WorkbodyHeader } from "@/components/workbody/WorkbodyHeader";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [hideErrors, setHideErrors] = useState(false);

  const { workbodies, isLoading, createWorkbody, updateWorkbody, deleteWorkbody, refetch } = useWorkbodies();
  const { extractMembersFromDocument, isExtracting, extractionError: hookExtractionError, clearExtractionError } = usePdfMemberExtraction();

  useEffect(() => {
    setHideErrors(false);
  }, [workbodies]);

  const handleAddSubmit = async (data: WorkbodyFormData) => {
    try {
      console.log("Submitting new workbody data:", data);
      await createWorkbody.mutateAsync(data);

      toast({
        title: "Workbody Created",
        description: `${data.name} has been successfully created.`,
      });
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating workbody:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create workbody. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (data: WorkbodyFormData) => {
    if (!selectedWorkbody) return;

    try {
      await updateWorkbody.mutateAsync({
        ...data,
        id: selectedWorkbody.id,
      });

      toast({
        title: "Workbody Updated",
        description: `${data.name} has been successfully updated.`,
      });
      setIsEditDialogOpen(false);
      setSelectedWorkbody(null);
    } catch (error: any) {
      console.error('Error updating workbody:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update workbody. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkbody = async () => {
    if (!selectedWorkbody) return;

    try {
      await deleteWorkbody.mutateAsync(selectedWorkbody.id);
      
      toast({
        title: "Workbody Deleted",
        description: `${selectedWorkbody.name} has been successfully deleted.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedWorkbody(null);
    } catch (error: any) {
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
      await updateWorkbody.mutateAsync({
        id: selectedWorkbody.id,
        name: selectedWorkbody.name,
        type: selectedWorkbody.type,
        createdDate: new Date(selectedWorkbody.createdDate),
        description: selectedWorkbody.description,
        endDate: selectedWorkbody.endDate ? new Date(selectedWorkbody.endDate) : undefined,
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
        setExtractionError(null);
        setHideErrors(false);
        clearExtractionError();
        
        console.log("Handling notification upload for document:", documentId);
        const members = await extractMembersFromDocument(documentId, selectedWorkbody.id);
        
        const validMembers = members.filter(m => 
          !m.name.includes("Error") && 
          !m.name.includes("Processing") && 
          !m.role.includes("error")
        );
        
        if (validMembers.length > 0) {
          toast({
            title: "Members Extracted",
            description: `${validMembers.length} members have been extracted from the document.`,
          });
        }
        
        await refetch();
        setIsHistoryVisible(true);
        setIsUploadNotificationOpen(false);
      } catch (error: any) {
        console.error('Error extracting members:', error);
        setExtractionError(error.message || "Failed to extract members from document");
        toast({
          title: "Extraction Error",
          description: error.message || "Failed to extract members from document. Please try again.",
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

      {!hideErrors && (extractionError || hookExtractionError) && (
        <Alert variant="destructive" className="flex items-center justify-between">
          <div>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>PDF Extraction Error</AlertTitle>
            <AlertDescription>
              {extractionError || hookExtractionError}
              <p className="text-sm mt-1">
                Try uploading a different document or check that the PDF contains member information in a readable format.
              </p>
            </AlertDescription>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setHideErrors(true);
              setExtractionError(null);
              clearExtractionError();
            }}
          >
            Dismiss
          </Button>
        </Alert>
      )}

      <WorkbodyHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsAddDialogOpen(true)}
      />

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
            setExtractionError(null);
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
            onUploadComplete={handleNotificationUpload}
          />

          <DocumentUpload
            workbodyId={selectedWorkbody.id}
            documentType="tor"
            isOpen={isUploadTorOpen}
            onClose={() => setIsUploadTorOpen(false)}
            onUploadComplete={() => window.location.reload()}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Workbody</DialogTitle>
          </DialogHeader>
          <CreateWorkbodyForm
            onSubmit={handleAddSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Workbody</DialogTitle>
          </DialogHeader>
          {selectedWorkbody && (
            <CreateWorkbodyForm
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
}
