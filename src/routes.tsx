
import { createBrowserRouter, redirect } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EnhancedDashboard from './pages/EnhancedDashboard';
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
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'auth/set-password',
        element: <SetPassword />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'enhanced-dashboard',
        element: <EnhancedDashboard />,
      },
      {
        path: 'chairman-dashboard',
        element: <ChairmanDashboard />,
      },
      {
        path: 'chairman-executive',
        element: <ChairmanExecutiveDashboard />,
      },
      {
        path: 'workbodies',
        element: <WorkbodiesOverview />,
      },
      {
        path: 'workbodies/management',
        element: <WorkbodyManagement />,
      },
      {
        path: 'workbodies/governing-body',
        element: <WorkbodiesOverview />,
      },
      {
        path: 'workbodies/management-committee', 
        element: <WorkbodiesOverview />,
      },
      {
        path: 'workbodies/ec',
        element: <WorkbodiesOverview />,
      },
      {
        path: 'workbodies/esc',
        element: <WorkbodiesOverview />,
      },
      {
        path: 'workbodies/eab',
        element: <WorkbodiesOverview />,
      },
      {
        path: 'workbodies/epdc',
        element: <WorkbodiesOverview />,
      },
      {
        path: 'workbodies/tf-cpd-policy',
        element: <WorkbodiesOverview />,
      },
      {
        path: 'workbodies/abc',
        element: <WorkbodiesOverview />,
      },
      {
        path: 'workbodies/qec',
        element: <WorkbodiesOverview />,
      },
      {
        path: 'workbodies/list',
        element: <WorkbodyList />,
      },
      {
        path: 'workbodies/:id',
        element: <WorkbodyDetail />,
      },
      {
        path: 'workbodies/:id/edit',
        element: <WorkbodyEdit />,
      },
      // Legacy redirect for old workbody routes
      {
        path: 'workbody/:id',
        loader: ({ params }) => {
          return redirect(`/workbodies/${params.id}`);
        },
      },
      {
        path: 'calendar',
        element: <MeetingCalendar />,
      },
      {
        path: 'meetings/list',
        element: <MeetingsList />,
      },
      {
        path: 'minutes',
        element: <MeetingMinutes />,
      },
      {
        path: 'meetings',
        element: <MeetingMinutes />,
      },
      {
        path: 'enhanced-minutes',
        element: <EnhancedMeetingMinutes />,
      },
      {
        path: 'minutes/:id',
        element: <MinutesViewer />,
      },
      {
        path: 'draft-minutes',
        element: <DraftMinutes />,
      },
      {
        path: 'upload-minutes',
        element: <UploadMinutes />,
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
