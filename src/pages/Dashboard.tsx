
import { 
  Users, 
  FileCheck, 
  CalendarClock, 
  CheckSquare,
  BookOpen,
  FileSpreadsheet,
  GitMerge 
} from "lucide-react";
import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { WorkbodyProgressChart } from "@/components/dashboard/WorkbodyProgressChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const { workbodies, isLoading } = useWorkbodies();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Filter workbodies based on user role
  const filteredWorkbodies = user?.role === 'secretary' 
    ? workbodies.filter(w => w.id === user.workbodyId)
    : workbodies;
  
  const stats = {
    totalWorkbodies: filteredWorkbodies.length,
    committees: filteredWorkbodies.filter(w => w.type === 'committee').length,
    workingGroups: filteredWorkbodies.filter(w => w.type === 'working-group').length,
    taskForces: filteredWorkbodies.filter(w => w.type === 'task-force').length,
    totalMeetings: filteredWorkbodies.reduce((sum, w) => sum + w.totalMeetings, 0),
    meetingsThisYear: filteredWorkbodies.reduce((sum, w) => sum + w.meetingsThisYear, 0),
    completionRate: filteredWorkbodies.length ? Math.round(
      (filteredWorkbodies.reduce((sum, w) => sum + w.actionsCompleted, 0) / 
       filteredWorkbodies.reduce((sum, w) => sum + w.actionsAgreed, 0)) * 100
    ) : 0
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading workbody statistics...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Secretary view - single workbody dashboard
  if (user?.role === 'secretary') {
    const workbody = filteredWorkbodies[0];
    if (!workbody) {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">No workbody assigned.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{workbody.name}</h1>
          <p className="text-muted-foreground">
            Workbody Overview and Statistics
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Meetings"
            value={workbody.totalMeetings}
            icon={CalendarClock}
            colorClass="bg-pec-gold"
          />
          <StatCard
            title="Meetings This Year"
            value={workbody.meetingsThisYear}
            icon={BookOpen}
            colorClass="bg-blue-500"
          />
          <StatCard
            title="Actions Agreed"
            value={workbody.actionsAgreed}
            icon={FileCheck}
            colorClass="bg-pec-green"
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
            <CardTitle>Actions Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded bg-pec-green p-2 text-white">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p>Actions Completed</p>
                    <p className="font-bold">
                      {workbody.actionsCompleted} / {workbody.actionsAgreed}
                    </p>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-pec-green"
                      style={{ 
                        width: `${workbody.actionsAgreed ? 
                          (workbody.actionsCompleted / workbody.actionsAgreed) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin and Chairman view - full dashboard with all workbodies
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all PEC workbodies and their activities
        </p>
      </div>
      
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="committees">Committees</TabsTrigger>
          <TabsTrigger value="working-groups">Working Groups</TabsTrigger>
          <TabsTrigger value="task-forces">Task Forces</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Workbodies"
              value={stats.totalWorkbodies}
              icon={Users}
              colorClass="bg-pec-green"
            />
            <StatCard
              title="Total Meetings"
              value={stats.totalMeetings}
              icon={CalendarClock}
              colorClass="bg-pec-gold"
            />
            <StatCard
              title="Meetings This Year"
              value={stats.meetingsThisYear}
              icon={BookOpen}
              colorClass="bg-blue-500"
            />
            <StatCard
              title="Action Completion Rate"
              value={`${stats.completionRate}%`}
              icon={FileCheck}
              colorClass="bg-purple-500"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Workbody Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkbodyProgressChart workbodies={workbodies} limit={10} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Workbody Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded bg-pec-green p-2 text-white">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p>Committees</p>
                        <p className="font-bold">{stats.committees}</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-pec-green"
                          style={{ width: `${(stats.committees / stats.totalWorkbodies) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="rounded bg-pec-gold p-2 text-white">
                      <GitMerge className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p>Working Groups</p>
                        <p className="font-bold">{stats.workingGroups}</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-pec-gold"
                          style={{ width: `${(stats.workingGroups / stats.totalWorkbodies) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="rounded bg-blue-500 p-2 text-white">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p>Task Forces</p>
                        <p className="font-bold">{stats.taskForces}</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${(stats.taskForces / stats.totalWorkbodies) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded bg-pec-green p-2 text-white">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p>Actions Completed</p>
                      <p className="font-bold">
                        {workbodies.reduce((sum, w) => sum + w.actionsCompleted, 0)} / 
                        {workbodies.reduce((sum, w) => sum + w.actionsAgreed, 0)}
                      </p>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-pec-green"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="committees">
          <Card>
            <CardHeader>
              <CardTitle>Committees Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkbodyProgressChart 
                workbodies={workbodies.filter(w => w.type === 'committee')} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="working-groups">
          <Card>
            <CardHeader>
              <CardTitle>Working Groups Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkbodyProgressChart 
                workbodies={workbodies.filter(w => w.type === 'working-group')} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="task-forces">
          <Card>
            <CardHeader>
              <CardTitle>Task Forces Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkbodyProgressChart 
                workbodies={workbodies.filter(w => w.type === 'task-force')} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
