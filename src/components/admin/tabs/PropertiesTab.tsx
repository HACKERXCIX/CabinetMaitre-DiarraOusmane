
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import PropertyForm from "@/components/admin/PropertyForm";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const PropertiesTab = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<"active" | "deleted" | "all">("active");

  useEffect(() => {
    loadProperties();
  }, [filterStatus]);

  const loadProperties = async () => {
    try {
      let query = supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus === "active") {
        query = query.is("deleted_at", null);
      } else if (filterStatus === "deleted") {
        query = query.not("deleted_at", "is", null);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des biens: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("properties")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Bien supprimé avec succès");
      loadProperties();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression: " + error.message);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const { error } = await supabase
        .from("properties")
        .update({ deleted_at: null })
        .eq("id", id);

      if (error) throw error;
      toast.success("Bien restauré avec succès");
      loadProperties();
    } catch (error: any) {
      toast.error("Erreur lors de la restauration: " + error.message);
    }
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div className="space-y-6">
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Biens existants</h2>
          <Select value={filterStatus} onValueChange={(value: "active" | "deleted" | "all") => setFilterStatus(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="deleted">Supprimés</SelectItem>
              <SelectItem value="all">Tous</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className={`p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between ${
                property.deleted_at ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{property.title}</h3>
                  {property.deleted_at && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                      Supprimé le {new Date(property.deleted_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {property.location} - {property.price.toLocaleString()} FCFA
                </p>
                <p className="text-sm text-gray-600">
                  {property.surface} m² - {property.rooms || 0} pièces
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Type: {property.type} - {property.property_type}
                </p>
                {property.architecture_style && (
                  <p className="text-sm text-gray-600">
                    Style architectural: {property.architecture_style}
                  </p>
                )}
                {property.images.length > 0 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto">
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
                {property.videos && property.videos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {property.videos.length} vidéo(s) disponible(s)
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" onClick={() => handleEdit(property)}>
                  Modifier
                </Button>
                {property.deleted_at ? (
                  <Button
                    variant="outline"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleRestore(property.id)}
                  >
                    Restaurer
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(property.id)}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesTab;
