import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChairmanExecutiveDashboard from "./ChairmanExecutiveDashboard";

export default function ChairmanDashboard() {
  const navigate = useNavigate();
  
  // Redirect to the executive dashboard directly
  useEffect(() => {
    // Keep this effect for potential future use, but it's mainly a placeholder now
  }, []);

  return <ChairmanExecutiveDashboard />;
}
