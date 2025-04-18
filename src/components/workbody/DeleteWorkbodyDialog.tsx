
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteWorkbodyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workbodyName: string;
  onDelete: () => void;
}

export function DeleteWorkbodyDialog({
  isOpen,
  onClose,
  workbodyName,
  onDelete,
}: DeleteWorkbodyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Workbody</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to delete{" "}
            <strong>{workbodyName}</strong>?
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This action cannot be undone. This will permanently delete the
            workbody and all related data.
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
