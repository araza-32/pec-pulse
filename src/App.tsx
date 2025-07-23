import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Sonner } from './components/ui/sonner';

import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Workbodies from './pages/Workbodies';
import WorkbodyDetail from './pages/WorkbodyDetail';
import Minutes from './pages/Minutes';
import MinutesViewer from './pages/MinutesViewer';
import UploadMinutes from './pages/MinutesUpload';
import Documents from './pages/Documents';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import DraftMinutes from './pages/DraftMinutes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="workbodies" element={<Workbodies />} />
              <Route path="workbodies/:id" element={<WorkbodyDetail />} />
              <Route path="minutes" element={<Minutes />} />
              <Route path="minutes/:id" element={<MinutesViewer />} />
              <Route path="draft-minutes" element={<DraftMinutes />} />
              <Route path="upload-minutes" element={<UploadMinutes />} />
              <Route path="documents" element={<Documents />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              
              {/* 404 handler */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
