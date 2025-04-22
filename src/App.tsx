
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
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // First check initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession?.user?.email);
      if (initialSession) {
        setSession(initialSession);
        handleProfileFetch(initialSession);
      } else {
        setIsLoading(false);
      }
    });
    
    // Then set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        setSession(currentSession);
        
        if (currentSession) {
          await handleProfileFetch(currentSession);
        } else {
          setUser(null);
          localStorage.removeItem('user');
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleProfileFetch = async (currentSession: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentSession.user.id)
        .single();

      const userRole = profile?.role === 'admin' || profile?.role === 'secretary' || profile?.role === 'chairman' 
        ? profile.role as 'admin' | 'secretary' | 'chairman'
        : 'member' as 'admin' | 'secretary' | 'chairman';

      const userObj = {
        id: currentSession.user.id,
        name: currentSession.user.email?.split('@')[0] || 'User',
        email: currentSession.user.email || '',
        role: userRole,
      };
      
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify({
        id: currentSession.user.id,
        email: currentSession.user.email,
        role: userRole
      }));
    } catch (e) {
      console.error("Error fetching user profile:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pec-green border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!session ? (
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginForm onLogin={setSession} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          ) : (
            <Routes>
              <Route element={<Layout user={user} onLogout={async () => {
                await supabase.auth.signOut();
                setSession(null);
                setUser(null);
                localStorage.removeItem('user');
              }} />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={
                  user?.role === 'chairman' && !user?.email?.includes('coordination') ? 
                    <ChairmanDashboard /> : 
                    <Dashboard />
                } />
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
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
