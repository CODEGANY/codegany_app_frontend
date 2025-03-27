// filepath: /Users/krishna/Dev/codegany/codegany_app_frontend/src/pages/OrdersPage.jsx
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/ui-components/Navbar';
import PurchaseOrderTable from '../components/ui-components/PurchaseOrderTable';
import PurchaseRequestTable from '../components/ui-components/PurchaseRequestTable';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import LoadingSpinner from '../components/ui-components/LoadingSpinner';
import ErrorAlert from '../components/ui-components/ErrorAlert';
import { fetchOrdersAndRequests } from '../api/ordersApi';
import { Package, FileText } from 'lucide-react';

/**
 * OrdersPage component showing lists of purchase requests and orders
 * @returns {JSX.Element} Orders page component
 */
const OrdersPage = () => {
  // Fetch orders and requests data using React Query
  const { 
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['ordersAndRequests'],
    queryFn: fetchOrdersAndRequests,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  useEffect(() => {
    document.title = "Commandes - EnterpriseFlow";
  }, []);

  // If data is loading, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
          <LoadingSpinner size="lg" text="Chargement des commandes et des demandes d'achat..." />
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
            message={error?.message || "Impossible de charger les données des commandes et demandes."} 
            onRetry={refetch}
          />
        </main>
      </div>
    );
  }

  const { orders, requests } = data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground">
            Consultez et gérez les demandes d'achat et les commandes.
          </p>
          <Separator className="my-2" />
        </div>
        
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="mb-4 bg-muted/50 p-1">
            <TabsTrigger 
              value="requests" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Liste des demandes
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Liste des commandes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests" className="animate-fade-in">
            <Card className="shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Demandes d'achat</CardTitle>
              </CardHeader>
              <CardContent>
                <PurchaseRequestTable requests={requests} showAll={true} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="animate-fade-in">
            <Card className="shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <PurchaseOrderTable orders={orders} showAll={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OrdersPage;