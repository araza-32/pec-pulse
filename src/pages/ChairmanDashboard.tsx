
import { useState } from "react";
import { ChairmanStatCards } from "@/components/chairman/ChairmanStatCards";
import { EngagementChart } from "@/components/chairman/EngagementChart";
import { ExpiringTaskForceList } from "@/components/chairman/ExpiringTaskForceList";
import { CategorizedWorkbodiesView } from "@/components/chairman-dashboard/CategorizedWorkbodiesView";
import { AlertsQuickAccess } from "@/components/chairman-dashboard/AlertsQuickAccess";
import { PerformanceMetrics } from "@/components/chairman-dashboard/PerformanceMetrics";
import { Modal } from "@/components/ui/modal";
import { DonutChart } from "@/components/chairman/DonutChart";
import { MeetingsList } from "@/components/chairman/MeetingsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useChairmanDashboard } from "@/hooks/useChairmanDashboard";
import { TimePeriod } from "@/hooks/usePerformanceMetrics";

export default function ChairmanDashboard() {
  const {
    workbodies,
    organizedWorkbodies,
    stats,
    upcomingMeetings,
    isLoading,
    selectedCategory,
    setSelectedCategory
  } = useChairmanDashboard();

  const [showDonutModal, setShowDonutModal] = useState(false);
  const [showMeetingsModal, setShowMeetingsModal] = useState(false);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [performanceTimeFilter, setPerformanceTimeFilter] = useState<TimePeriod>("quarter");

  // Mock engagement data (this would come from analytics in production)
  const mockEngagementData = [
    { month: "Jan", attendance: 78, participation: 65, actionRate: 72 },
    { month: "Feb", attendance: 82, participation: 70, actionRate: 68 },
    { month: "Mar", attendance: 75, participation: 68, actionRate: 70 },
    { month: "Apr", attendance: 85, participation: 75, actionRate: 76 },
    { month: "May", attendance: 87, participation: 78, actionRate: 80 },
    { month: "Jun", attendance: 84, participation: 80, actionRate: 82 },
  ];

  // Convert workbodies for AlertsQuickAccess component
  const convertedWorkbodies = workbodies.map(wb => ({
    ...wb,
    members: wb.members || []
  }));

  // Type distribution for pie chart
  const typeDistribution = [
    { name: "Committees", value: stats.committees, color: "#3B82F6" },
    { name: "Working Groups", value: stats.workingGroups, color: "#10B981" },
    { name: "Task Forces", value: stats.taskForces, color: "#F59E0B" }
  ];

  // Mock past meetings data (would come from meeting_minutes table in production)
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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pec-green to-emerald-700 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">Chairman's Dashboard</h1>
        <p className="text-sm mt-1 opacity-90">
          Comprehensive overview of PEC workbodies, meetings and actions
        </p>
      </div>

      {/* KPI Statistics Cards */}
      <ChairmanStatCards 
        totalWorkbodies={stats.totalWorkbodies}
        committees={stats.committees}
        workingGroups={stats.workingGroups}
        taskForces={stats.taskForces}
        meetingsThisYear={stats.meetingsThisYear}
        completionRate={stats.completionRate}
        upcomingMeetingsCount={stats.upcomingMeetingsCount}
        actionsCompleted={stats.actionsCompleted}
        actionsAgreed={stats.actionsAgreed}
        overdueActions={stats.overdueActions}
        onWorkbodiesClick={() => setShowDonutModal(true)}
        onMeetingsClick={() => setShowMeetingsModal(true)}
        onUpcomingClick={() => setShowUpcomingModal(true)}
      />

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Workbodies Overview - 8 columns */}
            <div className="md:col-span-8">
              <CategorizedWorkbodiesView
                categorizedWorkbodies={organizedWorkbodies.categorized}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                isLoading={isLoading}
              />
            </div>

            {/* Right Side: Split Column for Alerts/Quick Access and Additional Info */}
            <div className="md:col-span-4 space-y-6">
              {/* Alert & Quick Access Card */}
              <AlertsQuickAccess
                workbodies={convertedWorkbodies}
                meetings={upcomingMeetings.map(m => ({
                  id: m.id,
                  workbodyId: workbodies.find(wb => wb.name === m.workbodyName)?.id || '',
                  workbodyName: m.workbodyName,
                  date: m.date.toISOString().split('T')[0],
                  time: "14:00",
                  location: "Conference Room",
                  agendaItems: []
                }))}
                isLoading={isLoading}
              />
              
              {/* Task Force Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Task Force Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="active">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active" className="mt-4">
                      <ExpiringTaskForceList 
                        taskForces={organizedWorkbodies.taskForces.filter(tf => !tf.endDate || new Date(tf.endDate) > new Date())}
                        isLoading={isLoading}
                      />
                    </TabsContent>
                    <TabsContent value="completed" className="mt-4">
                      <ExpiringTaskForceList 
                        taskForces={organizedWorkbodies.taskForces.filter(tf => tf.endDate && new Date(tf.endDate) <= new Date())}
                        isLoading={isLoading}
                        ended
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Engagement Analysis */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Engagement Analysis</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <EngagementChart data={mockEngagementData} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Performance Metrics</h2>
            <div className="flex gap-2">
              <Button 
                variant={performanceTimeFilter === "30days" ? "default" : "outline"}
                size="sm"
                onClick={() => setPerformanceTimeFilter("30days")}
              >
                30 Days
              </Button>
              <Button 
                variant={performanceTimeFilter === "quarter" ? "default" : "outline"}
                size="sm"
                onClick={() => setPerformanceTimeFilter("quarter")}
              >
                Quarter
              </Button>
              <Button 
                variant={performanceTimeFilter === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setPerformanceTimeFilter("year")}
              >
                Year
              </Button>
            </div>
          </div>
          
          <PerformanceMetrics 
            workbodies={workbodies}
            meetings={upcomingMeetings.map(m => ({
              id: m.id,
              workbodyId: workbodies.find(wb => wb.name === m.workbodyName)?.id || '',
              workbodyName: m.workbodyName,
              date: m.date.toISOString().split('T')[0],
              time: "14:00",
              location: "Conference Room",
              agendaItems: []
            }))}
            timeFilter={performanceTimeFilter}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="text-lg font-semibold mb-2">Advanced Analysis</h3>
            <p>Detailed analysis and reporting tools will be available here.</p>
          </div>
        </TabsContent>
      </Tabs>

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
                <div className="text-xl font-bold text-blue-600">{stats.committees}</div>
                <div className="text-sm text-blue-800">Committees</div>
              </div>
              <div className="p-3 bg-green-50 rounded-md">
                <div className="text-xl font-bold text-green-600">{stats.workingGroups}</div>
                <div className="text-sm text-green-800">Working Groups</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-md">
                <div className="text-xl font-bold text-amber-600">{stats.taskForces}</div>
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
