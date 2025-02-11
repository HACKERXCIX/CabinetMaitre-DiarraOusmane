
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PropertyType {
  id: string;
  name: string;
  deleted_at: string | null;
}

const PropertyTypesTab = () => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [newTypeName, setNewTypeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadPropertyTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("property_types")
        .select("*")
        .is("deleted_at", null)
        .order("name");

      if (error) throw error;
      setPropertyTypes(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des types de biens: " + error.message);
    }
  };

  useEffect(() => {
    loadPropertyTypes();
  }, []);

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("property_types")
        .insert([{ name: newTypeName.trim() }]);

      if (error) throw error;

      toast.success("Type de bien ajouté avec succès");
      setNewTypeName("");
      loadPropertyTypes();
    } catch (error: any) {
      toast.error("Erreur lors de l'ajout: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("property_types")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      toast.success("Type de bien supprimé avec succès");
      loadPropertyTypes();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Ajouter un type de bien</h2>
        <form onSubmit={handleAddType} className="flex gap-4">
          <Input
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="Nom du type de bien"
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !newTypeName.trim()}>
            {isLoading ? "Ajout..." : "Ajouter"}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Types de biens existants</h2>
        <div className="space-y-4">
          {propertyTypes.map((type) => (
            <div
              key={type.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <span>{type.name}</span>
              <Button
                variant="destructive"
                onClick={() => handleDelete(type.id)}
              >
                Supprimer
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyTypesTab;
