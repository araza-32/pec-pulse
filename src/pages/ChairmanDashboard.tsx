
import { Card, CardContent } from "@/components/ui/card";
import ChairmanExecutiveDashboard from "./ChairmanExecutiveDashboard";

export default function ChairmanDashboard() {
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
