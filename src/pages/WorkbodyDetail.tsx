
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import type { MeetingMinutes } from "@/types";

export default function WorkbodyDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [minutes, setMinutes] = useState<MeetingMinutes[]>([]);
  const [isLoadingMinutes, setIsLoadingMinutes] = useState(false);

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
        <p className="text-muted-foreground">
          The workbody you are looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    );
  }

  const completionPercentage = 
    workbody.actionsAgreed > 0
      ? Math.round((workbody.actionsCompleted / workbody.actionsAgreed) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <WorkbodyHeader 
        name={workbody.name}
        type={workbody.type}
        description={workbody.description}
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
          />
        </TabsContent>

        <TabsContent value="members">
          <WorkbodyMembers
            workbodyId={workbody.id}
            members={workbody.members}
            onMembersUpdate={refetch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
