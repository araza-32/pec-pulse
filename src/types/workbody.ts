
export interface CompositionHistoryProps {
  workbodyId: string;
  onClose: () => void;
}

export interface WorkbodyFormData {
  name: string;
  type: string;
  description?: string;
  createdDate: Date;
  endDate?: Date;
  termsOfReference?: string;
}

export interface DocumentUploadResult {
  id: string;
  file_url: string;
  document_type: 'notification' | 'tor';
  uploaded_at: string;
}
