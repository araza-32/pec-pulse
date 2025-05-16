
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FilePlus, Search, FolderOpen, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Documents() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Sample documents data
  const documents = [
    { id: '1', title: 'Annual Report 2025', category: 'reports', date: '2025-04-15', type: 'PDF' },
    { id: '2', title: 'Meeting Minutes - March 2025', category: 'minutes', date: '2025-03-20', type: 'DOCX' },
    { id: '3', title: 'Budget Proposal', category: 'finance', date: '2025-02-10', type: 'XLSX' },
    { id: '4', title: 'Strategic Plan 2025-2030', category: 'planning', date: '2025-01-05', type: 'PDF' },
    { id: '5', title: 'Technical Guidelines v2.0', category: 'technical', date: '2024-12-15', type: 'PDF' },
  ];

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeTab === 'all' || doc.category === activeTab)
  );

  const handleUpload = () => {
    toast({
      title: "Upload Feature",
      description: "Document upload functionality will be implemented soon.",
    });
  };

  const handleDownload = (id: string) => {
    toast({
      title: "Download Started",
      description: "Your document would be downloading if this feature was implemented.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage and access all documents in one place.
          </p>
        </div>
        <Button onClick={handleUpload} className="bg-pec-green hover:bg-pec-green-600">
          <FilePlus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="minutes">Minutes</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="finance">Financial</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FolderOpen className="mr-2 h-5 w-5 text-pec-green" />
                {activeTab === 'all' ? 'All Documents' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Documents`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredDocuments.length > 0 ? (
                <div className="grid gap-4">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-pec-green" />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {new Date(doc.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(doc.id)}>
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No documents found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
