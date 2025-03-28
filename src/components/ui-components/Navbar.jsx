import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthHooks';
import LogoutComponent from '../auth/LogoutComponent';
import ThemeToggle from './ThemeToggle';
import { Home, Settings, Package, Users, Menu } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-background border-border fixed w-full z-20 top-0 left-0 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              <span className="font-bold text-xl text-primary">Manage Corporate</span>
            </Link>
          </div>
          
          {/* Navigation links - desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink to="/dashboard">
                <Home className="h-4 w-4 mr-1" />
                Tableau de bord
              </NavLink>
              <NavLink to="/orders">
                <Package className="h-4 w-4 mr-1" />
                Commandes
              </NavLink>
              <NavLink to="/suppliers">
                <Users className="h-4 w-4 mr-1" />
                Fournisseurs
              </NavLink>
              <NavLink to="/settings">
                <Settings className="h-4 w-4 mr-1" />
                Paramètres
              </NavLink>
            </div>
          </div>
          
          {/* User menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium">
                    Bonjour, {user.first_name || user.username}
                  </div>
                  <LogoutComponent />
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink to="/dashboard">
            <Home className="h-4 w-4 mr-2" />
            Tableau de bord
          </MobileNavLink>
          <MobileNavLink to="/orders">
            <Package className="h-4 w-4 mr-2" />
            Commandes
          </MobileNavLink>
          <MobileNavLink to="/suppliers">
            <Users className="h-4 w-4 mr-2" />
            Fournisseurs
          </MobileNavLink>
          <MobileNavLink to="/settings">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </MobileNavLink>
        </div>
        
        {/* Mobile user menu */}
        <div className="pt-4 pb-3 border-t border-border">
          <div className="px-5 flex items-center">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="text-sm font-medium">
                  {user.first_name || user.username}
                </div>
                <LogoutComponent />
              </div>
            ) : (
              <Link 
                to="/login"
                className="text-foreground hover:text-primary transition-colors block"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link 
    to={to}
    className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium flex items-center"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children }) => (
  <Link 
    to={to}
    className="text-foreground hover:text-primary transition-colors block px-3 py-2 rounded-md text-base font-medium flex items-center"
  >
    {children}
  </Link>
);

export default Navbar;