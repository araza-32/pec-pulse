
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
    meetingDate,
    setMeetingDate,
    meetingLocation,
    setMeetingLocation,
    agendaItems,
    setAgendaItems,
    actionsAgreed,
    setActionsAgreed,
    userRole,
    workbodies,
    isLoading,
    userWorkbodyId,
    handleSubmit,
    handleFileChange,
    setSelectedWorkbodyType,
    setSelectedWorkbody
  } = useMinutesUpload();

  // Filtering logic based on user role and sorting alphabetically
  const availableWorkbodies = useMemo(() => {
    let filteredWorkbodies = workbodies;
    
    if (userRole === "secretary") {
      filteredWorkbodies = workbodies.filter(wb => wb.id === userWorkbodyId);
    }
    
    // Sort alphabetically by name
    return filteredWorkbodies.sort((a, b) => a.name.localeCompare(b.name));
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
              meetingDate={meetingDate}
              setMeetingDate={setMeetingDate}
              meetingLocation={meetingLocation}
              setMeetingLocation={setMeetingLocation}
              agendaItems={agendaItems}
              setAgendaItems={setAgendaItems}
              actionsAgreed={actionsAgreed}
              setActionsAgreed={setActionsAgreed}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
