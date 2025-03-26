import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { sendGoogleTokenBack } from '../services/AuthService';

/**
 * Custom hook for authentication functionality
 * @returns {Object} Authentication utilities and state
 */
export const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async (token) => {
    setUser({ token });
    localStorage.setItem('token', token);
    const response = await sendGoogleTokenBack(token);

    if (response.exists === false) {
      console.log("Utilisateur non inscrit");
    } else {
      //Verification du role de l'utilisateur
      switch (response.user_data.role) {
        case "logistique":
          console.log("Page logistique");
          navigate('/dashboard'); // Redirigez vers le tableau de bord
          break;

        case "daf":
          console.log("Page DAF");
          navigate('/dashboard'); // Redirigez vers le tableau de bord
          break;

        default:
          console.log("Par defaut");
          navigate('/dashboard'); // Redirigez par défaut
          break;
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login'); // Redirige après déconnexion
  };

  return { user, login, logout };
};

// Keep the original export for backward compatibility
export const AuthHooks = useAuth;