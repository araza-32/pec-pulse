import { createBrowserRouter } from "react-router-dom";
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

export default createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/chairman-dashboard", element: <ChairmanDashboard /> },
      { path: "/workbodies", element: <WorkbodyManagement /> },
      { path: "/workbodies/:id", element: <WorkbodyDetail /> },
      { path: "/minutes/upload", element: <UploadMinutes /> },
      { path: "/minutes/:id", element: <MinutesViewer /> },
      { path: "/calendar", element: <MeetingCalendar /> },
      { path: "/reports", element: <Reports /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
