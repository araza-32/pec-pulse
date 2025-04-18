
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
