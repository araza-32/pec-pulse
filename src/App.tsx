
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NewLayout } from "@/components/layout/NewLayout";
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
import Dashboard from "./pages/Dashboard";
import CleanDashboard from "./pages/CleanDashboard";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import ChairmanDashboard from "./pages/ChairmanDashboard";
import ChairmanExecutiveDashboard from "./pages/ChairmanExecutiveDashboard";
import WorkbodiesOverview from "./pages/WorkbodiesOverview";
import Documents from "./pages/Documents";
import MeetingsList from "./pages/MeetingsList";
import MeetingsThisYear from "./pages/MeetingsThisYear";
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
              <Route path="/login" element={<Login />} />
              <Route path="/set-password" element={<SetPassword />} />
              
              {/* Main application routes with enhanced layout */}
              <Route path="/" element={<MinimalLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<EnhancedDashboard />} />
                <Route path="dashboard/clean" element={<CleanDashboard />} />
                <Route path="dashboard/original" element={<Dashboard />} />
                <Route path="chairman" element={<ChairmanDashboard />} />
                <Route path="chairman/executive" element={<ChairmanExecutiveDashboard />} />
                <Route path="workbodies" element={<WorkbodyList />} />
                <Route path="workbodies/overview" element={<WorkbodiesOverview />} />
                <Route path="workbodies/manage" element={<WorkbodyManagement />} />
                <Route path="workbodies/:id" element={<WorkbodyDetail />} />
                <Route path="workbodies/:id/edit" element={<WorkbodyEdit />} />
                <Route path="calendar" element={<MeetingCalendar />} />
                <Route path="meetings" element={<MeetingsList />} />
                <Route path="meetings/this-year" element={<MeetingsThisYear />} />
                <Route path="upload-minutes" element={<UploadMinutes />} />
                <Route path="minutes" element={<MeetingMinutes />} />
                <Route path="minutes/enhanced" element={<EnhancedMeetingMinutes />} />
                <Route path="minutes/draft" element={<DraftMinutes />} />
                <Route path="minutes/:id" element={<MinutesViewer />} />
                <Route path="documents" element={<Documents />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
