
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <AppSidebar />
      <main className="flex-1 ml-72 p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
