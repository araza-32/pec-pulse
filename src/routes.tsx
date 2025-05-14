
import { Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import WorkbodyManagement from './pages/WorkbodyManagement';
import WorkbodyDetail from './pages/WorkbodyDetail';
import ChairmanDashboard from './pages/ChairmanDashboard';
import MeetingCalendar from './pages/MeetingCalendar';
import MeetingMinutes from './pages/MeetingMinutes';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

export const router = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/dashboard',
    element: <Layout><Dashboard /></Layout>,
  },
  {
    path: '/chairman-dashboard',
    element: <Layout><ChairmanDashboard /></Layout>,
  },
  {
    path: '/workbodies',
    element: <Layout><WorkbodyManagement /></Layout>,
  },
  {
    path: '/workbody/:id',
    element: <Layout><WorkbodyDetail /></Layout>,
  },
  {
    path: '/workbodies/:id',
    element: <Layout><WorkbodyDetail /></Layout>,
  },
  {
    path: '/calendar',
    element: <Layout><MeetingCalendar /></Layout>,
  },
  {
    path: '/meetings/list',
    element: <Layout><MeetingMinutes /></Layout>,
  },
  {
    path: '/minutes/:id',
    element: <Layout><MeetingMinutes /></Layout>,
  },
  {
    path: '/reports',
    element: <Layout><Reports /></Layout>,
  },
  {
    path: '/settings',
    element: <Layout><Settings /></Layout>,
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
