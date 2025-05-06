
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function MeetingsThisYear() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      setIsLoading(true);
      try {
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;
        
        // Fetch meetings for the current year
        const { data, error } = await supabase
          .from('scheduled_meetings')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        setMeetings(data || []);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeetings();
  }, []);
  
  const filteredMeetings = meetings.filter(meeting => 
    meeting.workbody_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Meetings This Year</h1>
          <Input 
            className="w-full md:w-64" 
            placeholder="Search meetings..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {new Date().getFullYear()} Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workbody</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeetings.length > 0 ? (
                      filteredMeetings.map((meeting) => {
                        const meetingDate = new Date(meeting.date);
                        const isPast = meetingDate < new Date();
                        
                        return (
                          <TableRow key={meeting.id}>
                            <TableCell className="font-medium">{meeting.workbody_name}</TableCell>
                            <TableCell className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {format(meetingDate, "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {meeting.time}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {meeting.location}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={isPast ? "outline" : "default"}
                                className={isPast ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}
                              >
                                {isPast ? "Completed" : "Upcoming"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No meetings found for this year.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
