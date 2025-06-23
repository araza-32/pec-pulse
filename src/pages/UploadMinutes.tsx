
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkbodySelection } from "@/components/minutes/WorkbodySelection";
import { MeetingDetailsForm } from "@/components/minutes/MeetingDetailsForm";
import { useMinutesUpload } from "@/hooks/useMinutesUpload";
import { FileUp, Calendar, Users } from "lucide-react";

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
    meetingNumber,
    setMeetingNumber,
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
    handleAttendanceChange,
    handleActionItemsChange,
    setSelectedWorkbodyType,
    setSelectedWorkbody,
    previousActions
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

  // Get the current workbody members if a workbody is selected
  const currentWorkbodyMembers = useMemo(() => {
    if (!selectedWorkbody) return [];
    const workbody = workbodies.find(wb => wb.id === selectedWorkbody);
    return workbody ? (workbody.members || []) : [];
  }, [selectedWorkbody, workbodies]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <FileUp className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Upload Meeting Minutes</h1>
            <p className="text-green-100 mt-1">Upload and manage minutes from your workbody's meetings</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Step 1</span>
          </div>
          <p className="text-sm text-gray-600">Select workbody and provide basic meeting details</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <Users className="h-5 w-5" />
            <span className="font-medium">Step 2</span>
          </div>
          <p className="text-sm text-gray-600">Record member attendance and external participants</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <FileUp className="h-5 w-5" />
            <span className="font-medium">Step 3</span>
          </div>
          <p className="text-sm text-gray-600">Track action items and upload the minutes file</p>
        </div>
      </div>

      <Card className="border-green-100">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
          <CardTitle className="text-green-800 flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Meeting Minutes Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
              meetingNumber={meetingNumber}
              setMeetingNumber={setMeetingNumber}
              agendaItems={agendaItems}
              setAgendaItems={setAgendaItems}
              actionsAgreed={actionsAgreed}
              setActionsAgreed={setActionsAgreed}
              workbodyId={selectedWorkbody}
              workbodyMembers={currentWorkbodyMembers}
              onAttendanceChange={handleAttendanceChange}
              onActionItemsChange={handleActionItemsChange}
              previousActions={previousActions}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
