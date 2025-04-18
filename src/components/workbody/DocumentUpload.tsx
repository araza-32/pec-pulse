
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
  const [fileName, setFileName] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset state when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFileName('');
      setUploadError(null);
      onClose();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadError(null);
    setIsUploading(true);
    
    try {
      console.log(`Uploading ${documentType} for workbody ${workbodyId}`);
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }
      
      // Check file type
      const validTypes = [
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 'image/jpg', 'image/png'
      ];
      
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG');
      }
      
      // Upload file to Supabase Storage
      const bucketId = 'workbody-documents';
      const fileExt = file.name.split('.').pop();
      const fileName = `${workbodyId}/${documentType}-${Date.now()}.${fileExt}`;
      
      // Check if bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucketId);
      
      if (!bucketExists) {
        console.log('Creating storage bucket:', bucketId);
        const { error: createError } = await supabase.storage.createBucket(bucketId, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: validTypes
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          throw new Error('Failed to create storage bucket');
        }
      }
      
      const { error: uploadError, data } = await supabase.storage
        .from(bucketId)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

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
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'There was an error uploading the document.');
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Upload {documentType === 'notification' ? 'Notification' : 'Terms of Reference'}
          </DialogTitle>
          <DialogDescription>
            {documentType === 'notification' 
              ? 'Upload a notification document containing committee members.' 
              : 'Upload the terms of reference document.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {uploadError && (
            <Alert variant="destructive">
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
          
          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB)
            </p>
            {fileName && (
              <p className="text-sm font-medium mt-2">Selected file: {fileName}</p>
            )}
            <Input
              type="file"
              className="mt-4"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            {isUploading && (
              <p className="text-xs text-muted-foreground animate-pulse mt-2">
                Uploading and processing document...
              </p>
            )}
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
