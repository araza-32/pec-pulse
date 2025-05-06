
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center max-w-3xl mx-auto px-4 space-y-4 animate-fade-in w-full">
        <img 
          src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
          alt="PEC Logo" 
          className="h-28 mx-auto mb-4" 
        />
        <h1 className="text-4xl font-bold text-pec-green text-center">Welcome to PEC Pulse</h1>
        <div className="space-y-1 mb-8 text-center">
          <p className="text-xl text-gray-600">
            Pakistan Engineering Council's Workbody Management System
          </p>
          <p className="text-gray-500">
            Managing Committees, Working Groups, and Taskforces efficiently
          </p>
        </div>
        <div className="text-center">
          <Link to="/login">
            <Button 
              className="bg-pec-green hover:bg-pec-green-600 transition-colors duration-300 text-sm px-6 py-2.5 h-auto rounded-lg"
            >
              Login to Access Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
