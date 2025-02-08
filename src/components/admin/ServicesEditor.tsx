
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceForm from "./services/ServiceForm";
import ServiceItem from "./services/ServiceItem";

interface Service {
  id: string;
  title: string;
  description: string[];
  icon_name: string;
}

const ServicesEditor = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des services: " + error.message);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleAddService = async (formData: { title: string; description: string[]; icon_name: string }) => {
    try {
      if (!formData.title || !formData.icon_name || !formData.description) {
        toast.error("Veuillez remplir tous les champs");
        return;
      }

      const { error } = await supabase.from("services").insert([formData]);

      if (error) throw error;

      toast.success("Service ajouté avec succès");
      setIsAdding(false);
      loadServices();
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout du service: " + error.message);
    }
  };

  const handleUpdateService = async (formData: { title: string; description: string[]; icon_name: string }) => {
    try {
      if (!editingService) return;

      const { error } = await supabase
        .from("services")
        .update(formData)
        .eq("id", editingService.id);

      if (error) throw error;

      toast.success("Service mis à jour avec succès");
      setEditingService(null);
      loadServices();
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour du service: " + error.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      toast.success("Service supprimé avec succès");
      loadServices();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression du service: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Services</h2>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un service
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceForm
              onSubmit={handleAddService}
              onCancel={() => setIsAdding(false)}
            />
          </CardContent>
        </Card>
      )}

      {editingService && (
        <Card>
          <CardHeader>
            <CardTitle>Modifier le Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceForm
              initialData={editingService}
              onSubmit={handleUpdateService}
              onCancel={() => setEditingService(null)}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {services.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            onEdit={setEditingService}
            onDelete={handleDeleteService}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesEditor;
