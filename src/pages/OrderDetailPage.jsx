import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/ui-components/Navbar';
import OrderItemsTable from '../components/ui-components/OrderItemsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from "../components/ui/separator";
import { ArrowLeft, User, Building, Calendar, Truck, FileText, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/ui-components/LoadingSpinner';
import ErrorAlert from '../components/ui-components/ErrorAlert';
import { fetchOrderDetails } from '../api/ordersApi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Status configuration map for tracking status
 * @type {Object.<string, {label: string, variant: string, description: string}>}
 */
const trackingStatusMap = {
  prepared: {
    label: 'Préparée',
    variant: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Commande en préparation'
  },
  shipped: {
    label: 'Expédiée',
    variant: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'En cours de livraison'
  },
  delivered: {
    label: 'Livrée',
    variant: 'bg-green-50 text-green-700 border-green-200',
    description: 'Commande livrée'
  }
};

/**
 * Format date in French locale
 * @param {string|null} dateStr - Date string
 * @returns {string} Formatted date
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  
  const date = new Date(dateStr);
  return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
};

/**
 * OrderDetailPage component showing details of a single order
 * @returns {JSX.Element} Order detail page component
 */
const OrderDetailPage = () => {
  const { id } = useParams();
  
  // Fetch order details using React Query
  const { 
    data: order,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['orderDetail', id],
    queryFn: () => fetchOrderDetails(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  useEffect(() => {
    if (order) {
      document.title = `Commande ${order.order_number} - EnterpriseFlow`;
    } else {
      document.title = "Détails de commande - EnterpriseFlow";
    }
  }, [order]);

  // If data is loading, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
          <LoadingSpinner size="lg" text="Chargement des détails de la commande..." />
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
          <Link to="/orders">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux commandes
            </Button>
          </Link>
          <ErrorAlert 
            title="Erreur de chargement" 
            message={error?.message || "Impossible de charger les détails de la commande."} 
            onRetry={refetch}
          />
        </main>
      </div>
    );
  }

  // If order not found
  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Link to="/orders">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux commandes
            </Button>
          </Link>
          
          <div className="flex flex-col items-center justify-center h-64">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Commande non trouvée</h1>
            <p className="text-muted-foreground">La commande que vous recherchez n'existe pas ou a été supprimée.</p>
            <Button className="mt-6" asChild>
              <Link to="/orders">Voir toutes les commandes</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Get status configuration
  const statusConfig = trackingStatusMap[order.tracking_status] || {
    label: 'Indéfini',
    variant: 'bg-gray-50 text-gray-700 border-gray-200',
    description: 'Statut inconnu'
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div>
          <Link to="/orders">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux commandes
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Commande {order.order_number}</h1>
              <p className="text-muted-foreground">
                Demande associée: <Link to={`/requests/${order.request_id}`} className="hover:underline font-medium">{order.request_id}</Link>
              </p>
            </div>
            
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.variant}`}>
              {statusConfig.label}
            </span>
          </div>
          
          <Separator className="my-6" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Détails de la commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Informations fournisseur
                    </h3>
                    <div className="mt-2 border-l-2 border-primary/40 pl-4">
                      <p className="font-medium">{order.supplier_name}</p>
                      {order.supplier_email && (
                        <p className="text-sm text-muted-foreground">{order.supplier_email}</p>
                      )}
                      <p className="text-sm text-muted-foreground">ID: {order.supplier_id}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Demandeur
                    </h3>
                    <div className="mt-2 border-l-2 border-primary/40 pl-4">
                      <p className="font-medium">{order.requester?.first_name} {order.requester?.last_name || 'ID: ' + order.requester}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Dates
                    </h3>
                    <div className="mt-2 border-l-2 border-primary/40 pl-4 space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Date de commande</p>
                        <p className="font-medium">{formatDate(order.ordered_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date de livraison</p>
                        <p className="font-medium">{formatDate(order.delivered_at)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      Suivi de commande
                    </h3>
                    <div className="mt-2 border-l-2 border-primary/40 pl-4">
                      <p className="font-medium">{statusConfig.label}</p>
                      <p className="text-xs text-muted-foreground">{statusConfig.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Gérer cette commande</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Télécharger la facture
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Mettre à jour le statut
              </Button>
              
              {order.tracking_status !== 'delivered' && (
                <Button className="w-full justify-start" variant="destructive">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Annuler la commande
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        <OrderItemsTable 
          items={order.order_items || []}
          totalAmount={order.total_actual_cost || 0}
        />
      </main>
    </div>
  );
};

export default OrderDetailPage;