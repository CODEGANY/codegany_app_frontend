import { GoogleLogin } from '@react-oauth/google';
import { LoginSigninHooks } from '@/hooks/LoginSigninHooks';
import { toast } from 'sonner';

const LoginComponent = () => {
  const { handleGoogleLogin } = LoginSigninHooks();

  const handleSuccess = (response) => {
    handleGoogleLogin(response.credential); // Stocke le token
  };
  const handleError = () => {
    toast.error("Erreur lors de la connexion");
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