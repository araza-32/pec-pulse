
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const MOCK_WORKBODIES = [
  { id: "w1", name: "Committee A" },
  { id: "w2", name: "Working Group B" },
  { id: "w3", name: "Task Force C" }
];
const SECRETARY_ASSIGNED_WORKBODIES = [
  { id: "w2", name: "Working Group B" }
];

export default function UploadMinutes() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // For demo, use local storage or context in real app
  const [userRole] = useState<"admin" | "coordination" | "secretary">(
    (window as any).MOCK_USER_ROLE || "admin"
  );
  const [selectedWorkbody, setSelectedWorkbody] = useState<string>("");

  const workbodies =
    userRole === "secretary" ? SECRETARY_ASSIGNED_WORKBODIES : MOCK_WORKBODIES;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkbody) {
      toast({
        title: "Select Workbody",
        description: "Please select a workbody for the minutes upload.",
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(null);
      toast({
        title: "Upload successful",
        description: "Meeting minutes have been uploaded successfully.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Meeting Minutes</h1>
        <p className="text-muted-foreground">Upload minutes from your workbody's meetings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meeting Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workbody-select">Select Workbody</Label>
                <select
                  id="workbody-select"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={selectedWorkbody}
                  onChange={e => setSelectedWorkbody(e.target.value)}
                  required
                >
                  <option value="">Select...</option>
                  {workbodies.map(wb => (
                    <option key={wb.id} value={wb.id}>{wb.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting-date">Meeting Date</Label>
                <Input id="meeting-date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting-location">Meeting Location</Label>
                <Input id="meeting-location" placeholder="e.g., PEC Headquarters, Islamabad" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agenda-items">Agenda Items (one per line)</Label>
              <Textarea
                id="agenda-items"
                placeholder="List the agenda items discussed in the meeting"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actions-agreed">Actions Agreed (one per line)</Label>
              <Textarea
                id="actions-agreed"
                placeholder="List the actions agreed upon in the meeting"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minutes-file">Upload Minutes PDF</Label>
              <div className="mt-1 flex items-center gap-4">
                <Input
                  id="minutes-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                {selectedFile && (
                  <div className="flex items-center rounded-md bg-muted p-2 text-sm">
                    <Check className="mr-2 h-4 w-4 text-pec-green" />
                    {selectedFile.name}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload the official minutes in PDF format (max 10MB)
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-pec-green hover:bg-pec-green-600"
                disabled={isUploading}
              >
                {isUploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Minutes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
