
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkbodyHeader } from "@/components/workbody/detail/WorkbodyHeader";
import { WorkbodyStats } from "@/components/workbody/detail/WorkbodyStats";
import { WorkbodyMembers } from "@/components/workbody/detail/WorkbodyMembers";
import { WorkbodyMeetings } from "@/components/workbody/detail/WorkbodyMeetings";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import type { MeetingMinutes } from "@/types";

export default function WorkbodyDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [minutes, setMinutes] = useState<MeetingMinutes[]>([]);
  const [isLoadingMinutes, setIsLoadingMinutes] = useState(false);
  const { session } = useAuth();
  
  const userRole = session?.role || 'user';

  const { workbodies, isLoading, refetch } = useWorkbodies();
  const workbody = workbodies.find((w) => w.id === id);

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
          const formattedMinutes: MeetingMinutes[] = data.map(item => ({
            id: item.id,
            workbodyId: item.workbody_id,
            workbodyName: workbody?.name || "",
            meetingDate: item.date,
            date: item.date,
            venue: item.location,
            location: item.location,
            attendees: [],
            agenda: item.agenda_items || [],
            agendaItems: item.agenda_items || [],
            minutes: [],
            actionItems: [],
            actionsAgreed: item.actions_agreed || [],
            decisions: [],
            createdAt: item.uploaded_at,
            updatedAt: item.uploaded_at,
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
  }, [id, toast, workbody]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-5 w-full max-w-md mt-2" />
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

  if (!workbody) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 py-12">
        <h2 className="text-2xl font-bold">Workbody not found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          The workbody you are looking for doesn't exist or you don't have access to it.
          Please check the URL or contact your administrator.
        </p>
        <div className="flex gap-4 mt-4">
          <Button asChild variant="outline">
            <Link to="/workbodies" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Workbodies
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const completionPercentage = 
    workbody.actionsAgreed > 0
      ? Math.round((workbody.actionsCompleted / workbody.actionsAgreed) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/workbodies" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workbodies
          </Link>
        </Button>
      </div>

      <WorkbodyHeader 
        name={workbody.name}
        type={workbody.type}
        description={workbody.description}
        code={workbody.code}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <WorkbodyStats
            totalMeetings={workbody.totalMeetings}
            meetingsThisYear={workbody.meetingsThisYear}
            actionsAgreed={workbody.actionsAgreed}
            actionsCompleted={workbody.actionsCompleted}
          />

          <Card>
            <CardContent className="pt-6">
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
        </TabsContent>

        <TabsContent value="meetings">
          <WorkbodyMeetings 
            minutes={minutes}
            isLoadingMinutes={isLoadingMinutes}
            workbodyId={workbody.id}
          />
        </TabsContent>

        <TabsContent value="members">
          <WorkbodyMembers
            workbodyId={workbody.id}
            members={workbody.members}
            userRole={userRole}
            onMembersUpdate={refetch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
