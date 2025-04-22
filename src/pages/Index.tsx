
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is logged in, redirect to dashboard
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
        <p className="text-gray-500 mb-4">
          Please log in to access your dashboard.
        </p>
      </div>
    </div>
  );
};

export default Index;
