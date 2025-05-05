
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function AppSettings() {
  const { toast } = useToast();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [autosaveDrafts, setAutosaveDrafts] = useState(true);
  const [theme, setTheme] = useState("light");
  const [refreshInterval, setRefreshInterval] = useState("5");
  const [dateFormat, setDateFormat] = useState("default");

  const handleSettingChange = (setting: string, value: boolean | string) => {
    // In a real app, this would save to backend/localStorage
    toast({
      title: "Setting updated",
      description: `${setting} has been ${typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : 'changed'}`
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
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
                Automatically refresh data every {refreshInterval} minutes
              </p>
            </div>
            <Switch 
              id="auto-refresh" 
              checked={autoRefresh}
              onCheckedChange={(checked) => {
                setAutoRefresh(checked);
                handleSettingChange("Auto refresh", checked);
              }} 
            />
          </div>

          {autoRefresh && (
            <div className="ml-6 mb-4">
              <Label htmlFor="refresh-interval" className="mb-2 block">Refresh Interval (minutes)</Label>
              <Select 
                value={refreshInterval} 
                onValueChange={(value) => {
                  setRefreshInterval(value);
                  handleSettingChange("Refresh interval", value + " minutes");
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications about new meetings and updates
              </p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={emailNotifications}
              onCheckedChange={(checked) => {
                setEmailNotifications(checked);
                handleSettingChange("Email notifications", checked);
              }} 
            />
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-select">Theme</Label>
              <p className="text-sm text-muted-foreground">
                Choose the application theme
              </p>
            </div>
            <Select
              value={theme}
              onValueChange={(value) => {
                setTheme(value);
                handleSettingChange("Theme", value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System default</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="date-format">Date Format</Label>
              <p className="text-sm text-muted-foreground">
                Choose how dates are displayed throughout the application
              </p>
            </div>
            <Select
              value={dateFormat}
              onValueChange={(value) => {
                setDateFormat(value);
                handleSettingChange("Date format", value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">May 5, 2025</SelectItem>
                <SelectItem value="short">05/05/2025</SelectItem>
                <SelectItem value="iso">2025-05-05</SelectItem>
                <SelectItem value="long">Monday, May 5, 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-view">Compact View</Label>
              <p className="text-sm text-muted-foreground">
                Use less space in lists and tables
              </p>
            </div>
            <Switch 
              id="compact-view" 
              checked={compactView}
              onCheckedChange={(checked) => {
                setCompactView(checked);
                handleSettingChange("Compact view", checked);
              }} 
            />
          </div>

          <Separator />

          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="save-drafts">Auto-save Drafts</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save your work as drafts
              </p>
            </div>
            <Switch 
              id="save-drafts" 
              checked={autosaveDrafts} 
              onCheckedChange={(checked) => {
                setAutosaveDrafts(checked);
                handleSettingChange("Auto-save drafts", checked);
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
