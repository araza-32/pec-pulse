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
  {
    path: '/workbodies/:id',
    element: <Navigate to={`/workbody/${window.location.pathname.split('/workbodies/')[1]}`} />,
  },
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
