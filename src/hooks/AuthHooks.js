import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { sendGoogleTokenBack } from '../services/authService';


export const AuthHooks = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async (token) => {
    setUser({ token });
    localStorage.setItem('token', token);
    const response = await sendGoogleTokenBack(token);

    if (response.exists == false) {
      console.log("Utilisateur non inscrit");
    } else {
    //Verification du role de l'utilisateur
    switch (response.user_data.role) {
      case "logistique":
        console.log("Page logistique");
      break;

      case "DAF":
        console.log("Page DAF");
      break;

      case "logistique":
        console.log("Page logistique");
      break;

    default:
      console.log("Par defaut");
      break;
    }
  }
   

  
    // navigate('/home'); // Redirige après connexion
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login'); // Redirige après déconnexion
  };

  return { user, login, logout };
};