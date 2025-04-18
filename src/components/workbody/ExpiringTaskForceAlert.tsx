
import { Clock } from "lucide-react";
import { Workbody } from "@/types";

interface ExpiringTaskForceAlertProps {
  expiringTaskForces: Workbody[];
}

export function ExpiringTaskForceAlert({ expiringTaskForces }: ExpiringTaskForceAlertProps) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
      <div className="flex items-center">
        <Clock className="h-6 w-6 text-amber-500 mr-2" />
        <h3 className="font-medium text-amber-800">
          Task Forces Approaching End Date
        </h3>
      </div>
      <div className="mt-2 space-y-1">
        {expiringTaskForces.map((tf) => (
          <p key={tf.id} className="text-sm text-amber-700">
            {tf.name} - Ends on{" "}
            {new Date(tf.endDate!).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ))}
      </div>
    </div>
  );
}
