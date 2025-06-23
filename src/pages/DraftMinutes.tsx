
import { DraftMinutesTab } from "@/components/secretary/DraftMinutesTab";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function DraftMinutes() {
  const { user } = useAuth();
  
  // Allow access for admin, secretary, and coordination roles
  const hasAccess = user?.role === 'admin' || 
                   user?.role === 'secretary' || 
                   user?.role === 'coordination';
  
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <DraftMinutesTab />;
}
