
import { AuthProvider } from './contexts/AuthContext';
import RoutesApp from './routesApp';

function App() {
  return (
    <AuthProvider>
      <RoutesApp/>
    </AuthProvider>
  )
}

export default App
