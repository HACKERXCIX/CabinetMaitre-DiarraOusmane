
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import PropertyForm from "@/components/admin/PropertyForm";
import { toast } from "sonner";

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
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(
    undefined
  );

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

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
                <Button variant="outline" onClick={() => handleEdit(property)}>
                  Modifier
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(property.id)}>
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesTab;
