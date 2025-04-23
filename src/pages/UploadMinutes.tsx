
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWorkbodies } from "@/hooks/useWorkbodies";

const WORKBODY_TYPES = [
  { value: "committee", label: "Committee" },
  { value: "working-group", label: "Working Group" },
  { value: "task-force", label: "Task Force" }
];

export default function UploadMinutes() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // User role and (optionally) assigned workbodyId from global/user context (custom logic, stubbed here)
  const [userRole] = useState<"admin" | "coordination" | "secretary">(
    (window as any).MOCK_USER_ROLE || "admin"
  );
  const userWorkbodyId = (window as any).MOCK_USER_WORKBODY_ID || null; // secretary's assigned workbody

  const [selectedWorkbodyType, setSelectedWorkbodyType] = useState<string>("");
  const [selectedWorkbody, setSelectedWorkbody] = useState<string>("");

  // Fetch all workbodies from DB
  const { workbodies = [], isLoading } = useWorkbodies();

  // Filtering logic based on user role:
  const availableWorkbodies = useMemo(() => {
    if (userRole === "secretary") {
      // Secretary: only assigned workbody (if assigned)
      return workbodies.filter(wb =>
        wb.id === userWorkbodyId
      );
    } else {
      // Admin and Coordination: all workbodies
      return workbodies;
    }
  }, [workbodies, userRole, userWorkbodyId]);

  // Filter by selected type
  const filteredWorkbodies = selectedWorkbodyType
    ? availableWorkbodies.filter(wb => wb.type === selectedWorkbodyType)
    : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkbodyType) {
      toast({
        title: "Select Workbody Type",
        description: "Please select the type of workbody (Committee, Working Group, or Task Force).",
        variant: "destructive"
      });
      return;
    }
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
                <Label htmlFor="workbody-type-select">Select Workbody Type</Label>
                <select
                  id="workbody-type-select"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={selectedWorkbodyType}
                  onChange={e => {
                    setSelectedWorkbodyType(e.target.value);
                    setSelectedWorkbody(""); // Reset workbody if type changes
                  }}
                  required
                  disabled={isLoading || availableWorkbodies.length === 0}
                >
                  <option value="">Select type...</option>
                  {WORKBODY_TYPES.map(wbt => (
                    <option key={wbt.value} value={wbt.value}>
                      {wbt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workbody-select">Select Workbody</Label>
                <select
                  id="workbody-select"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={selectedWorkbody}
                  onChange={e => setSelectedWorkbody(e.target.value)}
                  required
                  disabled={!selectedWorkbodyType || filteredWorkbodies.length === 0}
                >
                  <option value="">Select...</option>
                  {filteredWorkbodies.map(wb => (
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
