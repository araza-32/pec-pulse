
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="text-center max-w-2xl mx-auto px-4 space-y-8">
        <img 
          src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
          alt="PEC Logo" 
          className="h-28 mx-auto mb-4" 
        />
        <h1 className="text-4xl font-bold text-pec-green">Welcome to PEC Pulse</h1>
        <p className="text-xl text-gray-600">
          Pakistan Engineering Council's Workbody Management System
        </p>
        <Link to="/login">
          <Button 
            className="bg-pec-green hover:bg-pec-green-600 transition-colors duration-300 text-lg px-8 py-6 h-auto"
          >
            Login to Access Dashboard
          </Button>
        </Link>
      </div>

      <footer className="absolute bottom-0 w-full text-center py-4 text-sm text-gray-600">
        © 2025 Pakistan Engineering Council. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
