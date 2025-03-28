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
            // Store user data in context
            setUser({ token, ...response.user_data });
            
            // Store essential user info in localStorage
            localStorage.setItem('userRole', response.user_data.role);
            localStorage.setItem('userId', response.user_data.user_id);
            localStorage.setItem('userName', response.user_data.username);
            
            // Store first name and last name if available
            if (response.user_data.first_name) {
              localStorage.setItem('userFirstName', response.user_data.first_name);
            }
            if (response.user_data.last_name) {
              localStorage.setItem('userLastName', response.user_data.last_name);
            }
            
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
      // Clear all user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userFirstName');
      localStorage.removeItem('userLastName');
      
      toast.info("Déconnexion réussie");
      navigate('/login');
    };

return {onRegistrationSubmit , handleGoogleLogin, logout, onLoginSubmit, user};
}