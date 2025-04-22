
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Loading } from "./components/ui/loading";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import WorkbodyDetail from "./pages/WorkbodyDetail";
import UploadMinutes from "./pages/UploadMinutes";
import Reports from "./pages/Reports";
import WorkbodyManagement from "./pages/WorkbodyManagement";
import MeetingCalendar from "./pages/MeetingCalendar";
import ChairmanDashboard from "./pages/ChairmanDashboard";
import { LoginForm } from "./components/auth/LoginForm";

export function AppRoutes() {
  const { session, user, isLoading, isAuthChecked } = useAuth();

  // Don't render anything until we've at least checked auth once
  if (!isAuthChecked) {
    return <Loading />;
  }

  // If we're still loading user data after auth check, show loading
  if (isLoading) {
    return <Loading />;
  }

  if (!session) {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginForm onLogin={null} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout user={user} onLogout={() => {}} />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Navigate to="/dashboard" />} />
        <Route 
          path="/dashboard" 
          element={
            user?.role === 'chairman' && !user?.email?.includes('coordination') ? 
              <ChairmanDashboard /> : 
              <Dashboard />
          } 
        />
        <Route path="/workbody/:id" element={<WorkbodyDetail />} />
        
        {/* Routes accessible to admin, coordination, and secretary */}
        {(user?.role === 'secretary' || user?.role === 'admin' || user?.email?.includes('coordination')) && (
          <Route path="/upload" element={<UploadMinutes />} />
        )}
        
        {/* Calendar route for all users */}
        <Route path="/calendar" element={<MeetingCalendar />} />
        
        {/* Admin and coordination only routes */}
        {(user?.role === 'admin' || user?.email?.includes('coordination')) && (
          <>
            <Route path="/reports" element={<Reports />} />
            <Route path="/manage-workbodies" element={<WorkbodyManagement />} />
          </>
        )}
        
        {/* Chairman only routes */}
        {user?.role === 'chairman' && (
          <Route path="/chairman-dashboard" element={<ChairmanDashboard />} />
        )}
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
