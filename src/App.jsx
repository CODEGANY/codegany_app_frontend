import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { useState, useEffect, createContext } from 'react';
import RoutesApp from './routesApp';
import { Toaster as Sonner } from "@/components/ui/sonner";

// Create a React Query client
const queryClient = new QueryClient();

// Create a theme context to manage theme state
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

function App() {
  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme class to html element
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <AuthProvider>
          <Sonner />
          <RoutesApp/>
        </AuthProvider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
