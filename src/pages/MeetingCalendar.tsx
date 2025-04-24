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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { ScheduledMeeting } from "@/types";
import { workbodies } from "@/data/mockData";

export default function MeetingCalendar() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledMeeting | null>(null);
  const [newMeeting, setNewMeeting] = useState({
    workbodyId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00",
    location: "",
    agendaItems: "",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMeeting({ ...newMeeting, [name]: value });
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedWorkbody = workbodies.find(wb => wb.id === newMeeting.workbodyId);
    if (!selectedWorkbody) return;
    
    const newMeetingRecord: ScheduledMeeting = {
      id: `meeting-${Date.now()}`,
      workbodyId: newMeeting.workbodyId,
      workbodyName: selectedWorkbody.name,
      date: newMeeting.date,
      time: newMeeting.time,
      location: newMeeting.location,
      agendaItems: newMeeting.agendaItems.split('\n').filter(item => item.trim() !== ''),
    };
    
    setMeetings([...meetings, newMeetingRecord]);
    toast({
      title: "Meeting Scheduled",
      description: `Meeting for ${selectedWorkbody.name} has been scheduled for ${format(
        parseISO(newMeeting.date),
        "MMMM dd, yyyy"
      )} at ${newMeeting.time}.`,
    });
    setIsAddDialogOpen(false);
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
            <div className="space-y-2">
              <Label htmlFor="workbodyId">Workbody</Label>
              <Select
                value={newMeeting.workbodyId || "select-workbody"}
                onValueChange={(value) => handleInputChange({
                  target: { name: "workbodyId", value }
                } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a workbody" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select-workbody" disabled>Select a workbody</SelectItem>
                  {workbodies.map((wb) => (
                    <SelectItem key={wb.id} value={wb.id}>
                      {wb.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newMeeting.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={newMeeting.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Meeting location"
                value={newMeeting.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agendaItems">Agenda Items</Label>
              <Textarea
                id="agendaItems"
                name="agendaItems"
                placeholder="Enter agenda items (one per line)"
                rows={4}
                value={newMeeting.agendaItems}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notificationFile">
                Upload Meeting Notification (Optional)
              </Label>
              <Input id="notificationFile" type="file" />
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
