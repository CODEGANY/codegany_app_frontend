
import { GoogleLogin } from '@react-oauth/google';
import { LoginSigninHooks } from '@/hooks/LoginSigninHooks';
import { toast } from 'sonner';

const LogoutComponent = () => {

  const { logout } = LoginSigninHooks();

  return (
    <button onClick={logout}>Déconnexion</button>
  );
};

export default LogoutComponent;