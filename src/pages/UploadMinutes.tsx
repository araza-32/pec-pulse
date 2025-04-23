
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkbodySelection } from "@/components/minutes/WorkbodySelection";
import { MeetingDetailsForm } from "@/components/minutes/MeetingDetailsForm";
import { useMinutesUpload } from "@/hooks/useMinutesUpload";

export default function UploadMinutes() {
  const {
    isUploading,
    selectedFile,
    selectedWorkbodyType,
    selectedWorkbody,
    userRole,
    workbodies,
    isLoading,
    userWorkbodyId,
    handleSubmit,
    handleFileChange,
    setSelectedWorkbodyType,
    setSelectedWorkbody
  } = useMinutesUpload();

  // Filtering logic based on user role
  const availableWorkbodies = useMemo(() => {
    if (userRole === "secretary") {
      return workbodies.filter(wb => wb.id === userWorkbodyId);
    }
    return workbodies;
  }, [workbodies, userRole, userWorkbodyId]);

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
            <WorkbodySelection
              selectedWorkbodyType={selectedWorkbodyType}
              selectedWorkbody={selectedWorkbody}
              onWorkbodyTypeChange={setSelectedWorkbodyType}
              onWorkbodyChange={setSelectedWorkbody}
              availableWorkbodies={availableWorkbodies}
              isLoading={isLoading}
            />
            
            <MeetingDetailsForm
              selectedFile={selectedFile}
              isUploading={isUploading}
              onFileChange={handleFileChange}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
