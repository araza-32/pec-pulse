
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
        <DialogContent className="max-w-3xl max-h-[90vh] w-[90vw] md:w-auto">
          <DialogHeader>
            <DialogTitle className="text-left">Workbodies Overview</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Type</TableHead>
                  <TableHead className="text-left">Created Date</TableHead>
                  <TableHead className="text-right">Members</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...workbodies]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(workbody => (
                    <TableRow key={workbody.id}>
                      <TableCell className="font-medium text-left">{workbody.name}</TableCell>
                      <TableCell className="text-left">{formatWorkbodyType(workbody.type)}</TableCell>
                      <TableCell className="text-left">{new Date(workbody.createdDate).toLocaleDateString()}</TableCell>
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
        <DialogContent className="max-w-3xl max-h-[90vh] w-[90vw] md:w-auto">
          <DialogHeader>
            <DialogTitle className="text-left">Meetings This Year</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Workbody</TableHead>
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
                      <TableCell className="font-medium text-left">{workbody.name}</TableCell>
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
