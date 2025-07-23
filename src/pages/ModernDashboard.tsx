import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  FileText, 
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart
} from "lucide-react";
import { useState } from "react";

// Mock data - replace with real data
const kpiData = {
  meetingEfficiency: { value: 87, change: 5, trend: "up" },
  documentProcessing: { value: 156, change: 12, trend: "up" },
  memberEngagement: { value: 92, change: 3, trend: "up" },
  actionFollowUp: { value: 74, change: -2, trend: "down" }
};

const recentMeetings = [
  { id: 1, title: "Engineering Ethics Committee", date: "2025-01-23", status: "completed" },
  { id: 2, title: "Technology Review Board", date: "2025-01-24", status: "scheduled" },
  { id: 3, title: "Professional Development Panel", date: "2025-01-25", status: "scheduled" },
];

const actionItems = [
  { id: 1, title: "Review certification standards", workbody: "Ethics Committee", dueDate: "2025-01-30", priority: "high" },
  { id: 2, title: "Update technical guidelines", workbody: "Tech Review", dueDate: "2025-02-01", priority: "medium" },
  { id: 3, title: "Prepare quarterly report", workbody: "Admin Panel", dueDate: "2025-02-05", priority: "low" },
];

export default function ModernDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");

  const KPICard = ({ title, value, unit = "%", change, trend, description }: any) => (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {trend === "up" ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}{unit}
        </div>
        <div className="flex items-center text-xs">
          <span className={`inline-flex items-center ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? "+" : ""}{change}% from last month
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PEC Pulse Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive workbody management and analytics platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            System Online
          </Badge>
          <Button size="sm">Export Report</Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="ai-extraction" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            AI Extraction
          </TabsTrigger>
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Assistant
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Meeting Efficiency"
              value={kpiData.meetingEfficiency.value}
              change={kpiData.meetingEfficiency.change}
              trend={kpiData.meetingEfficiency.trend}
              description="Average meeting completion rate"
            />
            <KPICard
              title="Document Processing"
              value={kpiData.documentProcessing.value}
              unit=""
              change={kpiData.documentProcessing.change}
              trend={kpiData.documentProcessing.trend}
              description="Documents processed this month"
            />
            <KPICard
              title="Member Engagement"
              value={kpiData.memberEngagement.value}
              change={kpiData.memberEngagement.change}
              trend={kpiData.memberEngagement.trend}
              description="Average attendance rate"
            />
            <KPICard
              title="Action Follow-up"
              value={kpiData.actionFollowUp.value}
              change={kpiData.actionFollowUp.change}
              trend={kpiData.actionFollowUp.trend}
              description="Actions completed on time"
            />
          </div>

          {/* Charts and Tables */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Monthly performance metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
                  <p className="text-muted-foreground">Chart visualization area</p>
                </div>
              </CardContent>
            </Card>

            {/* Workbody Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Workbody Distribution</CardTitle>
                <CardDescription>Distribution by type and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Committees</span>
                    <div className="flex items-center gap-2">
                      <Progress value={57} className="w-20" />
                      <span className="text-sm font-medium">57%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Task Forces</span>
                    <div className="flex items-center gap-2">
                      <Progress value={23} className="w-20" />
                      <span className="text-sm font-medium">23%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Working Groups</span>
                    <div className="flex items-center gap-2">
                      <Progress value={20} className="w-20" />
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Meetings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium text-sm">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground">{meeting.date}</p>
                      </div>
                      <Badge variant={meeting.status === "completed" ? "default" : "secondary"}>
                        {meeting.status === "completed" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {meeting.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {actionItems.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.workbody} • Due {action.dueDate}</p>
                      </div>
                      <Badge 
                        variant={action.priority === "high" ? "destructive" : action.priority === "medium" ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {action.priority === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {action.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs content placeholders */}
        <TabsContent value="ai-extraction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Document Extraction</CardTitle>
              <CardDescription>Automated analysis and data extraction from meeting documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/30 rounded-md">
                <p className="text-muted-foreground">AI Extraction interface coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Intelligent assistant for workbody management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/30 rounded-md">
                <p className="text-muted-foreground">AI Assistant interface coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>System health, performance metrics, and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/30 rounded-md">
                <p className="text-muted-foreground">System overview interface coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
