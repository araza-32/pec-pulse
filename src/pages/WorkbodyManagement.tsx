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
import { AlertCircle, CheckCircle } from "lucide-react";
import { CreateWorkbodyForm } from "@/components/workbody/CreateWorkbodyForm";
import { TaskforceForm } from "@/components/workbody/taskforce/TaskforceForm";
import { Input } from "@/components/ui/input";

import { TaskforceRequestsPanel } from "@/components/workbody/taskforce/TaskforceRequestsPanel";

// Task Force Request interface
interface TaskForceRequest {
  id: string;
  name: string;
  purpose: string;
  requestedBy: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  data: any;
  notificationUploaded?: boolean;
}

export default function WorkbodyManagement() {
  const { toast } = useToast();
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
  const [createMode, setCreateMode] = useState<"none" | "committee" | "working-group" | "task-force">("none");
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [taskForceRequests, setTaskForceRequests] = useState<TaskForceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<TaskForceRequest | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"workbodies" | "requests">("workbodies");

  // Mock user role - in real app, get this from auth context
  const [userRole, setUserRole] = useState<'admin' | 'coordination' | 'secretary'>('admin');

  const { workbodies, isLoading, createWorkbody, updateWorkbody, deleteWorkbody, refetch } = useWorkbodies();
  const { extractMembersFromDocument, isExtracting, extractionError: hookExtractionError, clearExtractionError } = usePdfMemberExtraction();

  useEffect(() => {
    setHideErrors(false);
  }, [workbodies]);

  const handleAddCommitteeSubmit = async (data: WorkbodyFormData) => {
    try {
      data.type = "committee";
      console.log("Submitting new committee data:", data);
      
      if ('id' in data) {
        toast({
          title: "Committee Created",
          description: `${data.name} has been successfully created.`,
        });
        setCreateMode("none");
        await refetch();
      } else {
        await createWorkbody.mutateAsync(data);
        toast({
          title: "Committee Created",
          description: `${data.name} has been successfully created.`,
        });
        setCreateMode("none");
      }
    } catch (error: any) {
      console.error('Error creating committee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create committee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddWorkingGroupSubmit = async (data: WorkbodyFormData) => {
    try {
      data.type = "working-group";
      console.log("Submitting new working group data:", data);
      
      if ('id' in data) {
        toast({
          title: "Working Group Created",
          description: `${data.name} has been successfully created.`,
        });
        setCreateMode("none");
        await refetch();
      } else {
        await createWorkbody.mutateAsync(data);
        toast({
          title: "Working Group Created",
          description: `${data.name} has been successfully created.`,
        });
        setCreateMode("none");
      }
    } catch (error: any) {
      console.error('Error creating working group:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create working group. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddTaskforceSubmit = async (data: any) => {
    try {
      // For secretaries, create a request instead of directly creating
      if (userRole === 'secretary') {
        const request: TaskForceRequest = {
          id: Math.random().toString(36).substring(7), // Generate random ID
          name: data.name,
          purpose: data.purpose,
          requestedBy: "Current Secretary", // In real app, get from auth context
          requestDate: new Date(),
          status: 'pending',
          data: data // Store full task force data
        };
        
        // Store in mock state (in real app, this would go to the database)
        setTaskForceRequests(prev => [...prev, request]);
        
        toast({
          title: "Task Force Requested",
          description: `Your request for ${data.name} has been submitted for approval.`,
        });
        setCreateMode("none");
      } else {
        // For admin and coordination, create directly
        await createWorkbody.mutateAsync({
          name: data.name,
          type: "task-force",
          createdDate: new Date(data.createdDate),
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          termsOfReference: data.scope || "",
          description: data.purpose || "",
        });
        toast({
          title: "Task Force Created",
          description: `${data.name} has been successfully created.`,
        });
        setCreateMode("none");
      }
      await refetch();
    } catch (error: any) {
      console.error('Error creating task force:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create task force. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApproveTaskForce = async (request: TaskForceRequest) => {
    try {
      // Create the workbody from the stored data
      await createWorkbody.mutateAsync({
        name: request.data.name,
        type: "task-force",
        createdDate: new Date(request.data.createdDate),
        endDate: request.data.endDate ? new Date(request.data.endDate) : undefined,
        termsOfReference: request.data.scope || "",
        description: request.data.purpose || "",
      });

      // Update the request status
      const updatedRequests = taskForceRequests.map(req => 
        req.id === request.id ? { ...req, status: 'approved' as const, notificationUploaded: false } : req
      );
      setTaskForceRequests(updatedRequests);
      
      toast({
        title: "Task Force Approved",
        description: `${request.name} has been approved and created.`,
      });
      
      // Open notification upload dialog
      setSelectedRequest(request);
      setIsApprovalDialogOpen(true);
      
    } catch (error: any) {
      console.error('Error approving task force:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve task force. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectTaskForce = (request: TaskForceRequest) => {
    const updatedRequests = taskForceRequests.map(req => 
      req.id === request.id ? { ...req, status: 'rejected' as const } : req
    );
    setTaskForceRequests(updatedRequests);
    
    toast({
      title: "Task Force Rejected",
      description: `The request for ${request.name} has been rejected.`,
    });
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

  const handleApprovalNotificationUpload = (documentId: string) => {
    if (selectedRequest) {
      const updatedRequests = taskForceRequests.map(req =>
        req.id === selectedRequest.id ? { ...req, notificationUploaded: true } : req
      );
      setTaskForceRequests(updatedRequests);
    }
    toast({
      title: "Notification Uploaded",
      description: "The notification for the approved task force has been uploaded.",
    });
    setIsApprovalDialogOpen(false);
    setSelectedRequest(null);
  };

  const filteredWorkbodies = workbodies.filter(
    (workbody) =>
      workbody.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workbody.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helpers for taskforce request panel
  const myRequests = taskForceRequests.filter(
    (req) => userRole === 'secretary' && req.requestedBy === "Current Secretary"
  );
  const adminPendingRequests = taskForceRequests.filter(
    (req) => (userRole === 'admin' || userRole === 'coordination') && req.status === 'pending'
  );

  // Handler for opening requests tab after submit (for secretary)
  const handleAfterRequestSubmit = () => {
    setActiveTab("requests");
  };

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

      <div className="flex justify-between items-end border-b mb-4">
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 border-b-2 ${activeTab === "workbodies" ? "border-pec-green text-pec-green font-bold" : "border-transparent text-gray-500"}`}
            onClick={() => setActiveTab("workbodies")}
          >
            Workbodies
          </button>
          <button
            className={`px-4 py-2 border-b-2 ${activeTab === "requests" ? "border-pec-green text-pec-green font-bold" : "border-transparent text-gray-500"}`}
            onClick={() => setActiveTab("requests")}
          >
            {userRole === 'secretary' ? "My Task Force Requests" : "Task Force Formation Requests"}
            {userRole !== 'secretary' && adminPendingRequests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-200 text-xs text-amber-800">{adminPendingRequests.length}</span>
            )}
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search workbodies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {/* Only show Committee and Working Group buttons to admin and coordination */}
            {(userRole === 'admin' || userRole === 'coordination') && (
              <>
                <Button onClick={() => setCreateMode("committee")}>
                  <span className="mr-2">+</span> New Committee
                </Button>
                
                <Button onClick={() => setCreateMode("working-group")} variant="outline">
                  <span className="mr-2">+</span> New Working Group
                </Button>
              </>
            )}
            
            {/* Show Task Force button to all roles */}
            <Button 
              onClick={() => setCreateMode("task-force")} 
              variant={userRole === 'secretary' ? "default" : "outline"}
            >
              <span className="mr-2">+</span> New Task Force
              {userRole === 'secretary' && <span className="ml-2 text-xs bg-green-800 px-2 py-0.5 rounded-full">Available</span>}
            </Button>
          </div>
        </div>
      </div>

      {activeTab === "workbodies" ? (
        <>
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
        </>
      ) : (
        <div className="mt-4">
          <TaskforceRequestsPanel
            requests={
              userRole === "secretary"
                ? myRequests
                : adminPendingRequests
            }
            userRole={userRole}
            onApprove={handleApproveTaskForce}
            onReject={handleRejectTaskForce}
            onUpload={(req) => {
              setSelectedRequest(req);
              setIsApprovalDialogOpen(true);
            }}
          />
          {selectedRequest && isApprovalDialogOpen && (
            <Dialog open={true} onOpenChange={(open) => {
                setIsApprovalDialogOpen(open);
                if (!open) setSelectedRequest(null);
              }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Notification</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p>Upload the notification document for the approved task force: <strong>{selectedRequest.name}</strong></p>
                  <div className="mt-4">
                    <Input type="file" accept=".pdf" />
                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => handleApprovalNotificationUpload("mock-document-id")}>
                        Upload Notification
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}

      {/* Committee Creation Dialog */}
      <Dialog open={createMode === "committee"} onOpenChange={(open) => {
        if (!open) setCreateMode("none");
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Committee</DialogTitle>
          </DialogHeader>
          <CreateWorkbodyForm
            onSubmit={handleAddCommitteeSubmit}
            onCancel={() => setCreateMode("none")}
            initialData={{ type: "committee" }}
          />
        </DialogContent>
      </Dialog>

      {/* Working Group Creation Dialog */}
      <Dialog open={createMode === "working-group"} onOpenChange={(open) => {
        if (!open) setCreateMode("none");
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Working Group</DialogTitle>
          </DialogHeader>
          <CreateWorkbodyForm
            onSubmit={handleAddWorkingGroupSubmit}
            onCancel={() => setCreateMode("none")}
            initialData={{ type: "working-group" }}
          />
        </DialogContent>
      </Dialog>

      {/* Task Force Creation Dialog */}
      <Dialog open={createMode === "task-force"} onOpenChange={(open) => {
        if (!open) setCreateMode("none");
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {userRole === 'secretary' ? 'Request New Task Force' : 'Create Task Force'}
            </DialogTitle>
          </DialogHeader>
          <TaskforceForm
            onSubmit={handleAddTaskforceSubmit}
            onCancel={() => setCreateMode("none")}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Workbody Dialog */}
      <DeleteWorkbodyDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        workbodyName={selectedWorkbody?.name || ""}
        onDelete={handleDeleteWorkbody}
      />

      {/* Terms of Reference Dialog */}
      <TermsOfReferenceDialog
        isOpen={isTorDialogOpen}
        onClose={() => setIsTorDialogOpen(false)}
        workbodyName={selectedWorkbody?.name || ""}
        initialTermsOfReference={selectedWorkbody?.termsOfReference || ""}
        onSubmit={handleTorSubmit}
      />

      {/* UI for testing different user roles */}
      <div className="fixed bottom-4 right-4 bg-white p-2 border rounded-md shadow-md">
        <div className="text-xs font-medium mb-2">Testing: Switch User Role</div>
        <div className="flex gap-2">
          <Button size="sm" variant={userRole === 'admin' ? "default" : "outline"} onClick={() => setUserRole('admin')}>Admin</Button>
          <Button size="sm" variant={userRole === 'coordination' ? "default" : "outline"} onClick={() => setUserRole('coordination')}>Coordination</Button>
          <Button size="sm" variant={userRole === 'secretary' ? "default" : "outline"} onClick={() => setUserRole('secretary')}>Secretary</Button>
        </div>
      </div>
    </div>
  );
}
