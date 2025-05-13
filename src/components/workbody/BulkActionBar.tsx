
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Download, Trash, Edit } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onExport: () => void;
  onChangeStatus: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function BulkActionBar({
  selectedCount,
  onExport,
  onChangeStatus,
  onDelete,
  onClose
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20 animate-in slide-in-from-bottom">
      <div className="container max-w-7xl mx-auto py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full mr-2">
              {selectedCount}
            </span>
            workbodies selected
          </div>
          
          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onExport}>
                    <Download className="h-4 w-4 mr-1" />
                    <span>Export CSV</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export selected workbodies to CSV</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={onChangeStatus}>
                    <Edit className="h-4 w-4 mr-1" />
                    <span>Change Status</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Update status of selected workbodies</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="sm" onClick={onDelete}>
                    <Trash className="h-4 w-4 mr-1" />
                    <span>Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete selected workbodies</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
