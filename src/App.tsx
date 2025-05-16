
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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
      <Routes>
        {router.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
