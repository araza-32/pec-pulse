
import { DraftMinutesTab } from "@/components/secretary/DraftMinutesTab";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function DraftMinutes() {
  const { user, session } = useAuth();
  
  // Allow access for admin, secretary, and coordination roles
  const hasAccess = user?.role === 'admin' || 
                   user?.role === 'secretary' || 
                   user?.role === 'coordination' ||
                   session?.role === 'admin' ||
                   session?.role === 'secretary' ||
                   session?.role === 'coordination';
  
  // If user is not loaded yet, show loading
  if (!user && !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <DraftMinutesTab />;
}
