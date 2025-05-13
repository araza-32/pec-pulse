
import { Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import WorkbodyList from './pages/WorkbodyList';
import WorkbodyDetail from './pages/WorkbodyDetail';
import WorkbodiesOverview from './pages/WorkbodiesOverview';
import ChairmanDashboard from './pages/ChairmanDashboard';
import MeetingCalendar from './pages/MeetingCalendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

export const router = [
  {
    path: '/',
    element: <Layout><Dashboard /></Layout>,
  },
  {
    path: '/chairman-dashboard',
    element: <Layout><ChairmanDashboard /></Layout>,
  },
  {
    path: '/workbodies',
    element: <Layout><WorkbodyList /></Layout>,
  },
  {
    path: '/workbodies-overview',
    element: <Layout><WorkbodiesOverview /></Layout>,
  },
  {
    path: '/workbody/:id',
    element: <Layout><WorkbodyDetail /></Layout>,
  },
  {
    path: '/calendar',
    element: <Layout><MeetingCalendar /></Layout>,
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
