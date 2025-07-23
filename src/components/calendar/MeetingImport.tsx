
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkbodies } from '@/hooks/useWorkbodies';

interface MeetingImportProps {
  onImportMeeting: (meeting: any) => void;
}

export function MeetingImport({ onImportMeeting }: MeetingImportProps) {
  const [importType, setImportType] = useState<'manual' | 'ical' | 'csv'>('manual');
  const [meetingData, setMeetingData] = useState({
    workbodyId: '',
    title: '',
    date: '',
    time: '',
    location: '',
    agenda: ''
  });
  const [fileContent, setFileContent] = useState('');
  const { toast } = useToast();
  const { workbodies } = useWorkbodies();

  const handleManualImport = () => {
    if (!meetingData.workbodyId || !meetingData.title || !meetingData.date || !meetingData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedWorkbody = workbodies.find(w => w.id === meetingData.workbodyId);
    
    const meeting = {
      workbodyId: meetingData.workbodyId,
      workbodyName: selectedWorkbody?.name || meetingData.title,
      date: meetingData.date,
      time: meetingData.time,
      location: meetingData.location,
      agendaItems: meetingData.agenda.split('\n').filter(item => item.trim() !== '')
    };

    onImportMeeting(meeting);
    
    // Reset form
    setMeetingData({
      workbodyId: '',
      title: '',
      date: '',
      time: '',
      location: '',
      agenda: ''
    });

    toast({
      title: "Meeting Added",
      description: "Meeting has been successfully added to your calendar",
    });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      
      // Parse different file formats
      if (importType === 'ical') {
        parseICalContent(content);
      } else if (importType === 'csv') {
        parseCSVContent(content);
      }
    };
    reader.readAsText(file);
  };

  const parseICalContent = (content: string) => {
    // Basic iCal parsing - can be enhanced
    const events = content.split('BEGIN:VEVENT');
    let parsedMeetings = 0;
    
    events.forEach(event => {
      if (event.includes('SUMMARY:')) {
        const summary = event.match(/SUMMARY:(.*)/)?.[1]?.trim();
        const dtstart = event.match(/DTSTART:(.*)/)?.[1]?.trim();
        const location = event.match(/LOCATION:(.*)/)?.[1]?.trim();
        
        if (summary && dtstart) {
          // Convert DTSTART to date/time format
          const date = dtstart.substring(0, 8);
          const time = dtstart.substring(9, 15);
          
          const meeting = {
            workbodyId: workbodies[0]?.id || '',
            workbodyName: summary,
            date: `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`,
            time: `${time.substring(0, 2)}:${time.substring(2, 4)}`,
            location: location || '',
            agendaItems: []
          };
          
          onImportMeeting(meeting);
          parsedMeetings++;
        }
      }
    });

    toast({
      title: "iCal Import Complete",
      description: `${parsedMeetings} meetings imported successfully`,
    });
  };

  const parseCSVContent = (content: string) => {
    const lines = content.split('\n');
    const headers = lines[0].split(',');
    let parsedMeetings = 0;
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= 4) {
        const meeting = {
          workbodyId: workbodies[0]?.id || '',
          workbodyName: values[0]?.trim() || 'Imported Meeting',
          date: values[1]?.trim() || new Date().toISOString().split('T')[0],
          time: values[2]?.trim() || '10:00',
          location: values[3]?.trim() || '',
          agendaItems: values[4] ? values[4].split(';').map(item => item.trim()) : []
        };
        
        onImportMeeting(meeting);
        parsedMeetings++;
      }
    }

    toast({
      title: "CSV Import Complete",
      description: `${parsedMeetings} meetings imported successfully`,
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Import Meetings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="import-type">Import Method</Label>
          <Select value={importType} onValueChange={(value: any) => setImportType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select import method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual Entry</SelectItem>
              <SelectItem value="ical">iCal File (.ics)</SelectItem>
              <SelectItem value="csv">CSV File</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {importType === 'manual' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="workbody">Workbody</Label>
              <Select value={meetingData.workbodyId} onValueChange={(value) => setMeetingData(prev => ({ ...prev, workbodyId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select workbody" />
                </SelectTrigger>
                <SelectContent>
                  {workbodies.map(wb => (
                    <SelectItem key={wb.id} value={wb.id}>{wb.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={meetingData.title}
                onChange={(e) => setMeetingData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter meeting title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={meetingData.date}
                  onChange={(e) => setMeetingData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={meetingData.time}
                  onChange={(e) => setMeetingData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={meetingData.location}
                onChange={(e) => setMeetingData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter meeting location"
              />
            </div>
            
            <div>
              <Label htmlFor="agenda">Agenda Items (one per line)</Label>
              <Textarea
                id="agenda"
                value={meetingData.agenda}
                onChange={(e) => setMeetingData(prev => ({ ...prev, agenda: e.target.value }))}
                placeholder="Enter agenda items, one per line"
                rows={4}
              />
            </div>
            
            <Button onClick={handleManualImport} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Meeting
            </Button>
          </div>
        )}

        {(importType === 'ical' || importType === 'csv') && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">
                Upload {importType === 'ical' ? 'iCal' : 'CSV'} File
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept={importType === 'ical' ? '.ics' : '.csv'}
                onChange={handleFileImport}
                className="cursor-pointer"
              />
            </div>
            
            {importType === 'csv' && (
              <div className="text-sm text-muted-foreground">
                <p>CSV Format: Title, Date (YYYY-MM-DD), Time (HH:MM), Location, Agenda Items (semicolon separated)</p>
                <p>Example: "Committee Meeting, 2024-01-15, 10:00, Room 101, Review budget; Discuss proposals"</p>
              </div>
            )}
            
            <Button className="w-full" disabled={!fileContent}>
              <Upload className="h-4 w-4 mr-2" />
              Import from File
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
