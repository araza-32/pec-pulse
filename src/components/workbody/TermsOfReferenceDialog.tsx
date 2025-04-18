
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface TermsOfReferenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workbodyName: string;
  initialTermsOfReference: string;
  onSubmit: (data: { termsOfReference: FormDataEntryValue | null }) => void;
}

export function TermsOfReferenceDialog({
  isOpen,
  onClose,
  workbodyName,
  initialTermsOfReference,
  onSubmit,
}: TermsOfReferenceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Terms of Reference - {workbodyName}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit({
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
              defaultValue={initialTermsOfReference || ""}
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
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
