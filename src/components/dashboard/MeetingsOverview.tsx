
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, PieChart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Meeting {
  id: string;
  date: Date;
  workbodyName: string;
  type: string;
}

interface MeetingsOverviewProps {
  meetings: Meeting[];
  meetingsThisYear: number;
  onViewAllClick?: () => void;
}

export function MeetingsOverview({ 
  meetings, 
  meetingsThisYear,
  onViewAllClick 
}: MeetingsOverviewProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'heatmap'>('upcoming');
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Meetings Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            {meetingsThisYear} meetings this year
          </p>
        </div>
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant={activeTab === 'upcoming' ? "default" : "outline"}
            onClick={() => setActiveTab('upcoming')}
            className="h-8"
          >
            <CalendarIcon className="mr-1 h-4 w-4" />
            List
          </Button>
          <Button 
            size="sm" 
            variant={activeTab === 'heatmap' ? "default" : "outline"}
            onClick={() => setActiveTab('heatmap')}
            className="h-8"
          >
            <PieChart className="mr-1 h-4 w-4" />
            Heatmap
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'upcoming' ? (
          <div className="space-y-4">
            {meetings.length > 0 ? (
              <>
                <div className="space-y-2">
                  {meetings.slice(0, 5).map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center">
                        <div className="mr-4 p-2 bg-primary/10 rounded-md">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{meeting.workbodyName}</p>
                          <p className="text-xs text-muted-foreground">
                            {meeting.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10">
                        {meeting.type}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onViewAllClick}
                >
                  View All Meetings
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/40 mb-2" />
                <p>No upcoming meetings</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Meeting heatmap visualization will be displayed here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
