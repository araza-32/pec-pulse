
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (currentSession) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentSession.user.id)
            .single();

          // Ensure the role is one of the valid User type roles
          const userRole = profile?.role === 'admin' || profile?.role === 'secretary' || profile?.role === 'chairman' 
            ? profile.role as 'admin' | 'secretary' | 'chairman'
            : 'member' as 'admin' | 'secretary' | 'chairman';

          setUser({
            id: currentSession.user.id,
            name: currentSession.user.email?.split('@')[0] || 'User',
            email: currentSession.user.email || '',
            role: userRole,
          });
        } else {
          setUser(null);
        }
        setSession(currentSession);
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession) {
        setSession(initialSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (session: any) => {
    setSession(session);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!session ? (
            <Routes>
              <Route path="*" element={<LoginForm onLogin={handleLogin} />} />
            </Routes>
          ) : (
            <Routes>
              <Route element={<Layout user={user} onLogout={handleLogout} />}>
                <Route path="/" element={
                  user?.role === 'chairman' ? 
                    <ChairmanDashboard /> : 
                    <Dashboard />
                } />
                <Route path="/workbody/:id" element={<WorkbodyDetail />} />
                
                {/* Secretary routes */}
                {(user?.role === 'secretary' || user?.role === 'admin') && (
                  <Route path="/upload" element={<UploadMinutes />} />
                )}
                
                {/* Calendar route for all users */}
                <Route path="/calendar" element={<MeetingCalendar />} />
                
                {/* Admin only routes */}
                {user?.role === 'admin' && (
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
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
