
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, FileUp, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types for task force requests
export interface TaskForceRequest {
  id: string;
  name: string;
  purpose: string;
  requestedBy: string;
  requestDate: Date;
  status: "pending" | "approved" | "rejected";
  data: any;
  notificationUploaded?: boolean;
}

// Props: requests, current user role, action handlers for approve/reject/upload
interface TaskforceRequestsPanelProps {
  requests: TaskForceRequest[];
  userRole: "admin" | "coordination" | "secretary";
  onApprove: (req: TaskForceRequest) => void;
  onReject: (req: TaskForceRequest) => void;
  onUpload: (req: TaskForceRequest) => void;
}

export function TaskforceRequestsPanel({
  requests,
  userRole,
  onApprove,
  onReject,
  onUpload,
}: TaskforceRequestsPanelProps) {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<TaskForceRequest | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Handle notification upload
  const handleUploadClick = (req: TaskForceRequest) => {
    setSelectedRequest(req);
    setShowUploadDialog(true);
  };

  const handleUploadSubmit = () => {
    if (!selectedRequest) return;
    
    onUpload(selectedRequest);
    setShowUploadDialog(false);
    setSelectedRequest(null);
    
    toast({
      title: "Notification uploaded",
      description: `Notification for "${selectedRequest.name}" has been successfully uploaded.`,
    });
  };

  if (!requests.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {userRole === "secretary" 
          ? "You haven't submitted any task force requests yet."
          : "No pending task force formation requests found."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.id} className={`rounded border p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 ${req.status === "pending" ? "border-yellow-300 bg-yellow-50" : req.status === "approved" ? "border-green-300 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <div className="flex-1 space-y-1">
            <div className="flex flex-col md:flex-row md:items-baseline gap-1">
              <span className="font-semibold">{req.name}</span>
              <span className="ml-3 text-xs">
                {req.status === "pending" && <span className="bg-yellow-200 text-yellow-900 rounded px-2 py-0.5">In Process</span>}
                {req.status === "approved" && <span className="bg-green-200 text-green-900 rounded px-2 py-0.5">Approved</span>}
                {req.status === "rejected" && <span className="bg-red-200 text-red-900 rounded px-2 py-0.5">Rejected</span>}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">{req.purpose}</div>
            <div className="text-xs mt-1">
              Requested by <span className="font-medium">{req.requestedBy}</span> on <span>{new Date(req.requestDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Admin/Coordination may approve/reject */}
            {(userRole === "admin" || userRole === "coordination") && req.status === "pending" && (
              <>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onApprove(req)}>
                  <Check className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button variant="outline" size="sm" onClick={() => onReject(req)}>
                  <X className="w-4 h-4 mr-1" /> Reject
                </Button>
              </>
            )}
            {/* Upload notification after approval */}
            {(userRole === "admin" || userRole === "coordination") && req.status === "approved" && !req.notificationUploaded && (
              <Button variant="outline" size="sm" onClick={() => handleUploadClick(req)}>
                <FileUp className="w-4 h-4 mr-1" /> Upload Notification
              </Button>
            )}
            {/* Secretary sees upload complete */}
            {userRole === "secretary" && req.status === "approved" && req.notificationUploaded && (
              <div className="flex items-center text-green-700">
                <Check className="w-4 h-4 mr-1" /> 
                <span className="font-medium">Approved & Added to Workbodies</span>
              </div>
            )}
            {userRole === "secretary" && req.status === "approved" && !req.notificationUploaded && (
              <div className="flex items-center text-green-700">
                <AlertCircle className="w-4 h-4 mr-1" /> 
                <span className="font-medium">Approved (Notification pending)</span>
              </div>
            )}
            {userRole === "secretary" && req.status === "rejected" && (
              <div className="flex items-center text-red-700">
                <X className="w-4 h-4 mr-1" />
                <span className="font-medium">Rejected</span>
              </div>
            )}
            {userRole === "secretary" && req.status === "pending" && (
              <div className="flex items-center text-yellow-700">
                <span className="font-medium">In Review</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Notification Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Task Force Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>Upload the official notification document for the task force: <strong>{selectedRequest?.name}</strong></p>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="notification-file">Notification Document</Label>
              <Input id="notification-file" type="file" accept=".pdf,.doc,.docx" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadSubmit}>
                Upload Notification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
