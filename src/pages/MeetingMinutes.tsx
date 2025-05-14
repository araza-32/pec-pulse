
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { FileText, ArrowLeft, Download, Search, CalendarDays, Upload, Plus } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';

interface MeetingMinute {
  id: string;
  workbody_id: string;
  workbody_name: string;
  date: string;
  location: string;
  file_url: string;
  agenda_items: string[];
  actions_agreed: string[];
}

export default function MeetingMinutes() {
  const { id } = useParams();
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  const [currentMinute, setCurrentMinute] = useState<MeetingMinute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchMinute(id);
    } else {
      fetchAllMinutes();
    }
  }, [id]);

  const fetchMinute = async (minuteId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select('*, workbodies(name)')
        .eq('id', minuteId)
        .single();

      if (error) throw error;
      
      setCurrentMinute({
        id: data.id,
        workbody_id: data.workbody_id,
        workbody_name: data.workbodies?.name || 'Unknown Workbody',
        date: data.date,
        location: data.location,
        file_url: data.file_url,
        agenda_items: data.agenda_items || [],
        actions_agreed: data.actions_agreed || []
      });
      
    } catch (error) {
      console.error('Error fetching minute:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch meeting minute',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllMinutes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select('*, workbodies(name)')
        .order('date', { ascending: false });

      if (error) throw error;
      
      const formattedMinutes = data.map(item => ({
        id: item.id,
        workbody_id: item.workbody_id,
        workbody_name: item.workbodies?.name || 'Unknown Workbody',
        date: item.date,
        location: item.location,
        file_url: item.file_url,
        agenda_items: item.agenda_items || [],
        actions_agreed: item.actions_agreed || []
      }));
      
      setMinutes(formattedMinutes);
    } catch (error) {
      console.error('Error fetching minutes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch meeting minutes',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMinutes = minutes.filter(minute => {
    return searchTerm === "" || 
      (minute.workbody_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (minute.location.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  if (id && currentMinute) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/meetings/list')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Minutes List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>Meeting Minutes: {currentMinute.workbody_name}</div>
              {currentMinute.file_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(currentMinute.file_url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Minutes
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                    <p>{format(new Date(currentMinute.date), "MMMM d, yyyy")}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                    <p>{currentMinute.location}</p>
                  </div>
                </div>

                {currentMinute.agenda_items.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Agenda Items</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {currentMinute.agenda_items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentMinute.actions_agreed.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Actions Agreed</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {currentMinute.actions_agreed.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentMinute.file_url && (
                  <div className="pt-6 border-t">
                    <iframe
                      src={currentMinute.file_url}
                      width="100%"
                      height="600px"
                      title="Meeting Minutes Document"
                      className="border rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Meeting Minutes</h1>
        <p className="mt-2 text-blue-100">
          Browse and review all workbody meeting minutes
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search minutes..."
            className="pl-8 w-[280px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button
          onClick={() => navigate('/upload-minutes')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Minutes
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-md border">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMinutes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No meeting minutes found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm ? "Try a different search term" : "No meeting minutes have been uploaded yet"}
              </p>
              <Button
                onClick={() => navigate('/upload-minutes')}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Your First Minutes
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {filteredMinutes.map((minute) => (
                <div 
                  key={minute.id}
                  className="p-4 flex items-start space-x-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/minutes/${minute.id}`)}
                >
                  <div className="bg-blue-100 rounded-full p-3 text-blue-700">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{minute.workbody_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(minute.date), "MMMM d, yyyy")} • {minute.location}
                    </div>
                    {minute.agenda_items.length > 0 && (
                      <div className="text-sm text-muted-foreground mt-1 truncate">
                        {minute.agenda_items.slice(0, 1).join(", ")}
                        {minute.agenda_items.length > 1 && "..."}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/minutes/${minute.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
