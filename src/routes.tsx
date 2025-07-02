
import { Navigate } from 'react-router-dom';
import { NewLayout } from './components/layout/NewLayout';
import Dashboard from './pages/Dashboard';
import WorkbodyManagement from './pages/WorkbodyManagement';
import WorkbodyDetail from './pages/WorkbodyDetail';
import WorkbodyEdit from './pages/WorkbodyEdit';
import ChairmanDashboard from './pages/ChairmanDashboard';
import MeetingCalendar from './pages/MeetingCalendar';
import MeetingMinutes from './pages/MeetingMinutes';
import UploadMinutes from './pages/UploadMinutes';
import DraftMinutes from './pages/DraftMinutes';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Documents from './pages/Documents';

export const router = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/dashboard',
    element: <NewLayout><Dashboard /></NewLayout>,
  },
  {
    path: '/chairman-dashboard',
    element: <NewLayout><ChairmanDashboard /></NewLayout>,
  },
  {
    path: '/workbodies',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbody/:id',
    element: <NewLayout><WorkbodyDetail /></NewLayout>,
  },
  {
    path: '/workbody/edit/:id',
    element: <NewLayout><WorkbodyEdit /></NewLayout>,
  },
  // Fix redirect for old workbodies routes
  {
    path: '/workbodies/:id',
    element: <Navigate to="/workbodies" replace />,
  },
  // Workbody category routes - all properly configured
  {
    path: '/workbodies/governing-body',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/management-committee',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/ec',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/esc',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/eab',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/epdc',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/tf-cpd-policy',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/abc',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/qec',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/wg-pecir',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/wg-pecadm',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/cpc',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/special-initiatives',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/think-tank',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/wg-technical-codes',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/wg-psii',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/tf-power-sector',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/wg-yea',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/wg-cid',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/wg-iald',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/ipea-monitoring',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  // Legacy routes for backward compatibility
  {
    path: '/workbodies/committees',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/working-groups',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/workbodies/task-forces',
    element: <NewLayout><WorkbodyManagement /></NewLayout>,
  },
  {
    path: '/calendar',
    element: <NewLayout><MeetingCalendar /></NewLayout>,
  },
  {
    path: '/meetings/list',
    element: <NewLayout><MeetingMinutes /></NewLayout>,
  },
  {
    path: '/minutes/:id',
    element: <NewLayout><MeetingMinutes /></NewLayout>,
  },
  {
    path: '/upload-minutes',
    element: <NewLayout><UploadMinutes /></NewLayout>,
  },
  {
    path: '/draft-minutes',
    element: <NewLayout><DraftMinutes /></NewLayout>,
  },
  {
    path: '/documents',
    element: <NewLayout><Documents /></NewLayout>,
  },
  {
    path: '/reports',
    element: <NewLayout><Reports /></NewLayout>,
  },
  {
    path: '/settings',
    element: <NewLayout><Settings /></NewLayout>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
