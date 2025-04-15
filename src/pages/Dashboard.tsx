
import { 
  Users, 
  FileCheck, 
  CalendarClock, 
  CheckSquare,
  BookOpen,
  FileSpreadsheet,
  GitMerge 
} from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { WorkbodyProgressChart } from "@/components/dashboard/WorkbodyProgressChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { workbodies, getWorkbodyStats } from "@/data/mockData";

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  
  const stats = getWorkbodyStats();
  
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
                      <p className="font-bold">{stats.completedActions} / {stats.totalActions}</p>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-pec-green"
                        style={{ width: `${(stats.completedActions / stats.totalActions) * 100}%` }}
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
