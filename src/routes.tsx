
import { createBrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import ModernDashboard from './pages/ModernDashboard';
import ChairmanDashboard from './pages/ChairmanDashboard';
import ChairmanExecutiveDashboard from './pages/ChairmanExecutiveDashboard';
import WorkbodyManagement from './pages/WorkbodyManagement';
import WorkbodyList from './pages/WorkbodyList';
import WorkbodyDetail from './pages/WorkbodyDetail';
import WorkbodyEdit from './pages/WorkbodyEdit';
import WorkbodiesOverview from './pages/WorkbodiesOverview';
import MeetingCalendar from './pages/MeetingCalendar';
import MeetingsList from './pages/MeetingsList';
import MeetingMinutes from './pages/MeetingMinutes';
import EnhancedMeetingMinutes from './pages/EnhancedMeetingMinutes';
import MinutesViewer from './pages/MinutesViewer';
import DraftMinutes from './pages/DraftMinutes';
import UploadMinutes from './pages/UploadMinutes';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import SetPassword from './pages/SetPassword';
import NotFound from './pages/NotFound';
import { AppLayout } from './components/layout/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/set-password',
    element: <SetPassword />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <ModernDashboard />,
      },
      {
        path: 'dashboard',
        element: <ModernDashboard />,
      },
      {
        path: 'workbodies',
        element: <WorkbodyList />,
      },
      {
        path: 'workbodies/overview',
        element: <WorkbodiesOverview />,
      },
      {
        path: 'workbodies/management',
        element: <WorkbodyManagement />,
      },
      {
        path: 'workbodies/:id',
        element: <WorkbodyDetail />,
      },
      {
        path: 'workbodies/:id/edit',
        element: <WorkbodyEdit />,
      },
      {
        path: 'calendar',
        element: <MeetingCalendar />,
      },
      {
        path: 'chairman-dashboard',
        element: <ChairmanDashboard />,
      },
      {
        path: 'meetings',
        element: <MeetingsList />,
      },
      {
        path: 'minutes',
        element: <MeetingMinutes />,
      },
      {
        path: 'minutes/draft',
        element: <DraftMinutes />,
      },
      {
        path: 'minutes/enhanced',
        element: <EnhancedMeetingMinutes />,
      },
      {
        path: 'minutes/upload',
        element: <UploadMinutes />,
      },
      {
        path: 'minutes/:id',
        element: <MinutesViewer />,
      },
      {
        path: 'admin/users',
        element: <Settings />,
      },
      {
        path: 'admin/audit',
        element: <Reports />,
      },
      {
        path: 'documents',
        element: <Documents />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
