
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkbodyTableProps {
  workbodies: any[];
}

export function AllWorkbodiesTable({ workbodies }: WorkbodyTableProps) {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Apply filters
  const filteredWorkbodies = workbodies.filter((wb) => {
    const matchesSearch = wb.name
      .toLowerCase()
      .includes(filterValue.toLowerCase());
    const matchesType =
      typeFilter === "all" || wb.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleRowClick = (id: string) => {
    navigate(`/workbodies/${id}`);
  };

  // Function to get badge color based on workbody type
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "committee":
        return "bg-blue-100 text-blue-800";
      case "working-group":
        return "bg-green-100 text-green-800";
      case "task-force":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b">
        <h3 className="text-lg font-semibold text-left w-full sm:w-auto">All Workbodies</h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search workbodies..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="sm:w-[200px]"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="committee">Committees</SelectItem>
              <SelectItem value="working-group">Working Groups</SelectItem>
              <SelectItem value="task-force">Task Forces</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px] text-left">Name</TableHead>
              <TableHead className="text-left">Type</TableHead>
              <TableHead className="text-right">Members</TableHead>
              <TableHead className="text-right">Total Meetings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkbodies.length > 0 ? (
              filteredWorkbodies.map((wb) => (
                <TableRow
                  key={wb.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(wb.id)}
                >
                  <TableCell className="font-medium text-left">{wb.name}</TableCell>
                  <TableCell className="text-left">
                    <Badge
                      className={`${getTypeBadgeColor(
                        wb.type
                      )} hover:bg-opacity-80 transition-all`}
                      variant="outline"
                    >
                      {wb.type.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{wb.members.length}</TableCell>
                  <TableCell className="text-right">{wb.totalMeetings}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(wb.id);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No workbodies match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
