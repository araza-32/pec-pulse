import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Clock,
  FileText,
  Users,
} from "lucide-react";
import { format, addMonths, subMonths, isSameDay, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { WorkbodySelection } from "@/components/minutes/WorkbodySelection";
import { ScheduledMeeting } from "@/types";
import { useWorkbodies } from "@/hooks/useWorkbodies";

export default function MeetingCalendar() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);
  const { workbodies, isLoading: isLoadingWorkbodies } = useWorkbodies();

  // State for workbody selection
  const [selectedWorkbodyType, setSelectedWorkbodyType] = useState('');
  const [selectedWorkbodyId, setSelectedWorkbodyId] = useState('');
  
  const [newMeeting, setNewMeeting] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00",
    location: "",
    agendaItems: "",
  });

  const [notificationFile, setNotificationFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: 0, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true });
  }

  const meetingsByDate: { [key: string]: ScheduledMeeting[] } = {};
  meetings.forEach((meeting) => {
    if (!meetingsByDate[meeting.date]) {
      meetingsByDate[meeting.date] = [];
    }
    meetingsByDate[meeting.date].push(meeting);
  });

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const getMeetingsForDate = (day: number) => {
    if (day === 0) return [];
    
    const dateStr = format(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
      "yyyy-MM-dd"
    );
    return meetingsByDate[dateStr] || [];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMeeting({ ...newMeeting, [name]: value });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNotificationFile(e.target.files[0]);
      
      if (formErrors.notificationFile) {
        setFormErrors({ ...formErrors, notificationFile: '' });
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!selectedWorkbodyType) {
      errors.workbodyType = 'Workbody type is required';
    }
    
    if (!selectedWorkbodyId) {
      errors.workbodyId = 'Workbody is required';
    }
    
    if (!newMeeting.date) {
      errors.date = 'Date is required';
    }
    
    if (!newMeeting.time) {
      errors.time = 'Time is required';
    }
    
    if (!newMeeting.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!newMeeting.agendaItems.trim()) {
      errors.agendaItems = 'At least one agenda item is required';
    }
    
    if (!notificationFile) {
      errors.notificationFile = 'Meeting notification is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Validation Failed",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedWorkbody = workbodies.find(wb => wb.id === selectedWorkbodyId);
    if (!selectedWorkbody) {
      toast({
        title: "Invalid Workbody",
        description: "Please select a valid workbody.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Upload notification file to Supabase Storage
      if (notificationFile) {
        // TODO: Add Supabase storage upload logic here
        console.log("Uploading notification file:", notificationFile);
      }
    
      const newMeetingRecord: ScheduledMeeting = {
        id: `meeting-${Date.now()}`,
        workbodyId: selectedWorkbodyId,
        workbodyName: selectedWorkbody.name,
        date: newMeeting.date,
        time: newMeeting.time,
        location: newMeeting.location,
        agendaItems: newMeeting.agendaItems.split('\n').filter(item => item.trim() !== ''),
        notificationFile: notificationFile ? notificationFile.name : undefined
      };
    
      setMeetings([...meetings, newMeetingRecord]);
      toast({
        title: "Meeting Scheduled",
        description: `Meeting for ${selectedWorkbody.name} has been scheduled for ${format(
          parseISO(newMeeting.date),
          "MMMM dd, yyyy"
        )} at ${newMeeting.time}.`,
      });
    
      // Reset form
      setSelectedWorkbodyType('');
      setSelectedWorkbodyId('');
      setNewMeeting({
        date: format(new Date(), "yyyy-MM-dd"),
        time: "10:00",
        location: "",
        agendaItems: "",
      });
      setNotificationFile(null);
      setFormErrors({});
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast({
        title: "Error",
        description: "Failed to schedule the meeting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const viewMeeting = (meeting: ScheduledMeeting) => {
    setSelectedMeeting(meeting);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meeting Calendar</h1>
        <p className="text-muted-foreground">
          View and manage scheduled workbody meetings
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center font-semibold text-xs"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, i) => {
          const dateStr = day.isCurrentMonth
            ? format(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day.day
                ),
                "yyyy-MM-dd"
              )
            : "";

          const isToday =
            day.isCurrentMonth &&
            isSameDay(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day.day
              ),
              new Date()
            );

          const dayMeetings = day.isCurrentMonth
            ? getMeetingsForDate(day.day)
            : [];

          return (
            <div
              key={i}
              className={`border rounded-md min-h-[100px] p-1 ${
                !day.isCurrentMonth
                  ? "bg-gray-50"
                  : isToday
                  ? "bg-blue-50 border-blue-200"
                  : ""
              }`}
            >
              {day.isCurrentMonth && (
                <>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-semibold ${
                        isToday ? "text-blue-600" : ""
                      }`}
                    >
                      {day.day}
                    </span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {dayMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="bg-green-100 px-1.5 py-0.5 rounded text-[11px] cursor-pointer hover:bg-green-200 transition-colors"
                        onClick={() => viewMeeting(meeting)}
                      >
                        <div className="font-medium truncate">
                          {meeting.time} - {meeting.workbodyName}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule a Meeting</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMeeting} className="space-y-4">
            <WorkbodySelection
              selectedWorkbodyType={selectedWorkbodyType}
              selectedWorkbody={selectedWorkbodyId}
              onWorkbodyTypeChange={setSelectedWorkbodyType}
              onWorkbodyChange={setSelectedWorkbodyId}
              availableWorkbodies={workbodies}
              isLoading={isLoadingWorkbodies}
            />
            
            {formErrors.workbodyType && (
              <p className="text-sm font-medium text-destructive mt-1">{formErrors.workbodyType}</p>
            )}
            
            {formErrors.workbodyId && (
              <p className="text-sm font-medium text-destructive mt-1">{formErrors.workbodyId}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date <span className="text-destructive">*</span></Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newMeeting.date}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.date && (
                  <p className="text-sm font-medium text-destructive mt-1">{formErrors.date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time <span className="text-destructive">*</span></Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={newMeeting.time}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.time && (
                  <p className="text-sm font-medium text-destructive mt-1">{formErrors.time}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
              <Input
                id="location"
                name="location"
                placeholder="Meeting location"
                value={newMeeting.location}
                onChange={handleInputChange}
                required
              />
              {formErrors.location && (
                <p className="text-sm font-medium text-destructive mt-1">{formErrors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agendaItems">Agenda Items (one per line) <span className="text-destructive">*</span></Label>
              <Textarea
                id="agendaItems"
                name="agendaItems"
                placeholder="Enter agenda items (one per line)"
                rows={4}
                value={newMeeting.agendaItems}
                onChange={handleInputChange}
                required
              />
              {formErrors.agendaItems && (
                <p className="text-sm font-medium text-destructive mt-1">{formErrors.agendaItems}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notificationFile">
                Upload Meeting Notification <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="notificationFile" 
                type="file" 
                onChange={handleFileChange}
                required
              />
              {formErrors.notificationFile && (
                <p className="text-sm font-medium text-destructive mt-1">{formErrors.notificationFile}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Schedule Meeting</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Meeting Details</DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        {selectedMeeting.workbodyName}
                      </h3>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      <span>
                        {format(parseISO(selectedMeeting.date), "EEEE, MMMM d, yyyy")}
                      </span>
                      <Clock className="ml-3 mr-1 h-4 w-4" />
                      <span>{selectedMeeting.time}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{selectedMeeting.location}</span>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <FileText className="mr-1 h-4 w-4" />
                        Agenda Items
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {selectedMeeting.agendaItems.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {selectedMeeting.notificationFile && (
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <FileText className="mr-1 h-4 w-4" />
                          Attached Notification
                        </h4>
                        <p className="text-sm text-muted-foreground">{selectedMeeting.notificationFile}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
