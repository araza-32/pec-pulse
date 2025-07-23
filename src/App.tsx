
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';

import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import WorkbodyList from './pages/WorkbodyList';
import WorkbodyDetail from './pages/WorkbodyDetail';
import MeetingMinutes from './pages/MeetingMinutes';
import MinutesViewer from './pages/MinutesViewer';
import DraftMinutes from './pages/DraftMinutes';
import UploadMinutes from './pages/UploadMinutes';
import Documents from './pages/Documents';
import MeetingCalendar from './pages/MeetingCalendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DashboardProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="workbodies" element={<WorkbodyList />} />
                  <Route path="workbodies/:id" element={<WorkbodyDetail />} />
                  <Route path="minutes" element={<MeetingMinutes />} />
                  <Route path="minutes/:id" element={<MinutesViewer />} />
                  <Route path="draft-minutes" element={<DraftMinutes />} />
                  <Route path="upload-minutes" element={<UploadMinutes />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="calendar" element={<MeetingCalendar />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </DashboardProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
