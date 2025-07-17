
import { useState, useEffect } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpiringTaskForceAlert } from "@/components/workbody/ExpiringTaskForceAlert";
import { DetailedAnalytics } from "@/components/dashboard/DetailedAnalytics";
import { AIExtractionInterface } from "@/components/dashboard/AIExtractionInterface";
import { DashboardChatbot } from "@/components/dashboard/DashboardChatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Brain, MessageSquare, Settings, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EnhancedDashboard() {
  const { workbodies, isLoading, error: workbodiesError } = useWorkbodies();
  const { meetings, isLoading: isLoadingMeetings, error: meetingsError } = useScheduledMeetings();
  const { session } = useAuth();
  const { toast } = useToast();

  // Add error handling for failed data fetching
  useEffect(() => {
    if (workbodiesError) {
      console.error('Workbodies error:', workbodiesError);
      toast({
        title: "Data Loading Error",
        description: "Failed to load workbodies data. Some features may not work properly.",
        variant: "destructive",
      });
    }
    if (meetingsError) {
      console.error('Meetings error:', meetingsError);
      toast({
        title: "Meetings Loading Error", 
        description: "Failed to load meetings data.",
        variant: "destructive",
      });
    }
  }, [workbodiesError, meetingsError, toast]);

  const user = session || JSON.parse(localStorage.getItem('user') || '{}');
  const isCoordinationUser = user?.email?.includes('coordination');
  const shouldShowAllWorkbodies = user?.role === 'admin' || isCoordinationUser;
  
  const filteredWorkbodies = shouldShowAllWorkbodies
    ? workbodies
    : workbodies.filter(w => w.id === user.workbodyId);

  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const expiringTaskForces = workbodies
    .filter(wb => 
      wb.type === 'task-force' && 
      wb.endDate && 
      new Date(wb.endDate) >= today && 
      new Date(wb.endDate) <= thirtyDaysFromNow
    )
    .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime());

  const workbodiesStats = {
    totalWorkbodies: filteredWorkbodies.length,
    committees: filteredWorkbodies.filter(w => w.type === 'committee').length,
    workingGroups: filteredWorkbodies.filter(w => w.type === 'working-group').length,
    taskForces: filteredWorkbodies.filter(w => w.type === 'task-force').length,
    actionsCompleted: filteredWorkbodies.reduce((sum, w) => sum + (w.actionsCompleted || 0), 0),
    actionsAgreed: filteredWorkbodies.reduce((sum, w) => sum + (w.actionsAgreed || 0), 0),
    completionRate: (() => {
      const agreed = filteredWorkbodies.reduce((sum, w) => sum + (w.actionsAgreed || 0), 0);
      const completed = filteredWorkbodies.reduce((sum, w) => sum + (w.actionsCompleted || 0), 0);
      return agreed ? Math.round((completed / agreed) * 100) : 0;
    })(),
    meetingsThisYear: filteredWorkbodies.reduce((sum, w) => sum + (w.meetingsThisYear || 0), 0),
    upcomingMeetingsCount: meetings.length,
    overdueActions: Math.round(filteredWorkbodies.reduce((sum, w) => sum + (w.actionsAgreed || 0), 0) * 0.15)
  };

  if (isLoading || isLoadingMeetings) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  // Show error state if data failed to load
  if (workbodiesError || meetingsError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 p-4 border border-red-200 bg-red-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div>
            <h3 className="font-medium text-red-800">Dashboard Loading Error</h3>
            <p className="text-sm text-red-600">
              Unable to load dashboard data. Please refresh the page or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {expiringTaskForces.length > 0 && (
        <ExpiringTaskForceAlert expiringTaskForces={expiringTaskForces} />
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PEC Pulse Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive workbody management and analytics platform
          </p>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="extraction" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Extraction
          </TabsTrigger>
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Assistant
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <DetailedAnalytics workbodiesStats={workbodiesStats} />
        </TabsContent>

        <TabsContent value="extraction" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <AIExtractionInterface />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Extraction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No extraction history yet.
                      <br />
                      Start your first extraction to see results here.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assistant" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <DashboardChatbot />
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                    Show upcoming meetings
                  </button>
                  <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                    Generate workbody report
                  </button>
                  <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                    View overdue actions
                  </button>
                  <button className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded">
                    Check completion rates
                  </button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Services</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">OCR Processing</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{workbodiesStats.totalWorkbodies}</div>
                    <div className="text-sm text-blue-800">Total Workbodies</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{workbodiesStats.meetingsThisYear}</div>
                    <div className="text-sm text-green-800">Meetings This Year</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{workbodiesStats.actionsAgreed}</div>
                    <div className="text-sm text-purple-800">Total Actions</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{workbodiesStats.completionRate}%</div>
                    <div className="text-sm text-orange-800">Completion Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Last data sync</span>
                    <span className="text-gray-500">2 minutes ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last backup</span>
                    <span className="text-gray-500">1 hour ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last OCR processing</span>
                    <span className="text-gray-500">15 minutes ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last AI summary</span>
                    <span className="text-gray-500">30 minutes ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
