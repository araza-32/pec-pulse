import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MinimalLayout } from "@/components/layout/MinimalLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import WorkbodyList from "./pages/WorkbodyList";
import WorkbodyDetail from "./pages/WorkbodyDetail";
import WorkbodyEdit from "./pages/WorkbodyEdit";
import WorkbodyManagement from "./pages/WorkbodyManagement";
import MeetingCalendar from "./pages/MeetingCalendar";
import UploadMinutes from "./pages/UploadMinutes";
import MeetingMinutes from "./pages/MeetingMinutes";
import EnhancedMeetingMinutes from "./pages/EnhancedMeetingMinutes";
import DraftMinutes from "./pages/DraftMinutes";
import MinutesViewer from "./pages/MinutesViewer";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import ChairmanDashboard from "./pages/ChairmanDashboard";
import ChairmanExecutiveDashboard from "./pages/ChairmanExecutiveDashboard";
import WorkbodiesOverview from "./pages/WorkbodiesOverview";
import Documents from "./pages/Documents";
import MeetingsList from "./pages/MeetingsList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/set-password" element={<SetPassword />} />
              
              {/* Protected routes with layout */}
              <Route path="/" element={<MinimalLayout />}>
                <Route path="dashboard" element={<EnhancedDashboard />} />
                <Route path="chairman" element={<ChairmanDashboard />} />
                <Route path="chairman/executive" element={<ChairmanExecutiveDashboard />} />
                
                {/* Workbodies routes */}
                <Route path="workbodies" element={<WorkbodyList />} />
                <Route path="workbodies/overview" element={<WorkbodiesOverview />} />
                <Route path="workbodies/management" element={<WorkbodyManagement />} />
                <Route path="workbodies/:id" element={<WorkbodyDetail />} />
                <Route path="workbodies/:id/edit" element={<WorkbodyEdit />} />
                
                {/* Calendar and meetings */}
                <Route path="calendar" element={<MeetingCalendar />} />
                <Route path="meetings" element={<MeetingsList />} />
                
                {/* Minutes routes */}
                <Route path="minutes" element={<MeetingMinutes />} />
                <Route path="minutes/enhanced" element={<EnhancedMeetingMinutes />} />
                <Route path="minutes/draft" element={<DraftMinutes />} />
                <Route path="minutes/upload" element={<UploadMinutes />} />
                <Route path="minutes/:id" element={<MinutesViewer />} />
                
                {/* Other routes */}
                <Route path="documents" element={<Documents />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                
                {/* Catch all - redirect to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
