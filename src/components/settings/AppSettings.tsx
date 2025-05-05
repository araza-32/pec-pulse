
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export function AppSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>
          Configure your application preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-refresh">Auto Refresh</Label>
              <p className="text-sm text-muted-foreground">
                Automatically refresh data every 5 minutes
              </p>
            </div>
            <Switch id="auto-refresh" defaultChecked />
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications about new meetings and updates
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-view">Compact View</Label>
              <p className="text-sm text-muted-foreground">
                Use less space in lists and tables
              </p>
            </div>
            <Switch id="compact-view" />
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="save-drafts">Auto-save Drafts</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save your work as drafts
              </p>
            </div>
            <Switch id="save-drafts" defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
