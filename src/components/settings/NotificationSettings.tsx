
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function NotificationSettings() {
  const { toast } = useToast();
  const [notificationLevel, setNotificationLevel] = useState("all");
  const [meetingNotif, setMeetingNotif] = useState(true);
  const [taskNotif, setTaskNotif] = useState(true);
  const [docNotif, setDocNotif] = useState(true);
  const [reminderNotif, setReminderNotif] = useState(true);
  const [reminderTime, setReminderTime] = useState("day");

  const handleNotificationChange = (setting: string, value: boolean | string) => {
    toast({
      title: "Notification setting updated",
      description: `${setting} has been ${typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : 'changed'}`
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Notification Delivery</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose how you want to receive notifications
            </p>
            
            <RadioGroup 
              defaultValue="all" 
              value={notificationLevel}
              onValueChange={(value) => {
                setNotificationLevel(value);
                handleNotificationChange("Notification level", value);
              }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All notifications</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="important" id="important" />
                <Label htmlFor="important">Important only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="meeting-notification">Meeting Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Notify when new meetings are scheduled
              </p>
            </div>
            <Switch 
              id="meeting-notification" 
              checked={meetingNotif}
              onCheckedChange={(checked) => {
                setMeetingNotif(checked);
                handleNotificationChange("Meeting notifications", checked);
              }}
            />
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="task-updates">Task Updates</Label>
              <p className="text-sm text-muted-foreground">
                Notify when tasks are completed or updated
              </p>
            </div>
            <Switch 
              id="task-updates" 
              checked={taskNotif}
              onCheckedChange={(checked) => {
                setTaskNotif(checked);
                handleNotificationChange("Task updates", checked);
              }}
            />
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="document-uploads">Document Uploads</Label>
              <p className="text-sm text-muted-foreground">
                Notify when new documents are uploaded
              </p>
            </div>
            <Switch 
              id="document-uploads" 
              checked={docNotif}
              onCheckedChange={(checked) => {
                setDocNotif(checked);
                handleNotificationChange("Document uploads", checked);
              }}
            />
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders">Meeting Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Send reminders before scheduled meetings
              </p>
            </div>
            <Switch 
              id="reminders" 
              checked={reminderNotif} 
              onCheckedChange={(checked) => {
                setReminderNotif(checked);
                handleNotificationChange("Meeting reminders", checked);
              }}
            />
          </div>

          {reminderNotif && (
            <div className="ml-6 mb-4">
              <Label htmlFor="reminder-time" className="mb-2 block">When to send reminders</Label>
              <Select 
                value={reminderTime} 
                onValueChange={(value) => {
                  setReminderTime(value);
                  handleNotificationChange("Reminder time", value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">1 hour before</SelectItem>
                  <SelectItem value="day">1 day before</SelectItem>
                  <SelectItem value="2days">2 days before</SelectItem>
                  <SelectItem value="week">1 week before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification-channels">Notification Channels</Label>
              <p className="text-sm text-muted-foreground">
                Select how you want to receive notifications
              </p>
            </div>
            <Select defaultValue="both">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Email and In-app</SelectItem>
                <SelectItem value="email">Email only</SelectItem>
                <SelectItem value="app">In-app only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
