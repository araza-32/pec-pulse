
import { useState } from "react";
import { NewLoginForm } from "@/components/auth/NewLoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Login() {
  const { session, login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to dashboard if already logged in
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Use login function from context with improved error handling
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - form */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/lovable-uploads/519b599a-cf05-4e27-9f31-3621cb09ed31.png"
                  alt="PEC PULSE Logo"
                  className="h-10 w-auto"
                />
                <h2 className="text-2xl font-bold text-pec-green">PEC Pulse</h2>
              </Link>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Access your workbody management dashboard
              </p>
            </div>
            <ThemeToggle />
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <NewLoginForm onLogin={handleLogin} isLoading={isLoading} />
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gray-50 dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full flex justify-center items-center gap-3 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <a href="#" className="font-medium text-pec-green hover:text-pec-green-600">
                  Request access
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - decorative image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 flex flex-col">
          <div className="bg-pec-green h-1/3 flex items-center justify-center">
            <div className="text-white text-xl font-semibold px-12 text-center">
              Pakistan Engineering Council
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 h-2/3 flex items-center justify-center">
            <div className="max-w-md px-12">
              <img
                className="w-full h-auto"
                src="/lovable-uploads/519b599a-cf05-4e27-9f31-3621cb09ed31.png"
                alt="PEC PULSE Logo"
              />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Workbody Management System
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Streamline coordination, enhance collaboration, and ensure compliance across all engineering committees, working groups, and task forces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
