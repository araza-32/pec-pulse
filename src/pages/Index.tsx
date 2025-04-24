
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-2xl mx-auto px-4">
        <img 
          src="/lovable-uploads/26062e6e-e7ef-45d9-895b-79ac41a220c7.png" 
          alt="PEC Logo" 
          className="h-24 mx-auto mb-8" 
        />
        <h1 className="text-4xl font-bold mb-4 text-pec-green">Welcome to PEC Pulse</h1>
        <p className="text-xl text-gray-600 mb-8">
          Pakistan Engineering Council's Workbody Management System
        </p>
        <Link to="/login">
          <Button 
            className="bg-pec-green hover:bg-pec-green-600"
          >
            Login to Access Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
