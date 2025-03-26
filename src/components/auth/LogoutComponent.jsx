import { useAuth } from '../../hooks/AuthHooks';

const LogoutComponent = () => {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>Déconnexion</button>
  );
};

export default LogoutComponent;