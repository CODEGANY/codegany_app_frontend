import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/AuthHooks';

const LoginComponent = () => {
  const { login } = useAuth();

  const handleSuccess = (response) => {
    login(response.credential); // Stocke le token
  };

  const handleError = () => {
    console.log('Erreur lors de la connexion');
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default LoginComponent;