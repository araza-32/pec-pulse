
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MinimalLayout } from './components/layout/MinimalLayout';
import { Toaster } from './components/ui/toaster';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import CleanDashboard from './pages/CleanDashboard';
import ChairmanDashboard from './pages/ChairmanDashboard';
import WorkbodiesOverview from './pages/WorkbodiesOverview';
import WorkbodyDetail from './pages/WorkbodyDetail';
import WorkbodyEdit from './pages/WorkbodyEdit';
import WorkbodyList from './pages/WorkbodyList';
import MeetingCalendar from './pages/MeetingCalendar';
import MeetingMinutes from './pages/MeetingMinutes';
import MeetingsList from './pages/MeetingsList';
import UploadMinutes from './pages/UploadMinutes';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            <Route element={<MinimalLayout />}>
              <Route path="/dashboard" element={<CleanDashboard />} />
              <Route path="/chairman-dashboard" element={<ChairmanDashboard />} />
              <Route path="/workbodies" element={<WorkbodiesOverview />} />
              <Route path="/workbodies/list" element={<WorkbodyList />} />
              <Route path="/workbodies/:id" element={<WorkbodyDetail />} />
              <Route path="/workbodies/:id/edit" element={<WorkbodyEdit />} />
              <Route path="/calendar" element={<MeetingCalendar />} />
              <Route path="/meetings/list" element={<MeetingsList />} />
              <Route path="/meetings" element={<MeetingMinutes />} />
              <Route path="/upload-minutes" element={<UploadMinutes />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
