
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Workbody } from "@/types";
import { formatWorkbodyType } from "./WorkbodyTables";
import { useNavigate } from "react-router-dom";

interface DetailDialogsProps {
  activeDialog: string | null;
  setActiveDialog: (dialog: string | null) => void;
  workbodies: Workbody[];
}

export const DetailDialogs = ({ 
  activeDialog, 
  setActiveDialog, 
  workbodies 
}: DetailDialogsProps) => {
  const navigate = useNavigate();
  
  const handleWorkbodyClick = (workbodyId: string) => {
    navigate(`/workbodies/${workbodyId}`);
  };

  return (
    <>
      <Dialog open={activeDialog === 'totalWorkbodies'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Workbodies Overview</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
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
                {[...workbodies]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(workbody => (
                    <TableRow key={workbody.id}>
                      <TableCell className="font-medium">{workbody.name}</TableCell>
                      <TableCell>{formatWorkbodyType(workbody.type)}</TableCell>
                      <TableCell>{new Date(workbody.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{workbody.members.length}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => handleWorkbodyClick(workbody.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'meetingsThisYear'} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Meetings This Year</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workbody</TableHead>
                  <TableHead className="text-right">Meetings This Year</TableHead>
                  <TableHead className="text-right">Total Meetings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...workbodies]
                  .filter(w => w.meetingsThisYear > 0)
                  .sort((a, b) => b.meetingsThisYear - a.meetingsThisYear)
                  .map(workbody => (
                    <TableRow key={workbody.id}>
                      <TableCell className="font-medium">{workbody.name}</TableCell>
                      <TableCell className="text-right">{workbody.meetingsThisYear}</TableCell>
                      <TableCell className="text-right">{workbody.totalMeetings}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => handleWorkbodyClick(workbody.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
