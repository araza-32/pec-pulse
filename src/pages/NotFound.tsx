
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-6">Oops! Page not found</p>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
        {location.pathname.includes('/workbody/') && (
          <span className="block mt-2 text-pec-green">
            Hint: Try accessing workbodies through the /workbodies/{location.pathname.split('/workbody/')[1]} route.
          </span>
        )}
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/dashboard" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
        {location.pathname.includes('/workbody/') && (
          <Button asChild variant="outline">
            <Link to={`/workbody/${location.pathname.split('/workbody/')[1]}`}>
              Go to Workbody
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotFound;
