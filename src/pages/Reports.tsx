import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download, Donut } from "lucide-react";
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
  const [reportType, setReportType] = useState("all");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [selectedWorkbodyType, setSelectedWorkbodyType] = useState("all");
  const [selectedWorkbody, setSelectedWorkbody] = useState("");
  const { workbodies = [], isLoading } = useWorkbodies();
  const { toast } = useToast();
  
  // Sort workbodies alphabetically
  const sortedWorkbodies = useMemo(() => {
    return [...workbodies].sort((a, b) => a.name.localeCompare(b.name));
  }, [workbodies]);
  
  // Filter workbodies by type
  const filteredWorkbodies = useMemo(() => {
    if (selectedWorkbodyType === "all") return sortedWorkbodies;
    return sortedWorkbodies.filter(wb => wb.type === selectedWorkbodyType);
  }, [sortedWorkbodies, selectedWorkbodyType]);

  const handleGenerateReport = () => {
    let reportData = [];
    let filename = "";
    let content = "";
    
    let targetWorkbodies = [];
    
    if (selectedWorkbody) {
      const workbody = workbodies.find(wb => wb.id === selectedWorkbody);
      if (workbody) targetWorkbodies = [workbody];
    } else if (selectedWorkbodyType !== "all") {
      targetWorkbodies = workbodies.filter(wb => wb.type === selectedWorkbodyType);
    } else {
      targetWorkbodies = workbodies;
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
    
    toast({
      title: "Report Generated",
      description: `Report has been downloaded as ${filename}.${reportFormat}`,
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
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select defaultValue={reportType} onValueChange={setReportType}>
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
                
                <div className="space-y-2">
                  <Label htmlFor="report-format">Report Format</Label>
                  <Select defaultValue={reportFormat} onValueChange={setReportFormat}>
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
                
                <div className="space-y-2">
                  <Label htmlFor="workbody-type">Workbody Type</Label>
                  <Select defaultValue={selectedWorkbodyType} onValueChange={(value) => {
                    setSelectedWorkbodyType(value);
                    setSelectedWorkbody(""); // Reset selected workbody
                  }}>
                    <SelectTrigger id="workbody-type">
                      <SelectValue placeholder="Select workbody type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="committee">Committees</SelectItem>
                      <SelectItem value="working-group">Working Groups</SelectItem>
                      <SelectItem value="task-force">Task Forces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specific-workbody">Specific Workbody (Optional)</Label>
                  <Select value={selectedWorkbody} onValueChange={setSelectedWorkbody}>
                    <SelectTrigger id="specific-workbody">
                      <SelectValue placeholder="Select a workbody" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Workbodies</SelectItem>
                      {filteredWorkbodies.map(wb => (
                        <SelectItem key={wb.id} value={wb.id}>
                          {wb.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Preview
                </Button>
                <Button 
                  className="gap-2 bg-pec-green hover:bg-pec-green-600"
                  onClick={handleGenerateReport}
                >
                  <Download className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <FileText className="h-8 w-8 text-pec-green" />
                      <h3 className="font-medium">Meeting Summary</h3>
                      <p className="text-sm text-muted-foreground">
                        Summary of all meetings held this year
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => {
                          setReportType("meetings");
                          setReportFormat("excel");
                          setSelectedWorkbodyType("all");
                          setSelectedWorkbody("");
                          handleGenerateReport();
                        }}
                      >
                        Download Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <FileSpreadsheet className="h-8 w-8 text-pec-gold" />
                      <h3 className="font-medium">Action Status</h3>
                      <p className="text-sm text-muted-foreground">
                        Status of all actions agreed upon
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => {
                          setReportType("actions");
                          setReportFormat("excel");
                          setSelectedWorkbodyType("all");
                          setSelectedWorkbody("");
                          handleGenerateReport();
                        }}
                      >
                        Download Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <Donut className="h-8 w-8 text-blue-500" />
                      <h3 className="font-medium">Workbody Composition</h3>
                      <p className="text-sm text-muted-foreground">
                        List of all workbodies and their members
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => {
                          setReportType("composition");
                          setReportFormat("excel");
                          setSelectedWorkbodyType("all");
                          setSelectedWorkbody("");
                          handleGenerateReport();
                        }}
                      >
                        Download Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Previously Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">Quarterly Summary Report</h3>
                        <p className="text-sm text-muted-foreground">Generated on Apr 12, 2024</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setReportType("all");
                        setReportFormat("excel");
                        setSelectedWorkbodyType("all");
                        setSelectedWorkbody("");
                        handleGenerateReport();
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">Action Items Status Report</h3>
                        <p className="text-sm text-muted-foreground">Generated on Apr 10, 2024</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setReportType("actions");
                        setReportFormat("excel");
                        setSelectedWorkbodyType("all");
                        setSelectedWorkbody("");
                        handleGenerateReport();
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
