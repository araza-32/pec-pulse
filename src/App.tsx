
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/layout/Layout";
import { LoginForm } from "./components/auth/LoginForm";
import WorkbodyDetail from "./pages/WorkbodyDetail";
import UploadMinutes from "./pages/UploadMinutes";
import Reports from "./pages/Reports";
import WorkbodyManagement from "./pages/WorkbodyManagement";
import MeetingCalendar from "./pages/MeetingCalendar";
import ChairmanDashboard from "./pages/ChairmanDashboard";
import { User } from "./types";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!user ? (
            <Routes>
              <Route path="*" element={<LoginForm onLogin={handleLogin} />} />
            </Routes>
          ) : (
            <Routes>
              <Route element={<Layout user={user} onLogout={handleLogout} />}>
                <Route path="/" element={
                  user.role === 'chairman' ? 
                    <ChairmanDashboard /> : 
                    <Dashboard />
                } />
                <Route path="/workbody/:id" element={<WorkbodyDetail />} />
                
                {/* Secretary routes */}
                {(user.role === 'secretary' || user.role === 'admin') && (
                  <Route path="/upload" element={<UploadMinutes />} />
                )}
                
                {/* Calendar route for all users */}
                <Route path="/calendar" element={<MeetingCalendar />} />
                
                {/* Admin only routes */}
                {user.role === 'admin' && (
                  <>
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/manage-workbodies" element={<WorkbodyManagement />} />
                  </>
                )}
                
                {/* Chairman only routes */}
                {user.role === 'chairman' && (
                  <Route path="/chairman-dashboard" element={<ChairmanDashboard />} />
                )}
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
