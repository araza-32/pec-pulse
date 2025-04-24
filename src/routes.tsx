
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ChairmanDashboard from "./pages/ChairmanDashboard";
import WorkbodyManagement from "./pages/WorkbodyManagement";
import WorkbodyDetail from "./pages/WorkbodyDetail";
import UploadMinutes from "./pages/UploadMinutes";
import MinutesViewer from "./pages/MinutesViewer";
import MeetingCalendar from "./pages/MeetingCalendar";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import { useAuthHandlers } from "./hooks/useAuthHandlers";

export const router = [
  {
    path: "/",
    element: (
      <Layout user={null} onLogout={() => {}}>
        <Index />
      </Layout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Layout user={null} onLogout={() => {}}>
        <Dashboard />
      </Layout>
    ),
  },
  {
    path: "/chairman-dashboard",
    element: (
      <Layout user={null} onLogout={() => {}}>
        <ChairmanDashboard />
      </Layout>
    ),
  },
  {
    path: "/workbodies",
    element: (
      <Layout user={null} onLogout={() => {}}>
        <WorkbodyManagement />
      </Layout>
    ),
  },
  {
    path: "/workbodies/:id",
    element: (
      <Layout user={null} onLogout={() => {}}>
        <WorkbodyDetail />
      </Layout>
    ),
  },
  {
    path: "/minutes/upload",
    element: (
      <Layout user={null} onLogout={() => {}}>
        <UploadMinutes />
      </Layout>
    ),
  },
  {
    path: "/minutes/:id",
    element: (
      <Layout user={null} onLogout={() => {}}>
        <MinutesViewer />
      </Layout>
    ),
  },
  {
    path: "/calendar",
    element: (
      <Layout user={null} onLogout={() => {}}>
        <MeetingCalendar />
      </Layout>
    ),
  },
  {
    path: "/reports",
    element: (
      <Layout user={null} onLogout={() => {}}>
        <Reports />
      </Layout>
    ),
  },
  {
    path: "*",
    element: (
      <Layout user={null} onLogout={() => {}}>
        <NotFound />
      </Layout>
    ),
  },
];
