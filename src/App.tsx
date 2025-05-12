
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  // Initialize theme setting from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
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
