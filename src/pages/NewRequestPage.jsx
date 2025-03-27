import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL, API_ENDPOINTS } from '../constants/api';
import Navbar from '../components/ui-components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Plus, Trash, Save } from 'lucide-react';
import LoadingSpinner from '../components/ui-components/LoadingSpinner';
import ErrorAlert from '../components/ui-components/ErrorAlert';

/**
 * Page component for creating a new purchase request
 * @returns {JSX.Element} New purchase request page component
 */
const NewRequestPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [justification, setJustification] = useState('');
  const [requestItems, setRequestItems] = useState([]);
  
  // State for form validation
  const [formErrors, setFormErrors] = useState({
    supplier: '',
    justification: '',
    items: ''
  });

  // Fetch suppliers list
  const { 
    data: suppliers = [],
    isLoading: suppliersLoading,
    error: suppliersError
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(
        `${BASE_API_URL}${API_ENDPOINTS.SUPPLIERS.GET_ALL}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    }
  });

  // Fetch all materials and filter by selected supplier
  const { 
    data: allMaterials = [],
    isLoading: materialsLoading,
    error: materialsError 
  } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(
        `${BASE_API_URL}${API_ENDPOINTS.MATERIALS.GET_ALL}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            page: 1,
            page_size: 100  // Adjust as needed based on expected total materials
          }
        }
      );
      return response.data.data || []; // Access the data property of the paginated response
    }
  });
  
  // Filter materials by selected supplier
  const materials = React.useMemo(() => {
    if (!selectedSupplier) return [];
    return allMaterials.filter(
      material => material.supplier_id === parseInt(selectedSupplier)
    );
  }, [allMaterials, selectedSupplier]);
  
  // Function to refetch materials
  const refetchMaterials = () => {
    queryClient.invalidateQueries({ queryKey: ['materials'] });
  };

  // Reset request items when supplier changes
  useEffect(() => {
    setRequestItems([]);
  }, [selectedSupplier]);

  // Add a new item to the request
  const addItem = (materialId) => {
    const material = materials.find(m => m.material_id === materialId);
    
    if (material) {
      setRequestItems([
        ...requestItems,
        {
          id: `temp-${Date.now()}`, // Temporary ID for UI purposes
          material_id: material.material_id,
          material_name: material.name,
          unit_price: material.unit_price,
          quantity: 1,
          estimated_cost: material.unit_price
        }
      ]);
    }
  };

  // Update item quantity and recalculate estimated cost
  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setRequestItems(requestItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          estimated_cost: item.unit_price * newQuantity
        };
      }
      return item;
    }));
  };

  // Remove an item from the request
  const removeItem = (itemId) => {
    setRequestItems(requestItems.filter(item => item.id !== itemId));
  };

  // Calculate total estimated cost
  const totalEstimatedCost = requestItems.reduce(
    (sum, item) => sum + parseFloat(item.estimated_cost || 0),
    0
  );

  // Format currency in French locale
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  // Submit purchase request mutation
  const submitRequest = useMutation({
    mutationFn: async (requestData) => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
    const response = await axios.post(
      `${BASE_API_URL}${API_ENDPOINTS.PURCHASE_REQUESTS.CREATE}`, 
      {
        ...requestData,
        token: token
      },
      {
        headers: {
        'Content-Type': 'application/json'
        }
      }
    );
      return response.data;
    },
    onSuccess: () => {
      navigate('/orders', { state: { message: "Demande d'achat créée avec succès!" } });
    },
    onError: (error) => {
      console.error("Error submitting purchase request:", error);
      alert(`Erreur lors de la création de la demande: ${error.message || "Veuillez réessayer"}`);
    }
  });

  // Form submission handling
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    let valid = true;
    const errors = {
      supplier: '',
      justification: '',
      items: ''
    };
    
    if (!selectedSupplier) {
      errors.supplier = 'Veuillez sélectionner un fournisseur';
      valid = false;
    }
    
    if (!justification.trim()) {
      errors.justification = 'La justification est requise';
      valid = false;
    }
    
    if (requestItems.length === 0) {
      errors.items = 'Veuillez ajouter au moins un article à la demande';
      valid = false;
    }
    
    setFormErrors(errors);
    
    if (!valid) return;
    
    // Create request data object for API
    const requestData = {
      supplier_id: parseInt(selectedSupplier),
      justification: justification.trim(),
      items: requestItems.map(item => ({
        material_id: item.material_id,
        quantity: item.quantity,
        estimated_cost: parseFloat(item.estimated_cost).toFixed(2)
      }))
    };
    
    // Submit the request to the API
    submitRequest.mutate(requestData);
  };

  // Page title effect
  useEffect(() => {
    document.title = "Nouvelle demande d'achat - EnterpriseFlow";
  }, []);

  // Main render
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div>
          <Link to="/orders">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux demandes
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Nouvelle demande d'achat</h1>
          </div>
          
          <Separator className="my-6" />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
              <CardDescription>
                Sélectionnez un fournisseur et fournissez une justification pour cette demande
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="supplier">Fournisseur</Label>
                <Select
                  value={selectedSupplier}
                  onValueChange={setSelectedSupplier}
                >
                  <SelectTrigger id="supplier" className="w-full">
                    <SelectValue placeholder="Sélectionnez un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem 
                        key={supplier.supplier_id} 
                        value={supplier.supplier_id.toString()}
                      >
                        {supplier.supplier_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.supplier && 
                  <p className="text-sm text-red-500">{formErrors.supplier}</p>
                }
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="justification">Justification</Label>
                <Textarea
                  id="justification"
                  placeholder="Expliquez la raison de cette demande d'achat..."
                  rows={4}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="resize-none"
                />
                {formErrors.justification && 
                  <p className="text-sm text-red-500">{formErrors.justification}</p>
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Articles demandés</CardTitle>
              <CardDescription>
                Ajoutez les articles que vous souhaitez commander
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedSupplier ? (
                <>
                  {materialsLoading ? (
                    <LoadingSpinner text="Chargement des articles disponibles..." />
                  ) : materialsError ? (
                    <ErrorAlert 
                      title="Erreur" 
                      message="Impossible de charger les articles de ce fournisseur."
                      onRetry={refetchMaterials}
                    />
                  ) : (
                    <div className="space-y-6">
                      <div className="border rounded-md p-4 bg-muted/10">
                        <h3 className="font-medium mb-3">Articles disponibles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {materials.map(material => (
                            <div
                              key={material.material_id}
                              className="p-3 border rounded-lg flex flex-col justify-between bg-card"
                            >
                              <div>
                                <p className="font-medium">{material.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {material.category} • Stock: {material.stock_available}
                                </p>
                                <p className="text-sm font-medium mt-1">
                                  {formatCurrency(material.unit_price)}
                                </p>
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => addItem(material.material_id)}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Ajouter
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Articles sélectionnés</h3>
                        {requestItems.length > 0 ? (
                          <div className="border rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                              <thead className="bg-muted/50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                    Article
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                                    Prix unitaire
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                                    Quantité
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                                    Total estimé
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-card divide-y divide-border">
                                {requestItems.map(item => (
                                  <tr key={item.id} className="hover:bg-muted/20">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium">{item.material_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                      <div className="text-sm">{formatCurrency(item.unit_price)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center justify-center space-x-2">
                                        <Button 
                                          type="button"
                                          variant="outline" 
                                          size="icon" 
                                          className="h-7 w-7"
                                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                        >
                                          -
                                        </Button>
                                        <Input 
                                          type="number" 
                                          value={item.quantity} 
                                          min="1"
                                          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                                          className="w-16 text-center h-7"
                                        />
                                        <Button 
                                          type="button"
                                          variant="outline" 
                                          size="icon" 
                                          className="h-7 w-7"
                                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                        >
                                          +
                                        </Button>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                      <div className="text-sm font-medium">
                                        {formatCurrency(item.estimated_cost)}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                      <Button
                                        type="button" 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => removeItem(item.id)}
                                        className="h-7 w-7 text-destructive"
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-muted/20 font-medium">
                                  <td className="px-6 py-4 text-right" colSpan={3}>
                                    Total estimé:
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    {formatCurrency(totalEstimatedCost)}
                                  </td>
                                  <td></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8 border rounded-md text-muted-foreground">
                            <p>Aucun article sélectionné</p>
                            <p className="text-sm">Veuillez ajouter des articles à votre demande en utilisant les boutons "Ajouter" ci-dessus</p>
                          </div>
                        )}
                        
                        {formErrors.items && 
                          <p className="text-sm text-red-500 mt-2">{formErrors.items}</p>
                        }
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 border rounded-md text-muted-foreground">
                  <p>Veuillez d'abord sélectionner un fournisseur</p>
                  <p className="text-sm">Les articles disponibles s'afficheront ensuite ici</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/orders')}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={
                !selectedSupplier || 
                !justification.trim() || 
                requestItems.length === 0
              }
            >
              <Save className="h-4 w-4 mr-2" />
              Soumettre la demande
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewRequestPage;