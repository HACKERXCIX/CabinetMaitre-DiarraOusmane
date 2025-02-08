
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServicesEditor from "@/components/admin/ServicesEditor";
import MenuEditor from "@/components/admin/MenuEditor";
import AppointmentsList from "@/components/admin/AppointmentsList";
import PropertiesTab from "@/components/admin/tabs/PropertiesTab";
import StatsTab from "@/components/admin/tabs/StatsTab";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();

  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ["checkAdmin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_role", {
        _role: "admin",
      });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  // Rediriger si l'utilisateur n'est pas admin
  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) {
      navigate("/");
      toast.error("Accès non autorisé");
    }
  }, [isAdmin, isCheckingAdmin, navigate]);

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

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

          <TabsContent value="properties">
            <PropertiesTab />
          </TabsContent>

          <TabsContent value="stats">
            <StatsTab />
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
              <h2 className="text-xl font-semibold mb-4">
                Gestion des rendez-vous
              </h2>
              <AppointmentsList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
