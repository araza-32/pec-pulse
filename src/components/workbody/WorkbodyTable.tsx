
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Upload, Clock, Trash2 } from "lucide-react";
import { Workbody } from "@/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";

interface WorkbodyTableProps {
  workbodies: Workbody[];
  onEdit: (workbody: Workbody) => void;
  onViewTor: (workbody: Workbody) => void;
  onUploadNotification: (workbody: Workbody) => void;
  onViewHistory: (workbody: Workbody) => void;
  onDelete: (workbody: Workbody) => void;
}

export function WorkbodyTable({
  workbodies,
  onEdit,
  onViewTor,
  onUploadNotification,
  onViewHistory,
  onDelete,
}: WorkbodyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(workbodies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorkbodies = workbodies.slice(startIndex, endIndex);

  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case "committee":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "working-group":
        return "bg-green-100 text-green-700 border-green-300";
      case "task-force":
        return "bg-amber-100 text-amber-700 border-amber-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getEndOfTermText = (workbody: Workbody) => {
    if (workbody.endDate) {
      return new Date(workbody.endDate).toLocaleDateString();
    }
    
    switch(workbody.type) {
      case "committee":
        return "Tenure of GB";
      case "working-group":
        return "Decision of Management";
      case "task-force":
        return "Not specified";
      default:
        return "-";
    }
  };

  return (
    <div className="space-y-2">
      <ScrollArea className="h-[600px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="font-semibold text-foreground">Name</TableHead>
              <TableHead className="font-semibold text-foreground">Type</TableHead>
              <TableHead className="font-semibold text-foreground">Created</TableHead>
              <TableHead className="font-semibold text-foreground">End of Term</TableHead>
              <TableHead className="w-[200px] font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentWorkbodies.map((workbody) => (
              <TableRow key={workbody.id} className="hover:bg-secondary/50">
                <TableCell className="font-medium">{workbody.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      getTypeBadgeStyles(workbody.type)
                    )}
                  >
                    {workbody.type.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(workbody.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {getEndOfTermText(workbody)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(workbody)}
                      title="Edit workbody"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewTor(workbody)}
                      title="Terms of Reference"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onUploadNotification(workbody)}
                      title="Upload Notification"
                    >
                      <Upload className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewHistory(workbody)}
                      title="View Composition History"
                    >
                      <Clock className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(workbody)}
                      title="Delete workbody"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
