import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';

/**
 * A component that toggles between light and dark themes
 * @returns {JSX.Element} Theme toggle button
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Passer au mode ${theme === 'light' ? 'sombre' : 'clair'}`}
      className="w-9 px-0"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;