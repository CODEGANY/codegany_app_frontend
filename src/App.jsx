
import { AuthProvider } from './contexts/AuthContext';
import RoutesApp from './routesApp';
import { Toaster as Sonner } from "@/components/ui/sonner";

function App() {
  return (
    <AuthProvider>  
      <Sonner />
      <RoutesApp/>
    </AuthProvider>
  )
}

export default App
