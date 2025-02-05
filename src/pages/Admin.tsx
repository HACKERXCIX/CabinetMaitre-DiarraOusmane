
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

const Admin = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);

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
      return data;
    }
  });

  // Charger les propriétés
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur lors du chargement des biens');
      return;
    }

    setProperties(data || []);
  };

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
    }
  }, [isAdmin, isCheckingAdmin, navigate]);

  if (isCheckingAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  // Formater les données pour les graphiques
  const formatVisitData = (visits: any[]) => {
    return visits?.reduce((acc: any[], visit: any) => {
      const date = new Date(visit.visited_at).toLocaleDateString();
      const existing = acc.find(item => item.name === date);
      if (existing) {
        existing.visits += 1;
      } else {
        acc.push({ name: date, visits: 1 });
      }
      return acc;
    }, []) || [];
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto mt-16">
        <h1 className="text-3xl font-bold mb-8">Administration</h1>
        
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList>
            <TabsTrigger value="properties">Biens Immobiliers</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="menus">Menus</TabsTrigger>
            <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Ajouter un bien</h2>
              <PropertyForm onSuccess={loadProperties} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Biens existants</h2>
              <div className="grid gap-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{property.title}</h3>
                      <p className="text-sm text-gray-600">
                        {property.location} - {property.price} FCFA
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(property.id)}
                    >
                      Supprimer
                    </Button>
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
              {/* Ajoutez d'autres graphiques ici selon les besoins */}
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
