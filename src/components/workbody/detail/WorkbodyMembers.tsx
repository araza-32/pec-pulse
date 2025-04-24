
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, Image, Users } from "lucide-react";
import { ManualMemberAddition } from "@/components/workbody/ManualMemberAddition";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WorkbodyMembersProps {
  workbodyId: string;
  members: any[];
  onMembersUpdate: () => void;
}

export function WorkbodyMembers({ workbodyId, members, onMembersUpdate }: WorkbodyMembersProps) {
  const [showManualAddition, setShowManualAddition] = useState(false);
  const [hideErrors, setHideErrors] = useState(false);
  const { toast } = useToast();

  const successfulMembers = members.filter(
    member => !member.name.includes("Error") && 
              !member.name.includes("Processing") &&
              !member.role.includes("Error") && 
              !member.role.includes("error")
  );

  const hasImageExtractionIssues = members?.some(
    member => member.name.includes("Image Content") || 
             (member.role && member.role.includes("image") || 
              member.role.includes("Image"))
  );

  const allMembersHaveErrors = members && 
                              members.length > 0 && 
                              successfulMembers.length === 0;

  const handleMembersAdded = () => {
    setShowManualAddition(false);
    setHideErrors(true);
    toast({
      title: "Members Added",
      description: "Members have been successfully added manually."
    });
    onMembersUpdate();
  };

  const handleDismissErrors = () => {
    setHideErrors(true);
    toast({
      title: "Errors Dismissed",
      description: "Error messages have been hidden."
    });
  };

  if (showManualAddition) {
    return (
      <ManualMemberAddition 
        workbodyId={workbodyId} 
        onMembersAdded={handleMembersAdded} 
        onCancel={() => setShowManualAddition(false)}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Workbody Composition</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowManualAddition(true)}
          className="gap-2"
        >
          Add Members Manually
        </Button>
      </CardHeader>
      <CardContent>
        {!hideErrors && allMembersHaveErrors && (
          <Alert 
            variant={hasImageExtractionIssues ? "warning" : "destructive"} 
            className="mb-4 flex items-center justify-between"
          >
            <div className="flex flex-col">
              <AlertTitle>
                {hasImageExtractionIssues 
                  ? "Image Content Requires Manual Entry" 
                  : "Member Extraction Issue"}
              </AlertTitle>
              <AlertDescription>
                {hasImageExtractionIssues ? (
                  <p>The uploaded image requires manual extraction of member information as automated extraction is limited for image files.</p>
                ) : (
                  <p>There was a problem extracting members from the uploaded document.</p>
                )}
              </AlertDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleDismissErrors}
              >
                Dismiss
              </Button>
              <Button 
                size="sm" 
                variant={hasImageExtractionIssues ? "default" : "outline"}
                onClick={() => setShowManualAddition(true)}
              >
                {hasImageExtractionIssues ? (
                  <>
                    <Image className="mr-2 h-4 w-4" />
                    Manual Entry
                  </>
                ) : (
                  "Add Members Manually"
                )}
              </Button>
            </div>
          </Alert>
        )}

        {successfulMembers.length > 0 ? (
          <div className="space-y-4">
            {successfulMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-pec-green text-white">
                      {member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                {member.hasCV && (
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    View CV
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              {allMembersHaveErrors && !hideErrors 
                ? "No valid members found - please add members manually or upload a new document" 
                : "No members available for this workbody"}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button 
                variant="outline"
                onClick={() => window.location.href = `/workbody-management`}
              >
                Upload Members Document
              </Button>
              <Button 
                onClick={() => setShowManualAddition(true)}
              >
                Add Members Manually
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
