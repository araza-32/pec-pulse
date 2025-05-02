
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type definition for meeting minutes
interface MeetingMinute {
  id: string;
  workbody_id: string;
  workbody_name: string;
  date: string;
  location: string;
  file_url: string;
  agenda_items: string[];
}

export default function MeetingsList() {
  const [meetings, setMeetings] = useState<MeetingMinute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { session } = useAuth();
  const currentYear = new Date().getFullYear();
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    fetchMeetings();
  }, [activeTab]);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      
      // Create date range based on the active tab
      let startDate, endDate;
      if (activeTab === "current") {
        startDate = `${currentYear}-01-01`;
        endDate = `${currentYear}-12-31`;
      } else {
        // All meetings
        startDate = "1900-01-01"; // Far past
        endDate = "2100-12-31"; // Far future
      }
      
      // Query the meeting_minutes table with date filter
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select('*, workbodies(name)')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Format the data 
      const formattedMeetings = data.map(item => ({
        id: item.id,
        workbody_id: item.workbody_id,
        workbody_name: item.workbodies?.name || "Unknown Workbody",
        date: item.date,
        location: item.location,
        file_url: item.file_url,
        agenda_items: item.agenda_items || []
      }));
      
      setMeetings(formattedMeetings);
      console.info('Fetched meetings:', formattedMeetings?.length);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has access to see all meetings
  const hasFullAccess = session?.role === 'admin' || 
                        session?.role === 'chairman' || 
                        session?.role === 'registrar' || 
                        (session?.email && session.email.includes('coordination'));

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = searchTerm === "" || 
      (meeting.workbody_name && meeting.workbody_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (meeting.location && meeting.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!hasFullAccess) {
      // If not admin/chairman/registrar/coordination, only show meetings for their workbody
      return matchesSearch && meeting.workbody_id === session?.workbodyId;
    }
    
    return matchesSearch;
  });

  const handleViewDetails = (meetingId: string, workbodyId: string) => {
    navigate(`/minutes/${meetingId}?workbodyId=${workbodyId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Meeting Minutes</CardTitle>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Input
              placeholder="Search meetings..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {hasFullAccess && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList>
                  <TabsTrigger value="current">
                    <Calendar className="mr-2 h-4 w-4" />
                    Current Year ({currentYear})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    <FileText className="mr-2 h-4 w-4" />
                    All Meetings
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting Date</TableHead>
                  <TableHead>Workbody</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Agenda Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.length > 0 ? (
                  filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>
                        {meeting.date ? format(new Date(meeting.date), "MMMM d, yyyy") : "Unknown"}
                      </TableCell>
                      <TableCell>{meeting.workbody_name}</TableCell>
                      <TableCell>{meeting.location}</TableCell>
                      <TableCell>
                        {meeting.agenda_items && meeting.agenda_items.length > 0 
                          ? meeting.agenda_items.slice(0, 2).join(', ') + 
                            (meeting.agenda_items.length > 2 ? '...' : '')
                          : "No agenda items"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(meeting.id, meeting.workbody_id || '')}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      {searchTerm 
                        ? "No meetings found matching your search." 
                        : activeTab === "current" 
                          ? `No meeting minutes found for ${currentYear}.` 
                          : "No meeting minutes found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
