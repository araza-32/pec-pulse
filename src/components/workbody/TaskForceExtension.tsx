
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, FileText } from "lucide-react";

interface ExtensionRequest {
  id: string;
  taskForceId: string;
  taskForceName: string;
  requestedBy: string;
  requestedDate: string;
  currentEndDate: string;
  proposedEndDate: string;
  justification: string;
  status: 'pending' | 'recommended' | 'approved' | 'rejected';
  recommendedBy?: string;
  approvedBy?: string;
  comments?: string;
}

export function TaskForceExtension() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ExtensionRequest[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    taskForceId: '',
    proposedEndDate: '',
    justification: ''
  });

  const userRole = user?.role || 'member';
  const canCreate = ['secretary', 'admin', 'coordination'].includes(userRole);
  const canRecommend = ['admin', 'coordination'].includes(userRole);
  const canApprove = ['chairman', 'registrar'].includes(userRole);

  const handleCreateRequest = async () => {
    if (!formData.taskForceId || !formData.proposedEndDate || !formData.justification) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, this would save to database
      const newRequest: ExtensionRequest = {
        id: Date.now().toString(),
        taskForceId: formData.taskForceId,
        taskForceName: "Task Force Name", // Would be fetched from workbodies
        requestedBy: user?.name || user?.id || 'Unknown',
        requestedDate: new Date().toISOString().split('T')[0],
        currentEndDate: '2024-12-31', // Would be fetched from workbody data
        proposedEndDate: formData.proposedEndDate,
        justification: formData.justification,
        status: 'pending'
      };

      setRequests([...requests, newRequest]);
      setIsCreating(false);
      setFormData({ taskForceId: '', proposedEndDate: '', justification: '' });
      
      toast({
        title: "Success",
        description: "Extension request submitted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit extension request",
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: ExtensionRequest['status'], comments?: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: newStatus,
            comments,
            ...(newStatus === 'recommended' ? { recommendedBy: user?.name || user?.id } : {}),
            ...(newStatus === 'approved' ? { approvedBy: user?.name || user?.id } : {})
          }
        : req
    ));

    toast({
      title: "Success",
      description: `Request ${newStatus} successfully`
    });
  };

  const getStatusBadge = (status: ExtensionRequest['status']) => {
    const variants = {
      pending: 'default',
      recommended: 'secondary',
      approved: 'default',
      rejected: 'destructive'
    } as const;

    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      recommended: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (!canCreate && !canRecommend && !canApprove) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            You don't have permission to access task force extensions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Task Force Extensions</h2>
          <p className="text-muted-foreground">
            Manage extension requests for task forces
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setIsCreating(true)}>
            Request Extension
          </Button>
        )}
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>New Extension Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="taskForce">Task Force</Label>
              <Select
                value={formData.taskForceId}
                onValueChange={(value) => setFormData({ ...formData, taskForceId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task force" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tf1">TF-CPD Policy Revision</SelectItem>
                  <SelectItem value="tf2">TF-Power Sector Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="proposedDate">Proposed End Date</Label>
              <Input
                id="proposedDate"
                type="date"
                value={formData.proposedEndDate}
                onChange={(e) => setFormData({ ...formData, proposedEndDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="justification">Justification</Label>
              <Textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                placeholder="Provide justification for the extension request..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateRequest}>
                Submit Request
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                No extension requests found
              </p>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {request.taskForceName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Requested by {request.requestedBy} on {request.requestedDate}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Current End Date</p>
                      <p className="text-sm text-muted-foreground">{request.currentEndDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Proposed End Date</p>
                      <p className="text-sm text-muted-foreground">{request.proposedEndDate}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Justification</p>
                  <p className="text-sm text-muted-foreground">{request.justification}</p>
                </div>

                {request.comments && (
                  <div>
                    <p className="text-sm font-medium mb-2">Comments</p>
                    <p className="text-sm text-muted-foreground">{request.comments}</p>
                  </div>
                )}

                {request.status === 'pending' && canRecommend && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, 'recommended')}
                    >
                      Recommend
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusUpdate(request.id, 'rejected', 'Not recommended')}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {request.status === 'recommended' && canApprove && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusUpdate(request.id, 'rejected', 'Not approved')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
