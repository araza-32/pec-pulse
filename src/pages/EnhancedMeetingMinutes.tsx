
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnhancedMinutesCard } from "@/components/minutes/EnhancedMinutesCard";
import { EnhancedSummaryDisplay } from "@/components/ai/EnhancedSummaryDisplay";
import { supabase } from "@/integrations/supabase/client";
import { Search, Calendar, Upload, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMinutesSummaries } from "@/hooks/useMinutesSummaries";

interface MeetingMinute {
  id: string;
  workbody_id: string;
  date: string;
  location: string;
  agenda_items: string[];
  actions_agreed: string[];
  file_url: string;
  ocr_status?: string;
  ocr_text?: string;
  workbodies?: {
    name: string;
  };
}

export default function EnhancedMeetingMinutes() {
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  const [filteredMinutes, setFilteredMinutes] = useState<MeetingMinute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkbody, setSelectedWorkbody] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSummary, setSelectedSummary] = useState<any>(null);
  const { toast } = useToast();
  const { 
    summaries, 
    isGenerating, 
    generateSummary,
    fetchSummaries 
  } = useMinutesSummaries();

  useEffect(() => {
    fetchMinutes();
    fetchSummaries();
  }, []);

  useEffect(() => {
    filterMinutes();
  }, [minutes, searchTerm, selectedWorkbody, selectedStatus, activeTab]);

  const fetchMinutes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select(`
          *,
          workbodies:workbody_id (
            name
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      const processedMinutes = data?.map(minute => ({
        ...minute,
        workbody_name: minute.workbodies?.name || 'Unknown Workbody',
      })) || [];

      setMinutes(processedMinutes);
    } catch (error) {
      console.error('Error fetching minutes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch meeting minutes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterMinutes = () => {
    let filtered = minutes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(minute => 
        minute.workbody_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        minute.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        minute.agenda_items.some(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by workbody
    if (selectedWorkbody !== "all") {
      filtered = filtered.filter(minute => minute.workbody_name === selectedWorkbody);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      const minuteSummaries = summaries.filter(s => 
        filtered.some(m => m.id === s.meeting_minutes_id)
      );
      
      if (selectedStatus === "summarized") {
        filtered = filtered.filter(minute => 
          summaries.some(s => s.meeting_minutes_id === minute.id)
        );
      } else if (selectedStatus === "pending") {
        filtered = filtered.filter(minute => 
          !summaries.some(s => s.meeting_minutes_id === minute.id)
        );
      } else if (selectedStatus === "ocr-ready") {
        filtered = filtered.filter(minute => 
          minute.ocr_status === 'completed' || minute.ocr_text
        );
      }
    }

    // Filter by tab
    if (activeTab !== "all") {
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

      if (activeTab === "recent") {
        filtered = filtered.filter(minute => new Date(minute.date) >= oneMonthAgo);
      } else if (activeTab === "archive") {
        filtered = filtered.filter(minute => new Date(minute.date) < threeMonthsAgo);
      }
    }

    setFilteredMinutes(filtered);
  };

  const handleViewSummary = async (minuteId: string) => {
    const summary = summaries.find(s => s.meeting_minutes_id === minuteId);
    if (!summary) {
      toast({
        title: "No Summary Found",
        description: "Please generate a summary first",
        variant: "destructive",
      });
      return;
    }

    const meetingInfo = {
      workbodyName: minutes.find(m => m.id === minuteId)?.workbody_name || "Unknown",
      date: minutes.find(m => m.id === minuteId)?.date || "",
      location: minutes.find(m => m.id === minuteId)?.location || "Unknown",
      duration: "Unknown"
    };

    // Transform the summary data to match the expected format
    const transformedSummary = {
      summaryText: summary.summary_text,
      keyPoints: [], // Add if you have this data
      decisions: summary.decisions.map((decision: string) => ({
        decision,
        impact: 'medium' as const
      })),
      actionItems: summary.action_items.map((item: any) => ({
        task: item.task || item,
        assignee: item.owner || item.assignee || "Unassigned",
        dueDate: item.dueDate || "",
        priority: 'medium' as const,
        status: item.status || 'pending' as const
      })),
      followUpItems: [],
      attendanceRate: undefined,
      engagementScore: undefined,
      meetingEfficiency: undefined
    };

    setSelectedSummary({ summary: transformedSummary, meetingInfo });
  };

  const handleGenerateSummary = async (minuteId: string) => {
    const minute = minutes.find(m => m.id === minuteId);
    if (!minute) {
      toast({
        title: "Error",
        description: "Meeting minute not found",
        variant: "destructive",
      });
      return;
    }

    // Check if OCR text is available
    if (!minute.ocr_text || minute.ocr_text.trim() === '') {
      toast({
        title: "OCR Required",
        description: "Please wait for OCR processing to complete before generating summary",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateSummary(minuteId);
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const handleViewDocument = (url: string) => {
    window.open(url, '_blank');
  };

  const uniqueWorkbodies = [...new Set(minutes.map(m => m.workbody_name).filter(Boolean))];
  const summarizedCount = minutes.filter(m => 
    summaries.some(s => s.meeting_minutes_id === m.id)
  ).length;
  const ocrReadyCount = minutes.filter(m => 
    m.ocr_status === 'completed' || m.ocr_text
  ).length;

  if (selectedSummary) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedSummary(null)}
            className="flex items-center gap-2"
          >
            ← Back to Minutes
          </Button>
          <h1 className="text-2xl font-bold">AI Meeting Summary</h1>
        </div>
        
        <EnhancedSummaryDisplay 
          summary={selectedSummary.summary}
          meetingInfo={selectedSummary.meetingInfo}
          onExport={() => toast({ title: "Export feature coming soon!" })}
          onShare={() => toast({ title: "Share feature coming soon!" })}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meeting Minutes</h1>
          <p className="text-gray-600 mt-1">Manage and analyze meeting documents with AI-powered insights</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => window.location.href = '/upload-minutes'}>
          <Upload className="h-4 w-4" />
          Upload Minutes
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{minutes.length}</div>
            <div className="text-sm text-gray-600">Total Minutes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{summarizedCount}</div>
            <div className="text-sm text-gray-600">AI Summarized</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{ocrReadyCount}</div>
            <div className="text-sm text-gray-600">OCR Processed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {minutes.filter(m => {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return new Date(m.date) >= monthAgo;
              }).length}
            </div>
            <div className="text-sm text-gray-600">This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search minutes by workbody, location, or agenda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedWorkbody} onValueChange={setSelectedWorkbody}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Workbodies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workbodies</SelectItem>
                {uniqueWorkbodies.map(workbody => (
                  <SelectItem key={workbody} value={workbody}>
                    {workbody}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="summarized">Summarized</SelectItem>
                <SelectItem value="pending">Pending Summary</SelectItem>
                <SelectItem value="ocr-ready">OCR Ready</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Minutes</TabsTrigger>
          <TabsTrigger value="recent">Recent (1 Month)</TabsTrigger>
          <TabsTrigger value="archive">Archive (3+ Months)</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading meeting minutes...</p>
            </div>
          ) : filteredMinutes.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No minutes found</h3>
              <p className="text-gray-600">Try adjusting your filters or upload new meeting minutes.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredMinutes.map((minute) => {
                const hasSummary = summaries.some(s => s.meeting_minutes_id === minute.id);
                const canGenerateSummary = minute.ocr_text && minute.ocr_text.trim() !== '';
                
                return (
                  <EnhancedMinutesCard
                    key={minute.id}
                    minutes={{
                      id: minute.id,
                      workbody_name: minute.workbody_name || 'Unknown',
                      date: minute.date,
                      location: minute.location,
                      agenda_items: minute.agenda_items,
                      actions_agreed: minute.actions_agreed,
                      file_url: minute.file_url,
                      has_summary: hasSummary,
                      ocr_status: canGenerateSummary ? 'completed' : 'pending'
                    }}
                    onViewSummary={handleViewSummary}
                    onGenerateSummary={handleGenerateSummary}
                    onViewDocument={handleViewDocument}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
