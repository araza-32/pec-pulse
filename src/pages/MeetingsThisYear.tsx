
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, ChevronLeft } from "lucide-react";

interface Meeting {
  id: string;
  workbody_name: string;
  date: string;
  time: string;
  location: string;
}

export default function MeetingsThisYear() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        
        // Get meetings from current year
        const currentYear = new Date().getFullYear();
        const startOfYear = `${currentYear}-01-01`;
        const endOfYear = `${currentYear}-12-31`;
        
        const { data, error } = await supabase
          .from('scheduled_meetings')
          .select('*')
          .gte('date', startOfYear)
          .lte('date', endOfYear)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        setMeetings(data || []);
      } catch (error: any) {
        console.error('Error fetching meetings:', error);
        toast({
          title: "Error",
          description: "Failed to load meetings data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeetings();
  }, [toast]);

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // Return time without seconds (HH:MM format)
    return timeString.substring(0, 5);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Meetings in {new Date().getFullYear()}</h1>
          <Link to="/chairman-dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardContent className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-pec-green" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workbody</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.length > 0 ? (
                    meetings.map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell className="font-medium">{meeting.workbody_name}</TableCell>
                        <TableCell>{format(new Date(meeting.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{formatTime(meeting.time)}</TableCell>
                        <TableCell>{meeting.location}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No meetings found for the current year.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
