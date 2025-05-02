
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function MeetingsList() {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('meeting_minutes').select('*');

      if (error) throw error;
      
      setMeetings(data || []);
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
      meeting.workbody_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!hasFullAccess) {
      // If not admin/chairman/registrar/coordination, only show meetings for their workbody
      return matchesSearch && meeting.workbody_id === session?.workbodyId;
    }
    
    return matchesSearch;
  });

  const handleViewDetails = (meetingId, workbodyId) => {
    navigate(`/minutes/${meetingId}?workbodyId=${workbodyId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Meeting Minutes</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search meetings..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  <TableHead>Meeting Title</TableHead>
                  <TableHead>Workbody</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.length > 0 ? (
                  filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>{meeting.title}</TableCell>
                      <TableCell>{meeting.workbody_name}</TableCell>
                      <TableCell>{new Date(meeting.meeting_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Held
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(meeting.id, meeting.workbody_id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      {searchTerm ? "No meetings found matching your search." : "No meeting minutes found."}
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
