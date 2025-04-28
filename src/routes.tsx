
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChairmanDashboard from "./pages/ChairmanDashboard";
import WorkbodyManagement from "./pages/WorkbodyManagement";
import WorkbodyDetail from "./pages/WorkbodyDetail";
import UploadMinutes from "./pages/UploadMinutes";
import MinutesViewer from "./pages/MinutesViewer";
import MeetingCalendar from "./pages/MeetingCalendar";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { User } from "./types";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Define public routes without authentication
export const publicRoutes = [
  {
    path: "/",
    element: (
      <Layout>
        <Index />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  }
];

// Define protected routes that require authentication
export const protectedRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/chairman-dashboard",
    element: <ChairmanDashboard />,
  },
  {
    path: "/workbodies",
    element: <WorkbodyManagement />,
  },
  {
    path: "/workbodies/:id",
    element: <WorkbodyDetail />,
  },
  {
    // Added path for minutes/upload to match the sidebar nav link
    path: "/minutes/upload",
    element: <UploadMinutes />,
  },
  {
    path: "/minutes/:id",
    element: <MinutesViewer />,
  },
  {
    path: "/calendar",
    element: <MeetingCalendar />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
  // Added an additional route for the upload path mentioned in the sidebar
  {
    path: "/upload",
    element: <UploadMinutes />,
  },
];

// For use in the App component
export const router = [
  ...publicRoutes,
  ...protectedRoutes.map(route => ({
    ...route,
    element: (
      <ProtectedRoute>
        <Layout>
          {route.element}
        </Layout>
      </ProtectedRoute>
    )
  })),
  {
    path: "*",
    element: (
      <Layout>
        <NotFound />
      </Layout>
    ),
  },
];

