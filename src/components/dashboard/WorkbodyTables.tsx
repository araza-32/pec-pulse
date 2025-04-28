
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Workbody, WorkbodyType } from "@/types";
import { useNavigate } from "react-router-dom";

interface WorkbodyTablesProps {
  workbodiesWithMostMembers: Workbody[];
  workbodiesWithMostMeetings: Workbody[];
  handleWorkbodyClick: (workbodyId: string) => void;
}

export function formatWorkbodyType(type: WorkbodyType): string {
  switch(type) {
    case 'committee':
      return 'Committee';
    case 'working-group':
      return 'Working Group';
    case 'task-force':
      return 'Task Force';
    default:
      return type;
  }
}

export const WorkbodyTables = ({ 
  workbodiesWithMostMembers,
  workbodiesWithMostMeetings,
  handleWorkbodyClick
}: WorkbodyTablesProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Workbodies with Most Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workbody Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Members</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workbodiesWithMostMembers.map(workbody => (
                  <TableRow 
                    key={workbody.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleWorkbodyClick(workbody.id)}
                  >
                    <TableCell className="font-medium">{workbody.name}</TableCell>
                    <TableCell>{formatWorkbodyType(workbody.type)}</TableCell>
                    <TableCell className="text-right">{workbody.members.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Workbodies with Most Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workbody Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Total Meetings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workbodiesWithMostMeetings.map(workbody => (
                  <TableRow 
                    key={workbody.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleWorkbodyClick(workbody.id)}
                  >
                    <TableCell className="font-medium">{workbody.name}</TableCell>
                    <TableCell>{formatWorkbodyType(workbody.type)}</TableCell>
                    <TableCell className="text-right">{workbody.totalMeetings}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
