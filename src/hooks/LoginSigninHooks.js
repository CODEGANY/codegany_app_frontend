import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { getInfoAboutTokenUser, sendRegistration } from "@/api/authApi";


export const LoginSigninHooks = ()=>{

      const navigate = useNavigate();
      const { user, setUser } = useContext(AuthContext);


      const onLoginSubmit = (values) => {
          toast.info("Connexion en cours");  
      };

      const onRegistrationSubmit = async (values) => {
          try {
            //Verification de l'utilisateur s'il existe déjà (email) a revoir
            const response = await sendRegistration(values);
            toast.success("Inscription réussie");
          } catch (error) {
            console.error('Erreur lors de la création du compte', error);
            toast.error('Erreur lors de la création du compte');
          }
        };

      const handleGoogleLogin = async (token) => {
        toast.info('Connexion en cours');
        try {
          localStorage.setItem('token', token);
          const response = await getInfoAboutTokenUser(token);
          if (response.exists === false) {
            toast.info('Utilisateur non inscrit');
            localStorage.removeItem('token');
          } else {
            
            setUser({ token, ...response.user_data });
            toast.success('Connexion réussie');
            setTimeout(() => {
              navigate('/dashboard'); // Redirige vers HomePage
            }, 1500);
          }
        } catch (error) {
          console.error('Erreur lors de la connexion Google:', error);
          toast.error('Erreur de connexion');
        }
      };

    const logout = () => {
      setUser(null);
      localStorage.removeItem('token');
      toast.info("Déconnexion réussie");
      navigate('/login');
    };

return {onRegistrationSubmit , handleGoogleLogin, logout, onLoginSubmit, user};
}