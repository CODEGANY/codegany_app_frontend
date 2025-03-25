import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { sendGoogleTokenBack } from '../services/authService';


export const AuthHooks = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = (token) => {
    setUser({ token });
    localStorage.setItem('token', token);
    sendGoogleTokenBack(token);
    navigate('/home'); // Redirige après connexion
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login'); // Redirige après déconnexion
  };

  return { user, login, logout };
};