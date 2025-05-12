
import { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
  activeDialog: string | null;
  setActiveDialog: (dialog: string | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  
  return (
    <DashboardContext.Provider value={{
      activeDialog,
      setActiveDialog,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
}
