import { useState } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  FileText,
  Clock,
  Search,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import { WorkbodyForm } from "@/components/workbody/WorkbodyForm";
import { Workbody, WorkbodyType } from "@/types";
import { workbodies as mockWorkbodies } from "@/data/mockData";
import { DocumentUpload } from "@/components/workbody/DocumentUpload";
import { CompositionHistory } from "@/components/workbody/CompositionHistory";

export default function WorkbodyManagement() {
  const { toast } = useToast();
  const [workbodies, setWorkbodies] = useState<Workbody[]>(mockWorkbodies);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTorDialogOpen, setIsTorDialogOpen] = useState(false);
  const [selectedWorkbody, setSelectedWorkbody] = useState<Workbody | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadNotificationOpen, setIsUploadNotificationOpen] = useState(false);
  const [isUploadTorOpen, setIsUploadTorOpen] = useState(false);

  const filteredWorkbodies = workbodies.filter(
    (workbody) =>
      workbody.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workbody.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (data: any) => {
    const newWorkbody: Workbody = {
      id: `wb-${Date.now()}`,
      name: data.name,
      type: data.type as WorkbodyType,
      totalMeetings: 0,
      meetingsThisYear: 0,
      actionsAgreed: 0,
      actionsCompleted: 0,
      members: [],
      description: data.description,
      createdDate: data.createdDate.toISOString(),
      endDate: data.endDate ? data.endDate.toISOString() : undefined,
      termsOfReference: data.termsOfReference,
    };

    setWorkbodies([...workbodies, newWorkbody]);
    toast({
      title: "Workbody Created",
      description: `${newWorkbody.name} has been successfully created.`,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (data: any) => {
    if (!selectedWorkbody) return;

    const updatedWorkbodies = workbodies.map((wb) =>
      wb.id === selectedWorkbody.id
        ? {
            ...wb,
            name: data.name,
            type: data.type,
            description: data.description,
            createdDate: data.createdDate.toISOString(),
            endDate: data.endDate ? data.endDate.toISOString() : undefined,
            termsOfReference: data.termsOfReference,
          }
        : wb
    );

    setWorkbodies(updatedWorkbodies);
    toast({
      title: "Workbody Updated",
      description: `${data.name} has been successfully updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedWorkbody(null);
  };

  const handleDeleteWorkbody = () => {
    if (!selectedWorkbody) return;

    const updatedWorkbodies = workbodies.filter(
      (wb) => wb.id !== selectedWorkbody.id
    );
    setWorkbodies(updatedWorkbodies);
    toast({
      title: "Workbody Deleted",
      description: `${selectedWorkbody.name} has been successfully deleted.`,
    });
    setIsDeleteDialogOpen(false);
    setSelectedWorkbody(null);
  };

  const handleTorSubmit = (data: any) => {
    if (!selectedWorkbody) return;

    const updatedWorkbodies = workbodies.map((wb) =>
      wb.id === selectedWorkbody.id
        ? {
            ...wb,
            termsOfReference: data.termsOfReference,
          }
        : wb
    );

    setWorkbodies(updatedWorkbodies);
    toast({
      title: "Terms of Reference Updated",
      description: `Terms of Reference for ${selectedWorkbody.name} have been updated.`,
    });
    setIsTorDialogOpen(false);
    setSelectedWorkbody(null);
  };

  const checkExpiringTaskForces = () => {
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);

    const expiringTaskForces = workbodies.filter(
      (wb) =>
        wb.type === "task-force" &&
        wb.endDate &&
        new Date(wb.endDate) <= twoWeeksFromNow &&
        new Date(wb.endDate) >= today
    );

    return expiringTaskForces;
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
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-amber-500 mr-2" />
            <h3 className="font-medium text-amber-800">
              Task Forces Approaching End Date
            </h3>
          </div>
          <div className="mt-2 space-y-1">
            {expiringTaskForces.map((tf) => (
              <p key={tf.id} className="text-sm text-amber-700">
                {tf.name} - Ends on{" "}
                {new Date(tf.endDate!).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            ))}
          </div>
        </div>
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredWorkbodies.map((workbody) => (
            <TableRow key={workbody.id}>
              <TableCell className="font-medium">{workbody.name}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    workbody.type === "committee" && "bg-blue-50 text-blue-700",
                    workbody.type === "working-group" &&
                      "bg-green-50 text-green-700",
                    workbody.type === "task-force" &&
                      "bg-amber-50 text-amber-700"
                  )}
                >
                  {workbody.type.replace("-", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(workbody.createdDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {workbody.endDate
                  ? new Date(workbody.endDate).toLocaleDateString()
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedWorkbody(workbody);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedWorkbody(workbody);
                      setIsTorDialogOpen(true);
                    }}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedWorkbody(workbody);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedWorkbody && (
        <>
          <DocumentUpload
            workbodyId={selectedWorkbody.id}
            documentType="notification"
            isOpen={isUploadNotificationOpen}
            onClose={() => setIsUploadNotificationOpen(false)}
            onUploadComplete={() => {
              const updatedWorkbodies = [...workbodies];
              setWorkbodies(updatedWorkbodies);
            }}
          />

          <DocumentUpload
            workbodyId={selectedWorkbody.id}
            documentType="tor"
            isOpen={isUploadTorOpen}
            onClose={() => setIsUploadTorOpen(false)}
            onUploadComplete={() => {
              const updatedWorkbodies = [...workbodies];
              setWorkbodies(updatedWorkbodies);
            }}
          />

          <CompositionHistory workbodyId={selectedWorkbody.id} />
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workbody</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedWorkbody?.name}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the
              workbody and all related data.
            </p>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWorkbody}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTorDialogOpen} onOpenChange={setIsTorDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Terms of Reference - {selectedWorkbody?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedWorkbody && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleTorSubmit({
                  termsOfReference: formData.get("termsOfReference"),
                });
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label
                  htmlFor="termsOfReference"
                  className="text-sm font-medium"
                >
                  Terms of Reference
                </label>
                <Textarea
                  id="termsOfReference"
                  name="termsOfReference"
                  placeholder="Enter terms of reference or mandate"
                  className="min-h-[300px]"
                  defaultValue={selectedWorkbody.termsOfReference || ""}
                />
                <p className="text-sm text-muted-foreground">
                  Enter the full Terms of Reference or upload a document
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="torDocument" className="text-sm font-medium">
                  Or Upload ToR Document
                </label>
                <Input id="torDocument" type="file" />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsTorDialogOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
