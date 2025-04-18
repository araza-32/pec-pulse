
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface DocumentUploadProps {
  workbodyId: string;
  documentType: 'notification' | 'tor';
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export function DocumentUpload({
  workbodyId,
  documentType,
  isOpen,
  onClose,
  onUploadComplete
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Document Uploaded',
        description: `The ${documentType} has been successfully uploaded.`
      });
      
      onUploadComplete();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading the document.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Upload {documentType === 'notification' ? 'Notification' : 'Terms of Reference'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <Input
              type="file"
              className="mt-4"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
