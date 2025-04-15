
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Reports() {
  const [reportType, setReportType] = useState("all");
  
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
                      <SelectItem value="all">All Workbodies</SelectItem>
                      <SelectItem value="committees">Committees Only</SelectItem>
                      <SelectItem value="working-groups">Working Groups Only</SelectItem>
                      <SelectItem value="task-forces">Task Forces Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-format">Report Format</Label>
                  <Select defaultValue="pdf">
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
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Preview
                </Button>
                <Button className="gap-2 bg-pec-green hover:bg-pec-green-600">
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
                      <Button variant="outline" size="sm" className="mt-2">
                        Download PDF
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
                      <Button variant="outline" size="sm" className="mt-2">
                        Download Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <h3 className="font-medium">Workbody Composition</h3>
                      <p className="text-sm text-muted-foreground">
                        List of all workbodies and their members
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Download PDF
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
                    <Button variant="outline" size="sm">
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
                    <Button variant="outline" size="sm">
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
