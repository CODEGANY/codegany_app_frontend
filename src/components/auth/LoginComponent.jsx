import { GoogleLogin } from '@react-oauth/google';
import { AuthHooks } from '../../hooks/AuthHooks';

const LoginComponent = () => {
  const { login } = AuthHooks();

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