import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChairmanStatCards } from "@/components/chairman/ChairmanStatCards";
import { EngagementChart } from "@/components/chairman/EngagementChart";
import { ExpiringTaskForceList } from "@/components/chairman/ExpiringTaskForceList";
import { useWorkBodiesQuery } from "@/hooks/useWorkBodiesQuery";
import { WorkbodiesStackedCards } from "@/components/chairman-dashboard/WorkbodiesStackedCards";
import { Modal } from "@/components/ui/modal";
import { DonutChart } from "@/components/chairman/DonutChart";
import { MeetingsList } from "@/components/chairman/MeetingsList";

export default function ChairmanDashboard() {
  const { 
    workbodies,
    isLoading,
    counts,
    filteredWorkbodies,
    setSelectedCategory
  } = useWorkBodiesQuery();

  const [activeTab, setActiveTab] = useState<string>("expiring");
  const [showDonutModal, setShowDonutModal] = useState(false);
  const [showMeetingsModal, setShowMeetingsModal] = useState(false);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);

  // Mock stats data (would come from API in production)
  const meetingStats = {
    totalWorkbodies: counts.committees + counts.workingGroups + counts.taskForces,
    committees: counts.committees,
    workingGroups: counts.workingGroups,
    taskForces: counts.taskForces,
    meetingsThisYear: 24,
    completionRate: 78,
    upcomingMeetingsCount: 5,
    actionsCompleted: 87,
    actionsAgreed: 112,
    overdueActions: 8,
  };

  // Mock engagement data (would come from API in production)
  const mockEngagementData = [
    { month: "Jan", attendance: 78, participation: 65, actionRate: 72 },
    { month: "Feb", attendance: 82, participation: 70, actionRate: 68 },
    { month: "Mar", attendance: 75, participation: 68, actionRate: 70 },
    { month: "Apr", attendance: 85, participation: 75, actionRate: 76 },
    { month: "May", attendance: 87, participation: 78, actionRate: 80 },
    { month: "Jun", attendance: 84, participation: 80, actionRate: 82 },
  ];

  // Mock meetings data
  const upcomingMeetings = [
    { 
      id: "1", 
      date: new Date(2025, 5, 20), 
      workbodyName: "Committee on Professional Development",
      type: "committee"
    },
    { 
      id: "2", 
      date: new Date(2025, 5, 22), 
      workbodyName: "Working Group on Young Engineers Affairs",
      type: "working-group"
    },
    { 
      id: "3", 
      date: new Date(2025, 5, 25), 
      workbodyName: "Task Force on Digital Transformation",
      type: "task-force"
    },
  ];

  // Mock meeting list data
  const pastMeetings = [
    { 
      id: "001",
      date: "2025-04-15",
      workbodyName: "Committee on Professional Development",
      agendaExcerpt: "Review of ongoing CPD programs and planning for upcoming national conference."
    },
    { 
      id: "002",
      date: "2025-04-10",
      workbodyName: "Working Group on Young Engineers Affairs",
      agendaExcerpt: "Discussion on mentorship program expansion and university outreach initiatives."
    },
    { 
      id: "003",
      date: "2025-04-05",
      workbodyName: "Task Force on Digital Transformation",
      agendaExcerpt: "Evaluation of new membership management system implementation progress."
    },
  ];

  // Type distribution for pie chart
  const typeDistribution = [
    { name: "Committees", value: counts.committees, color: "#3B82F6" },
    { name: "Working Groups", value: counts.workingGroups, color: "#10B981" },
    { name: "Task Forces", value: counts.taskForces, color: "#F59E0B" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pec-green to-emerald-700 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">Chairman's Dashboard</h1>
        <p className="text-sm mt-1 opacity-90">
          Comprehensive overview of PEC workbodies, meetings and actions
        </p>
      </div>

      {/* KPI Statistics Cards - Updated to use spread props instead of stats object */}
      <ChairmanStatCards 
        totalWorkbodies={meetingStats.totalWorkbodies}
        committees={meetingStats.committees}
        workingGroups={meetingStats.workingGroups}
        taskForces={meetingStats.taskForces}
        meetingsThisYear={meetingStats.meetingsThisYear}
        completionRate={meetingStats.completionRate}
        upcomingMeetingsCount={meetingStats.upcomingMeetingsCount}
        actionsCompleted={meetingStats.actionsCompleted}
        actionsAgreed={meetingStats.actionsAgreed}
        overdueActions={meetingStats.overdueActions}
        onWorkbodiesClick={() => setShowDonutModal(true)}
        onMeetingsClick={() => setShowMeetingsModal(true)}
        onUpcomingClick={() => setShowUpcomingModal(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Workbodies Overview (using stacked cards) - 8 columns */}
        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle className="text-xl flex justify-between">
              <span>Workbodies Overview</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={activeTab === "all" ? "bg-muted" : ""}
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={activeTab === "committees" ? "bg-muted" : ""}
                  onClick={() => setSelectedCategory("committees")}
                >
                  Committees
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={activeTab === "workingGroups" ? "bg-muted" : ""}
                  onClick={() => setSelectedCategory("workingGroups")}
                >
                  Working Groups
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={activeTab === "taskForces" ? "bg-muted" : ""}
                  onClick={() => setSelectedCategory("taskForces")}
                >
                  Task Forces
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WorkbodiesStackedCards 
              workbodies={filteredWorkbodies}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Right Side: Split Column for Engagement and Task Force */}
        <div className="md:col-span-4 space-y-6">
          {/* Engagement Analysis */}
          <Card className="h-auto">
            <CardHeader>
              <CardTitle>Engagement Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <EngagementChart data={mockEngagementData} />
            </CardContent>
          </Card>

          {/* Task Force Status */}
          <Card className="h-auto">
            <CardHeader>
              <CardTitle>Task Force Status</CardTitle>
              <Tabs defaultValue="expiring" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
                  <TabsTrigger value="ended">Recently Ended</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="expiring" className="mt-0">
                <ExpiringTaskForceList 
                  taskForces={workbodies.filter(wb => 
                    wb.type === 'task-force' && wb.progressPercent < 100
                  )}
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="ended" className="mt-0">
                <ExpiringTaskForceList 
                  taskForces={workbodies.filter(wb => 
                    wb.type === 'task-force' && wb.progressPercent >= 100
                  )}
                  isLoading={isLoading}
                  ended
                />
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal
        title="Workbodies Distribution"
        isOpen={showDonutModal}
        onClose={() => setShowDonutModal(false)}
      >
        <div className="h-[400px]">
          <DonutChart data={typeDistribution} />
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-md">
                <div className="text-xl font-bold text-blue-600">{counts.committees}</div>
                <div className="text-sm text-blue-800">Committees</div>
              </div>
              <div className="p-3 bg-green-50 rounded-md">
                <div className="text-xl font-bold text-green-600">{counts.workingGroups}</div>
                <div className="text-sm text-green-800">Working Groups</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-md">
                <div className="text-xl font-bold text-amber-600">{counts.taskForces}</div>
                <div className="text-sm text-amber-800">Task Forces</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title="Meetings This Year"
        isOpen={showMeetingsModal}
        onClose={() => setShowMeetingsModal(false)}
      >
        <MeetingsList meetings={pastMeetings} />
      </Modal>

      <Modal
        title="Upcoming Meetings"
        isOpen={showUpcomingModal}
        onClose={() => setShowUpcomingModal(false)}
      >
        <MeetingsList meetings={upcomingMeetings.map(m => ({
          id: m.id,
          date: m.date.toISOString().split('T')[0],
          workbodyName: m.workbodyName,
          agendaExcerpt: `Upcoming meeting of ${m.workbodyName}`
        }))} />
      </Modal>
    </div>
  );
}
