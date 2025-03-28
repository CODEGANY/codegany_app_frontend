// filepath: /Users/krishna/Dev/codegany/codegany_app_frontend/src/pages/RequestDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/ui-components/Navbar';
import RequestItemsTable from '../components/ui-components/RequestItemsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from "../components/ui/separator";
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  Check, 
  X, 
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import LoadingSpinner from '../components/ui-components/LoadingSpinner';
import ErrorAlert from '../components/ui-components/ErrorAlert';
import { fetchRequestDetails } from '../api/ordersApi';
import { createApproval } from '../api/approvalsApi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ApprovalModal from '../components/ui-components/ApprovalModal';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';

/**
 * Status configuration map for request status
 * @type {Object.<string, {label: string, variant: string, description: string}>}
 */
const requestStatusMap = {
  pending: {
    label: 'En attente',
    variant: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'En attente d\'approbation'
  },
  approved: {
    label: 'Approuvée',
    variant: 'bg-green-50 text-green-700 border-green-200',
    description: 'Demande approuvée'
  },
  rejected: {
    label: 'Rejetée',
    variant: 'bg-red-50 text-red-700 border-red-200',
    description: 'Demande rejetée'
  },
  ordered: {
    label: 'Commandée',
    variant: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Commande passée au fournisseur'
  },
  delivered: {
    label: 'Livrée',
    variant: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Commande livrée'
  },
  closed: {
    label: 'Clôturée',
    variant: 'bg-gray-50 text-gray-700 border-gray-200',
    description: 'Demande finalisée'
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
 * RequestDetailPage component showing details of a single purchase request
 * @returns {JSX.Element} Request detail page component
 */
const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State for approval modals
  const [approvalMode, setApprovalMode] = useState(null); // 'approve', 'reject', or 'info'
  
  // Fetch request details using React Query
  const { 
    data: request,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['request', id],
    queryFn: () => fetchRequestDetails(parseInt(id)),
    enabled: !!id
  });

  // User role check (assuming we can get it from localStorage or a context)
  const userRole = localStorage.getItem('userRole') || 'logistique';
  const canApprove = userRole === 'daf' && request?.status === 'pending';
  
  // Create approval mutation
  const approvalMutation = useMutation({
    mutationFn: async ({ decision, comment }) => {
      return await createApproval(request.request_id, decision, comment);
    },
    onSuccess: (data, variables) => {
      // Close modal and invalidate relevant queries to refresh data
      setApprovalMode(null);
      queryClient.invalidateQueries(['request', id]);
      queryClient.invalidateQueries(['orders']); // Refresh orders list
      queryClient.invalidateQueries(['requests']); // Refresh requests list
      
      // Show success message based on decision
      const actionType = 
        variables.decision === 'approved' ? 'approuvée' : 
        variables.decision === 'rejected' ? 'rejetée' : 
        'en attente d\'information';
      toast.success(`Demande ${actionType} avec succès`);
      
      // Redirect to orders page after successful approval/rejection
      navigate('/orders');
    },
    onError: (error) => {
      console.error("Error processing approval:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue lors du traitement de cette demande."}`);
      setApprovalMode(null);
    }
  });
  
  // Handle modal submission
  const handleApprovalSubmit = (comment) => {
    const decision = 
      approvalMode === 'approve' ? 'approved' : 
      approvalMode === 'reject' ? 'rejected' : 
      'pending_info';
    
    approvalMutation.mutate({ decision, comment });
  };
  
  useEffect(() => {
    if (request) {
      document.title = `Demande #${request.request_id} - EnterpriseFlow`;
    } else {
      document.title = "Détails de demande d'achat - EnterpriseFlow";
    }
  }, [request]);

  // If data is loading, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
          <LoadingSpinner size="lg" text="Chargement des détails de la demande..." />
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
              Retour aux demandes
            </Button>
          </Link>
          <ErrorAlert 
            title="Erreur de chargement" 
            message={error?.message || "Impossible de charger les détails de la demande."} 
            onRetry={refetch}
          />
        </main>
      </div>
    );
  }

  // If request not found
  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Link to="/orders">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux demandes
            </Button>
          </Link>
          
          <div className="flex flex-col items-center justify-center h-64">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Demande non trouvée</h1>
            <p className="text-muted-foreground">La demande que vous recherchez n'existe pas ou a été supprimée.</p>
            <Button className="mt-6" asChild>
              <Link to="/orders">Voir toutes les demandes</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Get status configuration
  const statusConfig = requestStatusMap[request.status] || {
    label: 'Indéfini',
    variant: 'bg-gray-50 text-gray-700 border-gray-200',
    description: 'Statut inconnu'
  };
  
  // Get appropriate action buttons based on status
  const getActionButtons = (status) => {
    // If action is in progress, show no buttons
    if (approvalMutation.isPending) {
      return (
        <div className="p-4 border rounded-md bg-gray-50">
          <div className="flex justify-center items-center py-2">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Traitement en cours...</span>
          </div>
        </div>
      );
    }

    switch (status) {
      case 'pending':
        // Only show approval buttons if user has DAF role
        return canApprove ? (
          <>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setApprovalMode('approve')}
            >
              <Check className="mr-2 h-4 w-4" />
              Approuver la demande
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setApprovalMode('reject')}
            >
              <X className="mr-2 h-4 w-4" />
              Rejeter la demande
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setApprovalMode('info')}
            >
              <Clock className="mr-2 h-4 w-4" />
              Demander plus d'informations
            </Button>
          </>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>En attente d'approbation</AlertTitle>
            <AlertDescription>
              Cette demande est en cours d'examen par la direction financière.
            </AlertDescription>
          </Alert>
        );
      case 'approved':
        return (
          <>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate(`/orders/create/${request.request_id}`)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Créer une commande
            </Button>
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Demande approuvée</AlertTitle>
              <AlertDescription>
                Cette demande a été approuvée par la direction financière.
              </AlertDescription>
            </Alert>
          </>
        );
      case 'rejected': {
        const rejectionReason = request?.approval?.comment;
        return (
          <>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Voir les raisons du rejet
            </Button>
            <Alert className="bg-red-50 text-red-700 border-red-200">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Demande rejetée</AlertTitle>
              <AlertDescription>
                {rejectionReason || "Cette demande a été rejetée par la direction financière."}
              </AlertDescription>
            </Alert>
          </>
        );
      }
      default:
        return (
          <Button className="w-full justify-start" variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Télécharger le récapitulatif
          </Button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Full-screen loading overlay when processing approval/rejection */}
      {approvalMutation.isPending && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-8 rounded-lg shadow-lg text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Traitement en cours...</p>
            <p className="text-sm text-muted-foreground mt-2">Veuillez patienter pendant le traitement de votre demande</p>
          </div>
        </div>
      )}
      
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div>
          <Link to="/orders">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux demandes
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Demande #{request.request_id}</h1>
              {request.status === 'ordered' && (
                <p className="text-muted-foreground">
                  Commande associée: <Link to={`/orders/${request.order_id}`} className="hover:underline font-medium">{request.order_number || request.order_id}</Link>
                </p>
              )}
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
              <CardTitle>Détails de la demande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Demandeur
                    </h3>
                    <div className="mt-2 border-l-2 border-primary/40 pl-4">
                      <p className="font-medium">ID: {request.user_id}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Justification
                    </h3>
                    <div className="mt-2 border-l-2 border-primary/40 pl-4">
                      <p className="text-sm text-gray-700">{request.justification}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date de création
                    </h3>
                    <div className="mt-2 border-l-2 border-primary/40 pl-4">
                      <p className="font-medium">{formatDate(request.created_at)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Statut
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
              <CardDescription>Gérer cette demande</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getActionButtons(request.status)}
            </CardContent>
          </Card>
        </div>
        
        <RequestItemsTable 
          items={request.request_items || []}
          totalAmount={request.total_estimated_cost || 0}
        />
        
        {/* Approval modals */}
        <ApprovalModal 
          isOpen={approvalMode === 'approve'}
          onClose={() => setApprovalMode(null)}
          onSubmit={handleApprovalSubmit}
          mode="approve"
          isLoading={approvalMutation.isPending}
        />
        
        <ApprovalModal 
          isOpen={approvalMode === 'reject'}
          onClose={() => setApprovalMode(null)}
          onSubmit={handleApprovalSubmit}
          mode="reject"
          isLoading={approvalMutation.isPending}
        />
        
        <ApprovalModal 
          isOpen={approvalMode === 'info'}
          onClose={() => setApprovalMode(null)}
          onSubmit={handleApprovalSubmit}
          mode="info"
          isLoading={approvalMutation.isPending}
        />
      </main>
    </div>
  );
};

export default RequestDetailPage;