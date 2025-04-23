
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types for task force requests
interface TaskForceRequest {
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
  // For secretary, only show their own requests.
  // For admin/coord, show all pending.
  const { toast } = useToast();

  if (!requests.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No task force requests found.
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
              <span className="ml-3 text-xs">{req.status === "pending" && <span className="bg-yellow-200 text-yellow-900 rounded px-2 py-0.5">In Process</span>}
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
              <Button variant="outline" size="sm" onClick={() => onUpload(req)}>
                Upload Notification
              </Button>
            )}
            {/* Secretary sees upload complete */}
            {userRole === "secretary" && req.status === "approved" && (
              <span className="text-green-700 font-medium ml-1">Approved & Added</span>
            )}
            {userRole === "secretary" && req.status === "rejected" && (
              <span className="text-red-700 font-medium ml-1">Rejected</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
