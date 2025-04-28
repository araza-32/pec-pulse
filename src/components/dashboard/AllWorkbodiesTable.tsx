
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Workbody } from "@/types";
import { useState } from "react";
import { formatWorkbodyType } from "./WorkbodyTables";

interface AllWorkbodiesTableProps {
  workbodies: Workbody[];
}

export const AllWorkbodiesTable = ({ workbodies }: AllWorkbodiesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const sortedWorkbodies = [...workbodies].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  const paginatedWorkbodies = sortedWorkbodies.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(sortedWorkbodies.length / itemsPerPage);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Workbodies</CardTitle>
        <Button 
          variant="outline" 
          className="text-pec-green border-pec-green hover:bg-pec-green/10"
        >
          Export List
        </Button>
      </CardHeader>
      <CardContent>
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Members</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedWorkbodies.map(workbody => (
                <TableRow key={workbody.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{workbody.name}</TableCell>
                  <TableCell>{formatWorkbodyType(workbody.type)}</TableCell>
                  <TableCell>{new Date(workbody.createdDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{workbody.members.length}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() => window.location.href = `/workbodies/${workbody.id}`}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
