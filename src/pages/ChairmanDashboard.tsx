
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChairmanStatCards } from "@/components/chairman/ChairmanStatCards";
import { WorkbodyDistributionChart } from "@/components/chairman/WorkbodyDistributionChart";
import { ChairmanUpcomingMeetings } from "@/components/chairman/ChairmanUpcomingMeetings";
import { MonthlyMeetingsChart } from "@/components/chairman/MonthlyMeetingsChart";
import { ActionCompletionChart } from "@/components/chairman/ActionCompletionChart";
import { WorkbodiesOverview } from "@/components/chairman-dashboard/WorkbodiesOverview";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useScheduledMeetings } from "@/hooks/useScheduledMeetings";

export default function ChairmanDashboard() {
  const { workbodies, isLoading: isLoadingWorkbodies } = useWorkbodies();
  const { meetings } = useScheduledMeetings();
  const [typeDistribution, setTypeDistribution] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<"month" | "quarter" | "year">("month");
  const currentYear = new Date().getFullYear();
  
  // Monthly meetings data
  const [monthlyMeetingsData, setMonthlyMeetingsData] = useState<{ month: string; meetings: number }[]>([]);

  useEffect(() => {
    if (workbodies.length > 0) {
      const committees = workbodies.filter(wb => wb.type === "committee").length;
      const workingGroups = workbodies.filter(wb => wb.type === "working-group").length;
      const taskForces = workbodies.filter(wb => wb.type === "task-force").length;
      
      setTypeDistribution([
        { name: "Committees", value: committees },
        { name: "Working Groups", value: workingGroups },
        { name: "Task Forces", value: taskForces }
      ]);
      
      // Generate monthly meetings data based on the meetings
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthCounts = new Array(12).fill(0);
      
      meetings.forEach(meeting => {
        try {
          const date = new Date(meeting.date);
          if (date.getFullYear() === currentYear) {
            monthCounts[date.getMonth()]++;
          }
        } catch (e) {
          console.error("Error parsing meeting date:", e);
        }
      });
      
      setMonthlyMeetingsData(monthNames.map((month, index) => ({
        month,
        meetings: monthCounts[index]
      })));
    }
  }, [workbodies, meetings, currentYear]);

  // Generate workbody abbreviations
  const workbodiesWithAbbr = workbodies.map(wb => {
    // Extract abbreviation from name if available in parentheses
    const match = wb.name.match(/\(([^)]+)\)$/);
    let abbr = "";
    
    if (match && match[1]) {
      // Use abbreviation found in parentheses
      abbr = match[1];
    } else {
      // Create abbreviation from first letters of words
      abbr = wb.name.split(' ')
        .filter(word => word.length > 0)
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 3);
    }
    
    return { ...wb, abbreviation: abbr };
  });
  
  // Calculate action completion metrics
  const totalActionsAgreed = workbodies.reduce((sum, wb) => sum + (wb.actionsAgreed || 0), 0);
  const totalActionsCompleted = workbodies.reduce((sum, wb) => sum + (wb.actionsCompleted || 0), 0);
  const completionRate = totalActionsAgreed > 0 ? Math.round((totalActionsCompleted / totalActionsAgreed) * 100) : 0;
  
  // Get upcoming meetings
  const upcomingMeetings = meetings.filter(m => new Date(m.date) >= new Date());

  return (
    <div className="space-y-6 animate-in">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Pakistan Engineering Council</h1>
        <p className="mt-2 text-indigo-100">
          Chairman's Executive Dashboard - Comprehensive overview of all workbodies and their activities
        </p>
      </div>

      <ChairmanStatCards 
        totalWorkbodies={workbodies.length}
        committees={typeDistribution[0]?.value || 0}
        workingGroups={typeDistribution[1]?.value || 0}
        taskForces={typeDistribution[2]?.value || 0}
        meetingsThisYear={meetings.length}
        completionRate={completionRate}
        upcomingMeetingsCount={upcomingMeetings.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="colorful-card blue shadow-md">
          <CardContent className="pt-6">
            <WorkbodyDistributionChart typeDistribution={typeDistribution} />
          </CardContent>
        </Card>

        <Card className="colorful-card purple shadow-md">
          <CardContent className="pt-6">
            <MonthlyMeetingsChart 
              monthlyMeetings={monthlyMeetingsData}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              currentYear={currentYear}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="colorful-card green shadow-md h-full">
            <CardContent className="p-0">
              <ActionCompletionChart
                completed={totalActionsCompleted}
                total={totalActionsAgreed}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="colorful-card amber shadow-md h-full">
            <CardContent className="p-0">
              <ChairmanUpcomingMeetings upcomingMeetings={upcomingMeetings} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <WorkbodiesOverview workbodies={workbodies} isLoading={isLoadingWorkbodies} />
      </div>

      <style jsx>{`
        .colorful-card {
          position: relative;
          overflow: hidden;
        }
        
        .colorful-card.blue::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #3B82F6, #10B981);
        }
        
        .colorful-card.purple::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #8B5CF6, #EC4899);
        }
        
        .colorful-card.green::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #10B981, #3B82F6);
        }
        
        .colorful-card.amber::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, #F59E0B, #EF4444);
        }
        
        .animate-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
