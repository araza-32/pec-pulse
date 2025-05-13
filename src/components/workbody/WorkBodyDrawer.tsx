
import { useState } from "react";
import { 
  Sheet,
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Edit, Archive } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface WorkbodyMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface WorkbodyMeeting {
  id: string;
  date: string;
  title: string;
  hasMinutes: boolean;
}

interface WorkBodyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  workbody: {
    id: string;
    abbreviation: string;
    name: string;
    mandate?: string;
    termsOfReference?: string;
    members: WorkbodyMember[];
    meetings: WorkbodyMeeting[];
    lastProgressLog?: {
      content: string;
      date: string;
      author: string;
    };
  } | null;
  userRole: string;
}

export function WorkBodyDrawer({
  isOpen,
  onClose,
  workbody,
  userRole
}: WorkBodyDrawerProps) {
  if (!workbody) return null;

  // Check if user has admin privileges
  const canEdit = userRole === "admin" || userRole === "coordinator";
  
  // Get member initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-[460px] overflow-hidden p-0"
        aria-label={`${workbody.abbreviation} details`}
      >
        <SheetHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-2xl font-bold">
              {workbody.abbreviation}
            </SheetTitle>
            <Badge variant="outline" className="font-normal">
              {workbody.name}
            </Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] p-6 pt-0">
          {workbody.mandate && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Mandate</h3>
              <div className="prose prose-sm max-w-none">
                {workbody.mandate}
              </div>
            </div>
          )}

          {workbody.termsOfReference && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Terms of Reference</h3>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                <span>Download ToRs</span>
              </Button>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Composition</h3>
            <div className="flex flex-wrap gap-2">
              {workbody.members.map(member => (
                <div key={member.id} className="flex items-center rounded-full bg-gray-100 px-3 py-1">
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{member.name}</span>
                  <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0 h-4 bg-white">
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Meetings held (last 12 months)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right w-[100px]">Minutes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workbody.meetings.length > 0 ? (
                  workbody.meetings.map(meeting => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">{meeting.date}</TableCell>
                      <TableCell>{meeting.title}</TableCell>
                      <TableCell className="text-right">
                        {meeting.hasMinutes && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download minutes</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                      No meetings recorded
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {workbody.lastProgressLog && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Last progress log</h3>
              <div className="bg-gray-50 rounded-md p-3">
                <div className="prose prose-sm max-w-none">
                  {workbody.lastProgressLog.content}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {workbody.lastProgressLog.date} by {workbody.lastProgressLog.author}
                </div>
              </div>
            </div>
          )}

          {canEdit && (
            <div className="flex gap-3 pt-4">
              <Button className="w-1/2 bg-blue-600 hover:bg-blue-700">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" className="w-1/2 text-gray-600">
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
