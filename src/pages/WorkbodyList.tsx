
import { useState } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Users, ArrowLeft, Search, Grid, List } from "lucide-react";
import { NestedWorkbodyView } from "@/components/workbody/NestedWorkbodyView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WorkbodyList() {
  const { workbodies, isLoading } = useWorkbodies();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"nested" | "table">("nested");
  
  // Filter and sort workbodies
  const filteredWorkbodies = workbodies
    .filter(wb => {
      // Type filter
      if (typeFilter !== "all") {
        if (wb.type !== typeFilter) return false;
      }
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return wb.name.toLowerCase().includes(query);
      }
      
      return true;
    })
    .sort((a, b) => {
      // First sort by type
      if (a.type !== b.type) {
        // Order: committee, working-group, task-force
        const typeOrder = {
          "committee": 0,
          "working-group": 1,
          "task-force": 2
        };
        
        return typeOrder[a.type as keyof typeof typeOrder] - 
               typeOrder[b.type as keyof typeof typeOrder];
      }
      
      // Then sort alphabetically within each type
      return a.name.localeCompare(b.name);
    });
  
  const getWorkbodyTypeLabel = (type: string) => {
    switch (type) {
      case "committee": return "Committee";
      case "working-group": return "Working Group";
      case "task-force": return "Task Force";
      default: return type;
    }
  };
  
  const getWorkbodyStatus = (workbody: any) => {
    if (workbody.type === "task-force" && workbody.endDate) {
      const endDate = new Date(workbody.endDate);
      if (endDate < new Date()) {
        return { label: "Expired", className: "bg-red-100 text-red-800" };
      } else {
        return { label: "Active", className: "bg-green-100 text-green-800" };
      }
    }
    return { label: "Active", className: "bg-green-100 text-green-800" };
  };

  const getEndOfTermText = (workbody: any) => {
    if (workbody.endDate) {
      return format(new Date(workbody.endDate), "MMM d, yyyy");
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">All Workbodies</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            View all PEC workbodies sorted by type
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="committee">Committees</SelectItem>
              <SelectItem value="working-group">Working Groups</SelectItem>
              <SelectItem value="task-force">Task Forces</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Search workbodies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[250px]"
          />
          <Search className="h-4 w-4 text-muted-foreground" />
          
          <Separator orientation="vertical" className="h-6" />
          
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "nested" | "table")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nested" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Nested
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Table
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <Separator />
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <Users className="h-10 w-10 animate-pulse text-muted-foreground" />
            <p className="text-muted-foreground">Loading workbodies...</p>
          </div>
        </div>
      ) : viewMode === "nested" ? (
        <NestedWorkbodyView
          workbodies={filteredWorkbodies}
          onWorkbodyClick={(workbody) => navigate(`/workbody/${workbody.id}`)}
          onEdit={(workbody) => navigate(`/workbody/edit/${workbody.id}`)}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>End of Term</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkbodies.length > 0 ? (
                filteredWorkbodies.map((workbody) => {
                  const status = getWorkbodyStatus(workbody);
                  
                  return (
                    <TableRow key={workbody.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {workbody.parentId && <span className="text-muted-foreground">└─</span>}
                          {workbody.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getWorkbodyTypeLabel(workbody.type)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {workbody.parentId ? 
                          workbodies.find(w => w.id === workbody.parentId)?.name || "Unknown" : 
                          "-"
                        }
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell>{getEndOfTermText(workbody)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/workbody/${workbody.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No workbodies found matching the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
