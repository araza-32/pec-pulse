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
import MeetingsList from "./pages/MeetingsList";
import WorkbodyList from "./pages/WorkbodyList";
import Settings from "./pages/Settings";
import MeetingsThisYear from "./pages/MeetingsThisYear";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Role-based route component
const RoleBasedRoute = ({ 
  roles, 
  children 
}: { 
  roles: string[], 
  children: React.ReactNode 
}) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  if (!roles.includes(session.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Define public routes without authentication
export const publicRoutes = [
  {
    path: "/",
    element: <Index />,
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
    element: <RoleBasedRoute roles={['chairman', 'admin', 'registrar']}>
      <ChairmanDashboard />
    </RoleBasedRoute>
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
  {
    path: "/upload",
    element: <UploadMinutes />,
  },
  {
    path: "/meetings/list",
    element: <MeetingsList />
  },
  {
    path: "/workbodies/list",
    element: <WorkbodyList />
  },
  {
    path: "/settings",
    element: <RoleBasedRoute roles={['admin']}>
      <Settings />
    </RoleBasedRoute>
  }
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
    path: "/meetings/year",
    element: <MeetingsThisYear />,
  },
  {
    path: "*",
    element: (
      <Layout>
        <NotFound />
      </Layout>
    ),
  },
];
