
import { useState, useEffect } from "react";
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
  UserPlus,
  Image,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/dashboard/StatCard";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ManualMemberAddition } from "@/components/workbody/ManualMemberAddition";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MeetingMinutes } from "@/types";
import { Link } from "react-router-dom";

export default function WorkbodyDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showManualAddition, setShowManualAddition] = useState(false);
  const [minutes, setMinutes] = useState<MeetingMinutes[]>([]);
  const [isLoadingMinutes, setIsLoadingMinutes] = useState(false);
  
  // Use the useWorkbodies hook to fetch workbody data
  const { workbodies, isLoading, refetch } = useWorkbodies();
  
  // Find the workbody with the matching ID
  const workbody = workbodies.find((w) => w.id === id);
  
  // Fetch meeting minutes for this workbody
  useEffect(() => {
    const fetchMinutes = async () => {
      if (!id) return;
      
      setIsLoadingMinutes(true);
      try {
        const { data, error } = await supabase
          .from('meeting_minutes')
          .select('*')
          .eq('workbody_id', id);
        
        if (error) {
          console.error("Error fetching meeting minutes:", error);
          throw error;
        }
        
        if (data) {
          console.log("Meeting minutes fetched:", data);
          const formattedMinutes = data.map(item => ({
            id: item.id,
            workbodyId: item.workbody_id,
            date: item.date,
            location: item.location,
            agendaItems: item.agenda_items,
            actionsAgreed: item.actions_agreed,
            documentUrl: item.file_url,
            uploadedAt: item.uploaded_at,
            uploadedBy: item.uploaded_by || ""
          }));
          setMinutes(formattedMinutes);
        }
      } catch (error) {
        console.error("Failed to fetch meeting minutes", error);
        toast({
          title: "Error",
          description: "Failed to fetch meeting minutes",
          variant: "destructive"
        });
      } finally {
        setIsLoadingMinutes(false);
      }
    };
    
    if (id) {
      fetchMinutes();
    }
  }, [id, toast]);

  // State to track if we should hide error alerts
  const [hideErrors, setHideErrors] = useState(false);

  // Reset hideErrors when workbody changes or is refetched
  useEffect(() => {
    setHideErrors(false);
  }, [id, workbody?.members]);

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

  // Get the latest successfully extracted members (non-error members)
  const successfulMembers = workbody.members?.filter(
    member => !member.name.includes("Error") && 
              !member.name.includes("Processing") &&
              !member.role.includes("Error") && 
              !member.role.includes("error")
  ) || [];

  // Check if there are image extraction issues specifically
  const hasImageExtractionIssues = workbody.members?.some(
    member => member.name.includes("Image Content") || 
             (member.role && member.role.includes("image") || 
              member.role.includes("Image"))
  );

  // Check if all members have errors
  const allMembersHaveErrors = workbody.members && 
                              workbody.members.length > 0 && 
                              successfulMembers.length === 0;

  // Check if there are no members
  const hasNoMembers = !workbody.members || workbody.members.length === 0;

  // Handle manual member addition
  const handleMembersAdded = () => {
    setShowManualAddition(false);
    setHideErrors(true);
    toast({
      title: "Members Added",
      description: "Members have been successfully added manually."
    });
    refetch();
  };

  // Handle clearing error alerts
  const handleDismissErrors = () => {
    setHideErrors(true);
    toast({
      title: "Errors Dismissed",
      description: "Error messages have been hidden."
    });
  };

  // Sort minutes by date in descending order
  const sortedMinutes = [...minutes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get the latest meeting from sorted minutes
  const latestMeeting = sortedMinutes.length > 0 ? sortedMinutes[0] : null;

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

          {latestMeeting && (
            <Card>
              <CardHeader>
                <CardTitle>Latest Meeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(latestMeeting.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{latestMeeting.location}</span>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-2 font-medium">Agenda Items</h4>
                    <ul className="space-y-1">
                      {latestMeeting.agendaItems.map((item, index) => (
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
                      {latestMeeting.actionsAgreed.map((action, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-pec-gold" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    <Link to={`/minutes/${latestMeeting.id}`}>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Full Minutes
                      </Button>
                    </Link>
                  </div>
                </div>
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
              {isLoadingMinutes ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : minutes.length > 0 ? (
                <div className="space-y-4">
                  {sortedMinutes.map((meeting) => (
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
                          <Link to={`/minutes/${meeting.id}`}>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              View Minutes
                            </Button>
                          </Link>
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
          {showManualAddition ? (
            <ManualMemberAddition 
              workbodyId={workbody.id} 
              onMembersAdded={handleMembersAdded} 
              onCancel={() => setShowManualAddition(false)}
            />
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Workbody Composition</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowManualAddition(true)}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Members Manually
                </Button>
              </CardHeader>
              <CardContent>
                {!hideErrors && allMembersHaveErrors && (
                  <Alert 
                    variant={hasImageExtractionIssues ? "warning" : "destructive"} 
                    className="mb-4 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>
                        {hasImageExtractionIssues 
                          ? "Image Content Requires Manual Entry" 
                          : "Member Extraction Issue"}
                      </AlertTitle>
                      <AlertDescription>
                        {hasImageExtractionIssues ? (
                          <p>The uploaded image requires manual extraction of member information as automated extraction is limited for image files.</p>
                        ) : (
                          <p>There was a problem extracting members from the uploaded document.</p>
                        )}
                      </AlertDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleDismissErrors}
                      >
                        Dismiss
                      </Button>
                      <Button 
                        size="sm" 
                        variant={hasImageExtractionIssues ? "default" : "outline"}
                        onClick={() => setShowManualAddition(true)}
                      >
                        {hasImageExtractionIssues ? (
                          <>
                            <Image className="mr-2 h-4 w-4" />
                            Manual Entry
                          </>
                        ) : (
                          "Add Members Manually"
                        )}
                      </Button>
                    </div>
                  </Alert>
                )}

                {successfulMembers.length > 0 ? (
                  <div className="space-y-4">
                    {successfulMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-pec-green text-white">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
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
                    <p className="text-muted-foreground">
                      {allMembersHaveErrors && !hideErrors 
                        ? "No valid members found - please add members manually or upload a new document" 
                        : "No members available for this workbody"}
                    </p>
                    <div className="mt-4 flex justify-center gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = `/workbody-management`}
                      >
                        Upload Members Document
                      </Button>
                      <Button 
                        onClick={() => setShowManualAddition(true)}
                      >
                        Add Members Manually
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
