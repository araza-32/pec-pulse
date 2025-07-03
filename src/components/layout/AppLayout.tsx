
import { Outlet } from "react-router-dom";
import { SimplifiedSidebar } from "./SimplifiedSidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen flex w-full">
      <SimplifiedSidebar className="w-64 border-r bg-white" />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
