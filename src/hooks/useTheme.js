import { useContext } from 'react';
import { ThemeContext } from '../App';

/**
 * Custom hook for theme management functionality
 * @returns {Object} Theme utilities and state
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default useTheme;