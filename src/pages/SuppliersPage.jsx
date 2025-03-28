// filepath: /Users/krishna/Dev/codegany/codegany_app_frontend/src/pages/SuppliersPage.jsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL, API_ENDPOINTS } from '../constants/api';
import Navbar from '../components/ui-components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Plus, Edit, Trash, Save, Loader2, Package, ShoppingBag, ShieldAlert } from 'lucide-react';
import LoadingSpinner from '../components/ui-components/LoadingSpinner';
import ErrorAlert from '../components/ui-components/ErrorAlert';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthHooks';
import { useAISummary } from '../hooks/useAISummary';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import AISummaryCard from '../components/ui-components/AISummaryCard';

/**
 * Page component for managing suppliers and their materials
 * @returns {JSX.Element} Suppliers management page component
 */
const SuppliersPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const { generateInsights } = useAISummary();
  
  // Check if user has logistics role (can edit) or finance role (view only)
  const canEdit = user?.role === 'logistique';

  // States for add supplier modal
  const [isAddSupplierDialogOpen, setIsAddSupplierDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    supplier_name: '',
    supplier_description: '',
    supplier_email: ''
  });

  // States for add material modal
  const [isAddMaterialDialogOpen, setIsAddMaterialDialogOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    category: '',
    unit_price: '',
    stock_available: ''
  });

  // Fetch suppliers list
  const { 
    data: suppliers = [],
    isLoading: suppliersLoading,
    error: suppliersError,
    refetch: refetchSuppliers
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
    error: materialsError,
    refetch: refetchMaterials
  } = useQuery({
    queryKey: ['materials', selectedSupplier],
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
            page_size: 100
          }
        }
      );
      return response.data.data || [];
    },
    enabled: !!selectedSupplier
  });
  
  // Filter materials by selected supplier
  const materials = React.useMemo(() => {
    if (!selectedSupplier) return [];
    return allMaterials.filter(
      material => material.supplier_id === parseInt(selectedSupplier)
    );
  }, [allMaterials, selectedSupplier]);

  // Create supplier mutation
  const createSupplierMutation = useMutation({
    mutationFn: async (supplierData) => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(
        `${BASE_API_URL}${API_ENDPOINTS.SUPPLIERS.CREATE}`,
        {
          ...supplierData,
          token: token
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setIsAddSupplierDialogOpen(false);
      setNewSupplier({
        supplier_name: '',
        supplier_description: '',
        supplier_email: ''
      });
      queryClient.invalidateQueries(['suppliers']);
      toast.success('Fournisseur ajouté avec succès');
    },
    onError: (error) => {
      console.error("Error creating supplier:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
    }
  });

  // Create material mutation
  const createMaterialMutation = useMutation({
    mutationFn: async (materialData) => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(
        `${BASE_API_URL}${API_ENDPOINTS.MATERIALS.CREATE}`,
        {
          ...materialData,
          token: token
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setIsAddMaterialDialogOpen(false);
      setNewMaterial({
        name: '',
        category: '',
        unit_price: '',
        stock_available: ''
      });
      queryClient.invalidateQueries(['materials', selectedSupplier]);
      toast.success('Article ajouté avec succès');
    },
    onError: (error) => {
      console.error("Error creating material:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
    }
  });

  // Handle supplier form submission
  const handleSubmitSupplier = (e) => {
    e.preventDefault();
    createSupplierMutation.mutate(newSupplier);
  };

  // Handle material form submission
  const handleSubmitMaterial = (e) => {
    e.preventDefault();
    
    if (!selectedSupplier) {
      toast.error('Veuillez d\'abord sélectionner un fournisseur');
      return;
    }

    const materialData = {
      ...newMaterial,
      supplier_id: parseInt(selectedSupplier),
      unit_price: parseFloat(newMaterial.unit_price),
      stock_available: parseInt(newMaterial.stock_available)
    };
    
    createMaterialMutation.mutate(materialData);
  };

  // Format currency in French locale
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  // Page title effect
  useEffect(() => {
    document.title = "Gestion des fournisseurs - EnterpriseFlow";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Gestion des fournisseurs</h1>
            
            {!canEdit && (
              <Alert className="bg-amber-50 text-amber-800 border-amber-200 mb-4">
                <ShieldAlert className="h-4 w-4 mr-2" />
                <AlertTitle>Mode consultation</AlertTitle>
                <AlertDescription>
                  En tant que direction financière, vous disposez d'un accès en lecture seule à cette page.
                </AlertDescription>
              </Alert>
            )}
            
            {canEdit && (
              <div className="flex flex-wrap gap-3">
                <Dialog open={isAddSupplierDialogOpen} onOpenChange={setIsAddSupplierDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau fournisseur
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un fournisseur</DialogTitle>
                      <DialogDescription>
                        Créez un nouveau fournisseur en remplissant le formulaire ci-dessous.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitSupplier}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="supplier_name">Nom du fournisseur*</Label>
                          <Input 
                            id="supplier_name"
                            value={newSupplier.supplier_name}
                            onChange={(e) => setNewSupplier({...newSupplier, supplier_name: e.target.value})}
                            placeholder="Nom du fournisseur"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="supplier_email">Email</Label>
                          <Input 
                            id="supplier_email"
                            type="email"
                            value={newSupplier.supplier_email}
                            onChange={(e) => setNewSupplier({...newSupplier, supplier_email: e.target.value})}
                            placeholder="email@fournisseur.com"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="supplier_description">Description</Label>
                          <Textarea 
                            id="supplier_description"
                            value={newSupplier.supplier_description}
                            onChange={(e) => setNewSupplier({...newSupplier, supplier_description: e.target.value})}
                            placeholder="Description du fournisseur"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddSupplierDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit" disabled={createSupplierMutation.isPending || !newSupplier.supplier_name.trim()}>
                          {createSupplierMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Création...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Enregistrer
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                
                {selectedSupplier && (
                  <Dialog open={isAddMaterialDialogOpen} onOpenChange={setIsAddMaterialDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvel article
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter un article</DialogTitle>
                        <DialogDescription>
                          Ajoutez un nouvel article pour le fournisseur sélectionné.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitMaterial}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Nom de l'article*</Label>
                            <Input 
                              id="name"
                              value={newMaterial.name}
                              onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                              placeholder="Nom de l'article"
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="category">Catégorie*</Label>
                            <Input 
                              id="category"
                              value={newMaterial.category}
                              onChange={(e) => setNewMaterial({...newMaterial, category: e.target.value})}
                              placeholder="Catégorie de l'article"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="unit_price">Prix unitaire*</Label>
                              <Input 
                                id="unit_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={newMaterial.unit_price}
                                onChange={(e) => setNewMaterial({...newMaterial, unit_price: e.target.value})}
                                placeholder="0.00"
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="stock_available">Stock disponible*</Label>
                              <Input 
                                id="stock_available"
                                type="number"
                                min="0"
                                value={newMaterial.stock_available}
                                onChange={(e) => setNewMaterial({...newMaterial, stock_available: e.target.value})}
                                placeholder="0"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsAddMaterialDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={
                              createMaterialMutation.isPending || 
                              !newMaterial.name.trim() || 
                              !newMaterial.category.trim() || 
                              !newMaterial.unit_price || 
                              !newMaterial.stock_available
                            }
                          >
                            {createMaterialMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Création...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Enregistrer
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </div>
          
          <Separator className="my-6" />
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Sélectionner un fournisseur</CardTitle>
              <CardDescription>
                Choisissez un fournisseur pour voir ses articles{canEdit ? " ou en ajouter de nouveaux" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suppliersLoading ? (
                <LoadingSpinner text="Chargement des fournisseurs..." />
              ) : suppliersError ? (
                <ErrorAlert 
                  title="Erreur" 
                  message="Impossible de charger la liste des fournisseurs." 
                  onRetry={refetchSuppliers} 
                />
              ) : (
                <div className="grid gap-4">
                  <Select
                    value={selectedSupplier}
                    onValueChange={setSelectedSupplier}
                  >
                    <SelectTrigger className="w-full">
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
                  
                  {selectedSupplier && suppliers.length > 0 && (
                    <div className="mt-4 p-4 bg-muted/10 rounded-md border">
                      <h3 className="font-medium mb-2">Détails du fournisseur</h3>
                      {(() => {
                        const supplier = suppliers.find(s => s.supplier_id.toString() === selectedSupplier);
                        return supplier ? (
                          <div className="space-y-2">
                            <p><span className="font-medium">Nom:</span> {supplier.supplier_name}</p>
                            {supplier.supplier_email && (
                              <p><span className="font-medium">Email:</span> {supplier.supplier_email}</p>
                            )}
                            {supplier.supplier_description && (
                              <p><span className="font-medium">Description:</span> {supplier.supplier_description}</p>
                            )}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedSupplier && materials && materials.length > 0 && (
            <AISummaryCard
              title="Analyse d'inventaire"
              description="Analyse IA des stocks et recommandations d'approvisionnement"
              onGenerate={() => generateInsights(materials)}
              data={materials}
            />
          )}
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Articles du fournisseur</CardTitle>
                <CardDescription>
                  {selectedSupplier 
                    ? "Liste des articles disponibles pour ce fournisseur" 
                    : "Veuillez sélectionner un fournisseur pour voir ses articles"}
                </CardDescription>
              </div>
              {canEdit && selectedSupplier && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddMaterialDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!selectedSupplier ? (
                <div className="text-center py-16 border rounded-md text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Veuillez d'abord sélectionner un fournisseur</p>
                  <p className="text-sm">Les articles disponibles s'afficheront ensuite ici</p>
                </div>
              ) : materialsLoading ? (
                <LoadingSpinner text="Chargement des articles..." />
              ) : materialsError ? (
                <ErrorAlert 
                  title="Erreur" 
                  message="Impossible de charger les articles de ce fournisseur." 
                  onRetry={refetchMaterials} 
                />
              ) : (
                <>
                  {materials.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {materials.map(material => (
                        <Card key={material.material_id} className="overflow-hidden">
                          <div className="bg-muted p-2 flex items-center justify-between">
                            <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10">
                              {material.category}
                            </span>
                            {canEdit && (
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium">{material.name}</h3>
                            <div className="mt-2 space-y-1 text-sm">
                              <p className="flex justify-between">
                                <span className="text-muted-foreground">Prix:</span>
                                <span className="font-medium">{formatCurrency(material.unit_price)}</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-muted-foreground">Stock:</span> 
                                <span className="font-medium">{material.stock_available} unités</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-muted-foreground">ID:</span>
                                <span>{material.material_id}</span>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 border rounded-md text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>Aucun article disponible pour ce fournisseur</p>
                      {canEdit && (
                        <p className="text-sm">
                          Utilisez le bouton "Ajouter" pour créer de nouveaux articles
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SuppliersPage;