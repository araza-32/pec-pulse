import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, Save, Download, Printer, Calendar, MapPin, Users, CheckSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface DraftMeeting {
  id: string;
  workbodyName: string;
  meetingNumber: string;
  date: string;
  location: string;
  attendees: Array<{
    name: string;
    acronym: string;
    designation: string;
  }>;
  invitees: Array<{
    name: string;
    acronym: string;
    designation: string;
  }>;
  apologies: string[];
  agendaItems: Array<{
    number: string;
    title: string;
    decision: string;
    subItems?: Array<{
      number: string;
      title: string;
      decision: string;
    }>;
  }>;
  actionItems: Array<{
    item: string;
    whoResponsible: string;
  }>;
  discussionItems: Array<{
    item: string;
    content: string;
  }>;
  distribution: string;
  notesRecordedBy: string;
  nextMeeting: string;
}

export function DraftMinutesTab() {
  const { user } = useAuth();
  const { workbodies } = useWorkbodies();
  const { toast } = useToast();
  
  const [draftMinutes, setDraftMinutes] = useState<DraftMeeting>({
    id: '',
    workbodyName: '',
    meetingNumber: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    location: '',
    attendees: [],
    invitees: [],
    apologies: [],
    agendaItems: [
      {
        number: '1',
        title: 'Apologies',
        decision: 'Action Agreed',
        subItems: []
      },
      {
        number: '2',
        title: 'Observations Received on the Minutes of _____ (Previous) Meeting',
        decision: '',
        subItems: []
      },
      {
        number: '3',
        title: 'Confirmation of the Minutes of _____(Previous) meeting',
        decision: '',
        subItems: []
      },
      {
        number: '4',
        title: 'Implementation of Actions Agreed in ______ (Previous) meeting',
        decision: '',
        subItems: [
          { number: '4.1', title: 'Agenda Item No. 3 (of Previous Meeting):', decision: '' },
          { number: '4.2', title: 'Agenda Item No. 4 (of Previous Meeting):', decision: '' },
          { number: '4.3', title: 'Agenda Item No. 5.1 (of Previous Meeting):', decision: '' }
        ]
      },
      {
        number: '5',
        title: 'Matter arising from previous meetings:',
        decision: '',
        subItems: []
      },
      {
        number: '6',
        title: 'Matters of Discussion',
        decision: '',
        subItems: [
          { number: '6.1', title: 'Agenda Item:', decision: '' },
          { number: '6.2', title: 'Agenda Item:', decision: '' },
          { number: '6.3', title: 'Agenda Item:', decision: '' },
          { number: '6.4', title: 'Agenda Item:', decision: '' },
          { number: '6.5', title: 'Agenda Item:', decision: '' },
          { number: '6.6', title: 'Agenda Item:', decision: '' }
        ]
      },
      {
        number: '7',
        title: 'Any other point with the permission of the Chair',
        decision: '',
        subItems: []
      },
      {
        number: '8',
        title: 'Closing remarks',
        decision: '',
        subItems: []
      }
    ],
    actionItems: [],
    discussionItems: [],
    distribution: 'As above',
    notesRecordedBy: 'Secretary Name',
    nextMeeting: 'To be notified later'
  });

  // Filter workbodies for secretary role
  const availableWorkbodies = user?.role === 'secretary' && user?.workbodyId 
    ? workbodies.filter(wb => wb.id === user.workbodyId)
    : workbodies;

  useEffect(() => {
    if (availableWorkbodies.length > 0 && !draftMinutes.workbodyName) {
      const workbody = availableWorkbodies[0];
      setDraftMinutes(prev => ({
        ...prev,
        workbodyName: workbody.name,
        attendees: (workbody.members || []).map(member => ({
          name: member.name,
          acronym: '', // This could be derived from the organization
          designation: member.role
        }))
      }));
    }
  }, [availableWorkbodies, draftMinutes.workbodyName]);

  const addAgendaItem = () => {
    const newItem = {
      number: (draftMinutes.agendaItems.length + 1).toString(),
      title: '',
      decision: '',
      subItems: []
    };
    setDraftMinutes(prev => ({
      ...prev,
      agendaItems: [...prev.agendaItems, newItem]
    }));
  };

  const updateAgendaItem = (index: number, field: string, value: string) => {
    setDraftMinutes(prev => ({
      ...prev,
      agendaItems: prev.agendaItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addActionItem = () => {
    setDraftMinutes(prev => ({
      ...prev,
      actionItems: [...prev.actionItems, { item: '', whoResponsible: '' }]
    }));
  };

  const updateActionItem = (index: number, field: string, value: string) => {
    setDraftMinutes(prev => ({
      ...prev,
      actionItems: prev.actionItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const saveDraft = () => {
    // Save to localStorage for now
    localStorage.setItem(`draft-minutes-${draftMinutes.workbodyName}`, JSON.stringify(draftMinutes));
    toast({
      title: "Draft Saved",
      description: "Your meeting minutes draft has been saved locally.",
    });
  };

  const generatePDF = () => {
    // This would integrate with a PDF generation library
    toast({
      title: "PDF Generation",
      description: "PDF generation feature will be implemented.",
    });
  };

  const printDraft = () => {
    window.print();
  };

  const hasAccess = user?.role === 'admin' || 
                   user?.role === 'secretary' || 
                   user?.role === 'coordination';

  if (!hasAccess) {
    return (
      <div className="text-center p-8">
        <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-500">Only secretaries, administrators, and coordination staff can access the draft minutes feature.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Draft Meeting Minutes</h1>
          <p className="text-green-600">Create structured meeting minutes using the standard PEC format</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={saveDraft} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={printDraft} variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={generatePDF} className="bg-green-600 hover:bg-green-700" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Meeting Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workbody">Workbody Name</Label>
              <Input
                id="workbody"
                value={draftMinutes.workbodyName}
                onChange={(e) => setDraftMinutes(prev => ({ ...prev, workbodyName: e.target.value }))}
                placeholder="Committee/Working Group Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-number">Meeting Number</Label>
              <Input
                id="meeting-number"
                value={draftMinutes.meetingNumber}
                onChange={(e) => setDraftMinutes(prev => ({ ...prev, meetingNumber: e.target.value }))}
                placeholder="e.g., 01/2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Meeting Date</Label>
              <Input
                id="date"
                type="date"
                value={draftMinutes.date}
                onChange={(e) => setDraftMinutes(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={draftMinutes.location}
                onChange={(e) => setDraftMinutes(prev => ({ ...prev, location: e.target.value }))}
                placeholder="PEC Headquarters, Islamabad"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Attendees
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="font-medium">Name</div>
              <div className="font-medium">Acronym</div>
              <div className="font-medium">Designation</div>
            </div>
            {draftMinutes.attendees.map((attendee, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={attendee.name}
                  onChange={(e) => {
                    const newAttendees = [...draftMinutes.attendees];
                    newAttendees[index].name = e.target.value;
                    setDraftMinutes(prev => ({ ...prev, attendees: newAttendees }));
                  }}
                  placeholder="Full Name"
                />
                <Input
                  value={attendee.acronym}
                  onChange={(e) => {
                    const newAttendees = [...draftMinutes.attendees];
                    newAttendees[index].acronym = e.target.value;
                    setDraftMinutes(prev => ({ ...prev, attendees: newAttendees }));
                  }}
                  placeholder="ORG"
                />
                <Input
                  value={attendee.designation}
                  onChange={(e) => {
                    const newAttendees = [...draftMinutes.attendees];
                    newAttendees[index].designation = e.target.value;
                    setDraftMinutes(prev => ({ ...prev, attendees: newAttendees }));
                  }}
                  placeholder="Designation"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-green-600" />
            Agenda Items
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {draftMinutes.agendaItems.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-4">
                <Badge variant="outline">{item.number}</Badge>
                <div className="flex-1 space-y-2">
                  <Input
                    value={item.title}
                    onChange={(e) => updateAgendaItem(index, 'title', e.target.value)}
                    placeholder="Agenda item title"
                    className="font-medium"
                  />
                  <Textarea
                    value={item.decision}
                    onChange={(e) => updateAgendaItem(index, 'decision', e.target.value)}
                    placeholder="Decision/Action Agreed"
                    rows={2}
                  />
                </div>
              </div>
              
              {item.subItems && item.subItems.length > 0 && (
                <div className="ml-8 space-y-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <div key={subIndex} className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{subItem.number}</Badge>
                      <Input
                        value={subItem.title}
                        onChange={(e) => {
                          const newItems = [...draftMinutes.agendaItems];
                          newItems[index].subItems![subIndex].title = e.target.value;
                          setDraftMinutes(prev => ({ ...prev, agendaItems: newItems }));
                        }}
                        placeholder="Sub-agenda item"
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <Button onClick={addAgendaItem} variant="outline" className="w-full">
            Add Agenda Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-green-50 border-b">
          <CardTitle>Actions Agreed</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {draftMinutes.actionItems.map((action, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                value={action.item}
                onChange={(e) => updateActionItem(index, 'item', e.target.value)}
                placeholder="Action item description"
                rows={2}
              />
              <Input
                value={action.whoResponsible}
                onChange={(e) => updateActionItem(index, 'whoResponsible', e.target.value)}
                placeholder="Who Responsible"
              />
            </div>
          ))}
          
          <Button onClick={addActionItem} variant="outline" className="w-full">
            Add Action Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-green-50 border-b">
          <CardTitle>Meeting Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distribution">Distribution</Label>
              <Input
                id="distribution"
                value={draftMinutes.distribution}
                onChange={(e) => setDraftMinutes(prev => ({ ...prev, distribution: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes-recorded">Notes recorded by</Label>
              <Input
                id="notes-recorded"
                value={draftMinutes.notesRecordedBy}
                onChange={(e) => setDraftMinutes(prev => ({ ...prev, notesRecordedBy: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="next-meeting">Next meeting</Label>
              <Input
                id="next-meeting"
                value={draftMinutes.nextMeeting}
                onChange={(e) => setDraftMinutes(prev => ({ ...prev, nextMeeting: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
