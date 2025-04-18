
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
import { supabase } from '@/integrations/supabase/client';

interface DocumentUploadProps {
  workbodyId: string;
  documentType: 'notification' | 'tor';
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (documentId: string) => void;
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
      console.log(`Uploading ${documentType} for workbody ${workbodyId}`);
      
      // Upload file to Supabase Storage
      const bucketId = 'workbody-documents';
      const fileExt = file.name.split('.').pop();
      const fileName = `${workbodyId}/${documentType}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from(bucketId)
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      if (!data?.path) {
        throw new Error('Upload failed - no path returned');
      }

      console.log('File uploaded successfully:', data.path);

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketId)
        .getPublicUrl(data.path);

      console.log('Public URL generated:', publicUrl);

      // Store document reference in the database
      const { data: insertData, error: dbError } = await supabase
        .from('workbody_documents')
        .insert({
          workbody_id: workbodyId,
          document_type: documentType,
          file_url: publicUrl,
          uploaded_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (dbError) {
        console.error('Database insertion error:', dbError);
        throw dbError;
      }

      console.log('Document reference saved with ID:', insertData.id);

      toast({
        title: 'Document Uploaded',
        description: `The ${documentType === 'notification' ? 'notification' : 'terms of reference'} has been successfully uploaded.`
      });
      
      onUploadComplete(insertData.id);
      onClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'There was an error uploading the document.',
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
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
