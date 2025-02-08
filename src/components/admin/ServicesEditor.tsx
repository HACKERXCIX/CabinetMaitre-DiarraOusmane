
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash, Plus, Save, X } from "lucide-react";

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
  const [newService, setNewService] = useState<Partial<Service>>({
    title: "",
    description: [""],
    icon_name: "",
  });

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

  const handleAddService = async () => {
    try {
      if (!newService.title || !newService.icon_name || !newService.description) {
        toast.error("Veuillez remplir tous les champs");
        return;
      }

      const { error } = await supabase.from("services").insert([
        {
          title: newService.title,
          description: newService.description,
          icon_name: newService.icon_name,
        },
      ]);

      if (error) throw error;

      toast.success("Service ajouté avec succès");
      setIsAdding(false);
      setNewService({ title: "", description: [""], icon_name: "" });
      loadServices();
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout du service: " + error.message);
    }
  };

  const handleUpdateService = async (service: Service) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({
          title: service.title,
          description: service.description,
          icon_name: service.icon_name,
        })
        .eq("id", service.id);

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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <Input
                  value={newService.title}
                  onChange={(e) =>
                    setNewService({ ...newService, title: e.target.value })
                  }
                  placeholder="Titre du service"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom de l'icône
                </label>
                <Input
                  value={newService.icon_name}
                  onChange={(e) =>
                    setNewService({ ...newService, icon_name: e.target.value })
                  }
                  placeholder="Nom de l'icône (ex: scale, house, etc.)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description (une ligne par point)
                </label>
                <Textarea
                  value={newService.description?.join("\n")}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  placeholder="Description du service (un point par ligne)"
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewService({ title: "", description: [""], icon_name: "" });
                  }}
                >
                  <X className="mr-2 h-4 w-4" /> Annuler
                </Button>
                <Button onClick={handleAddService}>
                  <Save className="mr-2 h-4 w-4" /> Enregistrer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {editingService?.id === service.id ? (
                  <Input
                    value={editingService.title}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        title: e.target.value,
                      })
                    }
                  />
                ) : (
                  <span>{service.title}</span>
                )}
                <div className="flex gap-2">
                  {editingService?.id === service.id ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setEditingService(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleUpdateService(editingService)}>
                        <Save className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setEditingService({ ...service })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingService?.id === service.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nom de l'icône
                    </label>
                    <Input
                      value={editingService.icon_name}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          icon_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      value={editingService.description.join("\n")}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          description: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                      rows={5}
                    />
                  </div>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-2">
                  {service.description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesEditor;
