import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { useWorkbodies } from "@/hooks/useWorkbodies";
import { useToast } from "@/hooks/use-toast";

// Helper function for CSV generation
const generateCSV = (data: any[], headers: string[]) => {
  const headerRow = headers.join(',');
  const dataRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
};

// Helper function to download a file
const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState("generate");
  const [workbodyType, setWorkbodyType] = useState("");
  const [selectedWorkbody, setSelectedWorkbody] = useState("");
  const [reportType, setReportType] = useState("");
  const [reportFormat, setReportFormat] = useState("");
  const [reportHistory, setReportHistory] = useState<Array<{
    id: string;
    name: string;
    type: string;
    format: string;
    date: Date;
    workbodyType: string;
    workbodyName?: string;
  }>>([]);
  
  const { workbodies = [], isLoading } = useWorkbodies();
  const { toast } = useToast();
  
  // Filter workbodies by selected type
  const filteredWorkbodies = useMemo(() => {
    if (!workbodyType) return [];
    return workbodies.filter(wb => wb.type === workbodyType);
  }, [workbodies, workbodyType]);

  const handleGenerateReport = () => {
    if (!workbodyType || !reportType || !reportFormat) {
      toast({
        title: "Missing Information",
        description: "Please select all required options to generate the report.",
        variant: "destructive"
      });
      return;
    }

    let reportData = [];
    let filename = "";
    let content = "";
    
    let targetWorkbodies = [];
    
    if (selectedWorkbody) {
      const workbody = workbodies.find(wb => wb.id === selectedWorkbody);
      if (workbody) targetWorkbodies = [workbody];
    } else {
      targetWorkbodies = workbodies.filter(wb => wb.type === workbodyType);
    }
    
    if (targetWorkbodies.length === 0) {
      toast({
        title: "No data available",
        description: "No workbodies match the selected criteria",
        variant: "destructive"
      });
      return;
    }
    
    switch (reportType) {
      case "all":
        reportData = targetWorkbodies.map(wb => ({
          Name: wb.name,
          Type: wb.type,
          'Created Date': new Date(wb.createdDate).toLocaleDateString(),
          'End Date': wb.endDate ? new Date(wb.endDate).toLocaleDateString() : 'N/A',
          'Total Meetings': wb.totalMeetings,
          'Meetings This Year': wb.meetingsThisYear,
          'Actions Agreed': wb.actionsAgreed,
          'Actions Completed': wb.actionsCompleted,
          'Completion Rate': wb.actionsAgreed ? `${Math.round((wb.actionsCompleted / wb.actionsAgreed) * 100)}%` : '0%'
        }));
        filename = `workbodies-report-${new Date().toISOString().split('T')[0]}`;
        break;
        
      case "meetings":
        reportData = targetWorkbodies.map(wb => ({
          'Workbody': wb.name,
          'Type': wb.type,
          'Total Meetings': wb.totalMeetings,
          'Meetings This Year': wb.meetingsThisYear
        }));
        filename = `meetings-report-${new Date().toISOString().split('T')[0]}`;
        break;
        
      case "actions":
        reportData = targetWorkbodies.map(wb => ({
          'Workbody': wb.name,
          'Type': wb.type,
          'Actions Agreed': wb.actionsAgreed,
          'Actions Completed': wb.actionsCompleted,
          'Completion Rate': wb.actionsAgreed ? `${Math.round((wb.actionsCompleted / wb.actionsAgreed) * 100)}%` : '0%'
        }));
        filename = `actions-report-${new Date().toISOString().split('T')[0]}`;
        break;
        
      case "composition":
        reportData = targetWorkbodies.flatMap(wb => 
          wb.members?.map(member => ({
            'Workbody': wb.name,
            'Type': wb.type,
            'Member Name': member.name,
            'Role': member.role,
            'Email': member.email || 'N/A',
            'Phone': member.phone || 'N/A',
            'Has CV': member.hasCV ? 'Yes' : 'No'
          })) || []
        );
        filename = `composition-report-${new Date().toISOString().split('T')[0]}`;
        break;
    }
    
    switch (reportFormat) {
      case "excel":
      case "csv":
        if (reportData.length > 0) {
          const headers = Object.keys(reportData[0]);
          content = generateCSV(reportData, headers);
          downloadFile(
            content, 
            `${filename}.${reportFormat === 'excel' ? 'csv' : 'csv'}`, 
            'text/csv;charset=utf-8;'
          );
        }
        break;
        
      case "pdf":
        toast({
          title: "PDF Export",
          description: "PDF generation is mocked in this demo. In a real application, this would generate a PDF document.",
        });
        return;
    }

    // Add to report history
    const newReport = {
      id: crypto.randomUUID(),
      name: `${reportType}-report-${new Date().toISOString().split('T')[0]}`,
      type: reportType,
      format: reportFormat,
      date: new Date(),
      workbodyType,
      workbodyName: selectedWorkbody ? workbodies.find(wb => wb.id === selectedWorkbody)?.name : undefined
    };
    
    setReportHistory(prev => [newReport, ...prev]);
    
    toast({
      title: "Report Generated",
      description: `Report has been downloaded as ${newReport.name}.${reportFormat}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download reports for PEC workbodies
        </p>
      </div>
      
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="workbody-type">1. Select Workbody Type</Label>
                  <Select value={workbodyType} onValueChange={(value) => {
                    setWorkbodyType(value);
                    setSelectedWorkbody("");
                    setReportType("");
                    setReportFormat("");
                  }}>
                    <SelectTrigger id="workbody-type">
                      <SelectValue placeholder="Select workbody type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="committee">Committees</SelectItem>
                      <SelectItem value="working-group">Working Groups</SelectItem>
                      <SelectItem value="task-force">Task Forces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {workbodyType && (
                  <div className="space-y-2">
                    <Label htmlFor="specific-workbody">2. Select Specific Workbody (Optional)</Label>
                    <Select value={selectedWorkbody} onValueChange={setSelectedWorkbody}>
                      <SelectTrigger id="specific-workbody">
                        <SelectValue placeholder="Select a workbody" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All {workbodyType === 'working-group' ? 'Working Groups' : `${workbodyType}s`}</SelectItem>
                        {filteredWorkbodies.map(wb => (
                          <SelectItem key={wb.id} value={wb.id}>
                            {wb.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {workbodyType && (
                  <div className="space-y-2">
                    <Label htmlFor="report-type">3. Select Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Workbody Data</SelectItem>
                        <SelectItem value="meetings">Meetings Summary</SelectItem>
                        <SelectItem value="actions">Action Status</SelectItem>
                        <SelectItem value="composition">Workbody Composition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {reportType && (
                  <div className="space-y-2">
                    <Label htmlFor="report-format">4. Select Format</Label>
                    <Select value={reportFormat} onValueChange={setReportFormat}>
                      <SelectTrigger id="report-format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="gap-2 bg-pec-green hover:bg-pec-green-600"
                  onClick={handleGenerateReport}
                  disabled={!workbodyType || !reportType || !reportFormat}
                >
                  <Download className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
            </CardHeader>
            <CardContent>
              {reportHistory.length > 0 ? (
                <div className="space-y-4">
                  {reportHistory.map((report) => (
                    <Card key={report.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h3 className="font-medium">
                              {report.workbodyName || `All ${report.workbodyType}s`} - {report.type} Report
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Generated on {report.date.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGenerateReport()}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download Again
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No reports have been generated yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
