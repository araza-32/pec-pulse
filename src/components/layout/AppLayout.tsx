
import { Outlet } from "react-router-dom";
import { CleanSidebar } from "./CleanSidebar";
import { MinimalHeader } from "./MinimalHeader";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CleanSidebar />
      
      <div className="flex-1 ml-64">
        <MinimalHeader />
        
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
