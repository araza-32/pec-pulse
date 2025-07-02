
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  // Apply theme with enhanced colors
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    
    // Set background color for body
    document.body.classList.add('bg-green-50/30');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50/50 text-foreground">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
