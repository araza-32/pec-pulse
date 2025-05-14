
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface WorkbodyMinutesUploadProps {
  workbodyId: string;
}

export function WorkbodyMinutesUpload({ workbodyId }: WorkbodyMinutesUploadProps) {
  const { session } = useAuth();
  const userRole = session?.role || 'user';

  // Only show the upload button for users with appropriate permissions
  if (!['admin', 'secretary', 'chairman', 'coordination'].includes(userRole)) {
    return null;
  }

  return (
    <Link to={`/upload-minutes?workbody=${workbodyId}`}>
      <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
        <Upload className="mr-2 h-4 w-4" />
        Upload Minutes
      </Button>
    </Link>
  );
}
