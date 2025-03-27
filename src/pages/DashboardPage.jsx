import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/ui-components/Navbar';
import StatsCard from '../components/ui-components/StatsCard';
import { ProductOrdersChart } from '../components/charts/ProductOrdersChart';
import { ProductCostsChart } from '../components/charts/ProductCostsChart';
import { 
  ArrowUpRight, 
  CreditCard, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Activity,
  Package
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import LoadingSpinner from '../components/ui-components/LoadingSpinner';
import ErrorAlert from '../components/ui-components/ErrorAlert';
import { fetchDashboardData } from '../api/dashboardApi';

/**
 * Dashboard page component showing overview of purchase management system
 * @returns {JSX.Element} Dashboard page component
 */
const DashboardPage = () => {
  // Fetch dashboard data using React Query
  const { 
    data: dashboardData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  useEffect(() => {
    document.title = "Tableau de bord - EnterpriseFlow";
  }, []);

  // Animation for stats cards to appear with stagger effect
  useEffect(() => {
    if (!isLoading && !isError) {
      const statsCards = document.querySelectorAll('.stats-card');
      statsCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-fade-in');
        }, 100 * index);
      });
    }
  }, [isLoading, isError]);

  // If data is loading, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
          <LoadingSpinner size="lg" text="Chargement des données du tableau de bord..." />
        </main>
      </div>
    );
  }

  // If there's an error, show error message
  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ErrorAlert 
            title="Erreur de chargement" 
            message={error?.message || "Impossible de charger les données du tableau de bord."} 
            onRetry={refetch}
          />
        </main>
      </div>
    );
  }

  // Extract data for easier access
  const { requestStats, orderStats } = dashboardData;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Gérez vos commandes et suivez l'activité des achats de votre entreprise.
          </p>
          <Separator className="my-2" />
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard 
                title="Demandes d'achat" 
                value={requestStats.total.toString()}
                trend={`${requestStats.pending > 0 ? requestStats.pending : 0} en attente`}
                trendLabel="à traiter"
                icon={<ShoppingCart className="h-4 w-4 text-primary" />}
                trendUp={false}
                className="stats-card opacity-0"
              />
              
              <StatsCard 
                title="Commandes en cours" 
                value={orderStats.inProgress.toString()}
                progress={Math.round((orderStats.inProgress / orderStats.total) * 100) || 0}
                trendLabel="du total des commandes"
                icon={<CreditCard className="h-4 w-4 text-primary" />}
                className="stats-card opacity-0"
              />
              
              <StatsCard 
                title="Taux d'approbation" 
                value={`${Math.round((requestStats.approved / requestStats.total) * 100) || 0}%`}
                trend={requestStats.approved > 0 ? `${requestStats.approved} demandes` : "0 demande"}
                trendLabel="approuvées"
                icon={<Package className="h-4 w-4 text-primary" />}
                trendUp={true}
                className="stats-card opacity-0"
              />
              
              <StatsCard 
                title="Livraisons" 
                value={orderStats.delivered.toString()}
                trend={`${Math.round((orderStats.delivered / orderStats.total) * 100) || 0}%`}
                trendLabel="du total des commandes"
                icon={<TrendingUp className="h-4 w-4 text-primary" />}
                trendUp={true}
                className="stats-card opacity-0"
              />
            </div>

            <Separator className="my-2" />
          </TabsContent>
           
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProductOrdersChart />
              
              <ProductCostsChart />
          </div>
          
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardPage;