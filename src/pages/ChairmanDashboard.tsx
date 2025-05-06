
import { Card, CardContent } from "@/components/ui/card";
import ChairmanExecutiveDashboard from "./ChairmanExecutiveDashboard";

export default function ChairmanDashboard() {
  return (
    <div className="max-w-full mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Chairman Dashboard</h1>
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <ChairmanExecutiveDashboard />
        </CardContent>
      </Card>
    </div>
  );
}
