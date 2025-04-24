
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText } from "lucide-react";

interface MinutesData {
  id: string;
  workbody_id: string;
  workbodyName?: string;
  date: string;
  location: string;
  agenda_items: string[];
  actions_agreed: string[];
  file_url: string;
  uploaded_at: string;
}

export default function MinutesViewer() {
  const { id } = useParams<{ id: string }>();
  const [minutes, setMinutes] = useState<MinutesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMinutes = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('meeting_minutes')
          .select('*, workbodies(name)')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setMinutes({
          ...data,
          workbodyName: data.workbodies?.name
        });
      } catch (error: any) {
        console.error("Error fetching minutes:", error);
        toast({
          title: "Error loading minutes",
          description: error.message || "Could not load meeting minutes",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMinutes();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-96" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!minutes) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Minutes Not Found</h1>
        <p>The requested meeting minutes could not be found.</p>
      </div>
    );
  }

  const formattedDate = new Date(minutes.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{minutes.workbodyName} Minutes</h1>
          <p className="text-muted-foreground">Meeting held on {formattedDate}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => window.open(minutes.file_url, '_blank')}
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Date</h3>
              <p>{formattedDate}</p>
            </div>
            <div>
              <h3 className="font-medium">Location</h3>
              <p>{minutes.location}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Agenda Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {minutes.agenda_items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Actions Agreed</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1">
            {minutes.actions_agreed.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Minutes Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4 flex flex-col items-center justify-center">
            <iframe 
              src={`${minutes.file_url}#toolbar=0`} 
              className="w-full h-[500px] border-0"
              title={`Minutes for ${minutes.workbodyName} meeting on ${formattedDate}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
