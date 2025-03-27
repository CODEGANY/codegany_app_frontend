import { createContext, useState,useEffect } from 'react';
import { getInfoAboutTokenUser } from '@/api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { token } : null;
  });
  const [loading, setLoading] = useState(true); // Pour gérer le chargement initial

  // Vérifier le token et récupérer les infos utilisateur au chargement
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getInfoAboutTokenUser(token);
          if (response.exists) {
            setUser({ token, ...response.user_data }); // Ajouter les données utilisateur
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser , loading }}>
      {children}
    </AuthContext.Provider>
  );
};