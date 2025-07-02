
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  // Apply consistent theme
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    
    // Set consistent background
    document.body.classList.add('bg-gradient-to-br', 'from-white', 'to-green-50/30');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50/30 text-foreground">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
