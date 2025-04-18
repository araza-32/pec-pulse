
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Download,
  FileText,
  MapPin,
  Users,
  CheckSquare,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { meetingMinutes } from "@/data/mockData";
import { StatCard } from "@/components/dashboard/StatCard";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function WorkbodyDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Use the useWorkbodies hook to fetch workbody data
  const { workbodies, isLoading } = useWorkbodies();
  
  // Find the workbody with the matching ID
  const workbody = workbodies.find((w) => w.id === id);
  
  // Get meeting minutes for this workbody (still using mock data for now)
  const minutes = meetingMinutes.filter((m) => m.workbodyId === id);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <Skeleton className="h-10 w-96" />
              <Skeleton className="h-5 w-full max-w-md mt-2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  // If workbody not found show error state
  if (!workbody) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 py-12">
        <h2 className="text-2xl font-bold">Workbody not found</h2>
        <p className="text-muted-foreground">
          The workbody you are looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    );
  }

  // Calculate completion percentage
  const completionPercentage = 
    workbody.actionsAgreed > 0
      ? Math.round((workbody.actionsCompleted / workbody.actionsAgreed) * 100)
      : 0;

  // Check if there are members with extraction errors
  const hasExtractionErrors = workbody.members?.some(
    member => member.name.includes("Error") || member.role.includes("Error") || member.role.includes("error")
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{workbody.name}</h1>
              <Badge variant="outline" className="capitalize">
                {workbody.type.replace("-", " ")}
              </Badge>
            </div>
            <p className="text-muted-foreground">{workbody.description || "No description available"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Export Data
            </Button>
            <Button className="gap-2 bg-pec-green hover:bg-pec-green-700">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Meetings"
              value={workbody.totalMeetings}
              icon={Calendar}
              colorClass="bg-blue-500"
            />
            <StatCard
              title="Meetings This Year"
              value={workbody.meetingsThisYear}
              icon={Calendar}
              colorClass="bg-pec-green"
            />
            <StatCard
              title="Actions Agreed"
              value={workbody.actionsAgreed}
              icon={FileText}
              colorClass="bg-pec-gold"
            />
            <StatCard
              title="Actions Completed"
              value={workbody.actionsCompleted}
              icon={CheckSquare}
              colorClass="bg-purple-500"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Action Completion Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p>Progress</p>
                    <p className="font-bold">
                      {workbody.actionsCompleted} / {workbody.actionsAgreed}
                    </p>
                  </div>
                  <div className="mt-1 h-4 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-pec-green text-xs text-white"
                      style={{ width: `${completionPercentage}%` }}
                    >
                      <div className="pl-2 pt-0.5">{completionPercentage}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {minutes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Latest Meeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {minutes
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 1)
                  .map((meeting) => (
                    <div key={meeting.id} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(meeting.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{meeting.location}</span>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="mb-2 font-medium">Agenda Items</h4>
                        <ul className="space-y-1">
                          {meeting.agendaItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-pec-green" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="mb-2 font-medium">Actions Agreed</h4>
                        <ul className="space-y-1">
                          {meeting.actionsAgreed.map((action, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-pec-gold" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Full Minutes
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Minutes</CardTitle>
            </CardHeader>
            <CardContent>
              {minutes.length > 0 ? (
                <div className="space-y-4">
                  {minutes
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((meeting) => (
                      <Card key={meeting.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                              <h3 className="font-semibold">
                                Meeting on{" "}
                                {new Date(meeting.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </h3>
                              <p className="text-sm text-muted-foreground">{meeting.location}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              View Minutes
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <p>No meeting minutes available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workbody Composition</CardTitle>
            </CardHeader>
            <CardContent>
              {hasExtractionErrors && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Member Extraction Issue</AlertTitle>
                  <AlertDescription>
                    There was a problem extracting members from the uploaded document.
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => window.location.href = `/workbody-management`}
                      >
                        Upload New Document
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {workbody.members && workbody.members.length > 0 ? (
                <div className="space-y-4">
                  {workbody.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {member.name.includes("Error") ? (
                            <AvatarFallback className="bg-destructive text-white">
                              ERR
                            </AvatarFallback>
                          ) : (
                            <AvatarFallback className="bg-pec-green text-white">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      {member.hasCV && (
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View CV
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No members available for this workbody</p>
                  <Button 
                    className="mt-4" 
                    variant="outline"
                    onClick={() => window.location.href = `/workbody-management`}
                  >
                    Add Members
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
