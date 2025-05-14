
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WorkbodyMinutesUploadProps {
  workbodyId: string;
}

export function WorkbodyMinutesUpload({ workbodyId }: WorkbodyMinutesUploadProps) {
  return (
    <div className="mt-4">
      <Link to="/upload-minutes">
        <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Minutes
        </Button>
      </Link>
    </div>
  );
}
