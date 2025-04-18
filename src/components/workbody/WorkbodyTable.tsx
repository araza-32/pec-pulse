
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead className="w-[200px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workbodies.map((workbody) => (
          <TableRow key={workbody.id}>
            <TableCell className="font-medium">{workbody.name}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  workbody.type === "committee" && "bg-blue-50 text-blue-700",
                  workbody.type === "working-group" &&
                    "bg-green-50 text-green-700",
                  workbody.type === "task-force" &&
                    "bg-amber-50 text-amber-700"
                )}
              >
                {workbody.type.replace("-", " ")}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(workbody.createdDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {workbody.endDate
                ? new Date(workbody.endDate).toLocaleDateString()
                : "-"}
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
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
