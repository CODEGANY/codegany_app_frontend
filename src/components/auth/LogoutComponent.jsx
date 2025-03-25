import { AuthHooks } from '../../hooks/AuthHooks';

const LogoutComponent = () => {
  const { logout } = AuthHooks();

  return (
    <button onClick={logout}>Déconnexion</button>
  );
};

export default LogoutComponent;