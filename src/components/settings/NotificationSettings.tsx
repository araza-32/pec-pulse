
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
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
            
            <RadioGroup defaultValue="all">
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
            <Switch id="meeting-notification" defaultChecked />
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="task-updates">Task Updates</Label>
              <p className="text-sm text-muted-foreground">
                Notify when tasks are completed or updated
              </p>
            </div>
            <Switch id="task-updates" defaultChecked />
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="document-uploads">Document Uploads</Label>
              <p className="text-sm text-muted-foreground">
                Notify when new documents are uploaded
              </p>
            </div>
            <Switch id="document-uploads" defaultChecked />
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders">Meeting Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Send reminders before scheduled meetings
              </p>
            </div>
            <Switch id="reminders" defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
