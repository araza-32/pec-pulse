
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWorkbodies } from "@/hooks/useWorkbodies";

export const useMinutesUpload = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedWorkbodyType, setSelectedWorkbodyType] = useState<string>("");
  const [selectedWorkbody, setSelectedWorkbody] = useState<string>("");

  // Mock user role - in real app this would come from auth context
  const [userRole] = useState<"admin" | "coordination" | "secretary">(
    (window as any).MOCK_USER_ROLE || "admin"
  );
  const userWorkbodyId = (window as any).MOCK_USER_WORKBODY_ID || null;

  const { workbodies = [], isLoading } = useWorkbodies();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return {
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
  };
};
