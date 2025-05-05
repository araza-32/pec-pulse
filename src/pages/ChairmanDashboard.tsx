
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChairmanExecutiveDashboard from "./ChairmanExecutiveDashboard";
import { Card, CardContent } from "@/components/ui/card";

export default function ChairmanDashboard() {
  const navigate = useNavigate();
  
  // Redirect to the executive dashboard directly
  useEffect(() => {
    // Keep this effect for potential future use, but it's mainly a placeholder now
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Chairman Dashboard</h1>
      <Card className="mb-6">
        <CardContent className="p-6">
          <ChairmanExecutiveDashboard />
        </CardContent>
      </Card>
    </div>
  );
}
