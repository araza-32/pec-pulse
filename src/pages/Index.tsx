
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center max-w-3xl mx-auto px-4 space-y-6 animate-fade-in w-full">
        <img 
          src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
          alt="PEC Logo" 
          className="h-28 mx-auto mb-4" 
        />
        <h1 className="text-3xl md:text-4xl font-bold text-pec-green text-center">Welcome to PEC Pulse</h1>
        <div className="space-y-3 mb-8">
          <p className="text-xl text-gray-600 text-center">
            Pakistan Engineering Council's Workbody Management System
          </p>
          <p className="text-gray-500 text-center max-w-xl mx-auto">
            PEC Pulse helps streamline the management of Committees, Working Groups, and Taskforces efficiently. 
            Track meetings, monitor progress, and enhance collaboration across all PEC workbodies.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login" className="w-full sm:w-auto">
            <Button 
              className="bg-pec-green hover:bg-pec-green/90 transition-colors duration-300 text-sm px-6 py-2.5 h-auto rounded-lg w-full sm:w-auto"
            >
              Login to Access Dashboard
            </Button>
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="border-pec-green text-pec-green hover:bg-pec-green/10 transition-colors duration-300 text-sm px-6 py-2.5 h-auto rounded-lg w-full sm:w-auto"
            >
              Explore as Guest
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 pt-8">
          © 2025 Pakistan Engineering Council. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Index;
