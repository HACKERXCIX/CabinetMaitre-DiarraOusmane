import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyForm from "@/components/admin/PropertyForm";
import VisitsChart from "@/components/admin/VisitsChart";
import MenuEditor from "@/components/admin/MenuEditor";
import AppointmentsList from "@/components/admin/AppointmentsList";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ServicesEditor from "@/components/admin/ServicesEditor";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  deleted_at: string | null;
  description: string;
  type: string;
  property_type: string;
  surface: number;
  rooms: number | null;
  architecture_style: string | null;
  images: string[];
  videos: string[];
}

interface VisitStat {
  visited_at: string;
}

interface PropertySearchStat {
  id: string;
  property_id: string;
  search_date: string;
  search_type: string;
  architecture_preference: string | null;
  location_preference: string | null;
  price_range_min: number | null;
  price_range_max: number | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);

  // Vérifier si l'utilisateur est admin
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ["checkAdmin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('has_role', {
        _role: 'admin'
      });
      if (error) throw error;
      return data;
    }
  });

  // Statistiques des visites
  const { data: visitStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["visitStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_visits')
        .select('*');
      if (error) throw error;
      return data as VisitStat[];
    }
  });

  // Statistiques des recherches immobilières
  const { data: propertySearchStats } = useQuery({
    queryKey: ["propertySearchStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_search_stats')
        .select(`
          *,
          property:properties(title, location, price)
        `);
      if (error) throw error;
      return data;
    }
  });

  // Charger les propriétés
  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des biens: ' + error.message);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Supprimer une propriété (soft delete)
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast.success('Bien supprimé avec succès');
      loadProperties();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression: ' + error.message);
    }
  };

  // Formater les données pour les graphiques
  const formatVisitData = (visits: VisitStat[] = []) => {
    return visits.reduce((acc: { name: string; visits: number }[], visit) => {
      const date = new Date(visit.visited_at).toLocaleDateString();
      const existing = acc.find(item => item.name === date);
      if (existing) {
        existing.visits += 1;
      } else {
        acc.push({ name: date, visits: 1 });
      }
      return acc;
    }, []);
  };

  // Formater les données des recherches immobilières
  const formatPropertySearchData = () => {
    if (!propertySearchStats) return [];
    
    const locationStats = propertySearchStats.reduce((acc: any, stat) => {
      if (stat.location_preference) {
        acc[stat.location_preference] = (acc[stat.location_preference] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(locationStats).map(([name, count]) => ({
      name,
      count,
    }));
  };

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      }
    });
  }, [navigate]);

  // Rediriger si l'utilisateur n'est pas admin
  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) {
      navigate('/');
      toast.error("Accès non autorisé");
    }
  }, [isAdmin, isCheckingAdmin, navigate]);

  if (isCheckingAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto mt-16">
        <h1 className="text-3xl font-bold mb-8">Administration</h1>
        
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList>
            <TabsTrigger value="properties">Biens Immobiliers</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="menus">Menus</TabsTrigger>
            <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedProperty ? "Modifier un bien" : "Ajouter un bien"}
              </h2>
              <PropertyForm 
                property={selectedProperty} 
                onSuccess={() => {
                  loadProperties();
                  setSelectedProperty(undefined);
                }} 
              />
              {selectedProperty && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSelectedProperty(undefined)}
                >
                  Annuler la modification
                </Button>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Biens existants</h2>
              <div className="grid gap-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{property.title}</h3>
                      <p className="text-sm text-gray-600">
                        {property.location} - {property.price.toLocaleString()} FCFA
                      </p>
                      <p className="text-sm text-gray-600">
                        {property.surface} m² - {property.rooms || 0} pièces
                      </p>
                      {property.images.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {property.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${property.title} - Image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(property)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(property.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="space-y-6">
              <VisitsChart
                data={formatVisitData(visitStats)}
                title="Visites du site"
              />
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Statistiques des recherches immobilières</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Localisations les plus recherchées</h3>
                    <div className="space-y-2">
                      {formatPropertySearchData().map((stat: any) => (
                        <div key={stat.name} className="flex justify-between items-center">
                          <span>{stat.name}</span>
                          <span className="font-semibold">{stat.count} recherches</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Types de recherche</h3>
                    <div className="space-y-2">
                      {propertySearchStats?.reduce((acc: any, stat) => {
                        acc[stat.search_type] = (acc[stat.search_type] || 0) + 1;
                        return acc;
                      }, {}) && Object.entries(propertySearchStats?.reduce((acc: any, stat) => {
                        acc[stat.search_type] = (acc[stat.search_type] || 0) + 1;
                        return acc;
                      }, {})).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="capitalize">{type}</span>
                          <span className="font-semibold">{String(count)} recherches</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="bg-white rounded-lg shadow p-6">
              <ServicesEditor />
            </div>
          </TabsContent>

          <TabsContent value="menus">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Gestion des menus</h2>
              <MenuEditor />
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Gestion des rendez-vous</h2>
              <AppointmentsList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
