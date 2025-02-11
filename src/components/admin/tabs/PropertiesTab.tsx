
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProperties();
  }, [filterStatus]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("properties")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Bien supprimé avec succès");
      loadProperties();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("properties")
        .update({ deleted_at: null })
        .eq("id", id);

      if (error) throw error;
      toast.success("Bien restauré avec succès");
      loadProperties();
    } catch (error: any) {
      toast.error("Erreur lors de la restauration: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    // Scroll to the top where the form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                property.deleted_at ? "bg-gray-50" : "hover:bg-gray-50 transition-colors"
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
                <Button 
                  variant="outline" 
                  onClick={() => handleEdit(property)}
                  disabled={isLoading}
                  className="hover:bg-primary hover:text-white transition-colors"
                >
                  Modifier
                </Button>
                {property.deleted_at ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                        disabled={isLoading}
                      >
                        Restaurer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Restaurer ce bien ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action va rendre le bien à nouveau visible sur le site.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRestore(property.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Restaurer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={isLoading}
                        className="hover:bg-red-700 transition-colors"
                      >
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce bien ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action masquera le bien du site. Vous pourrez le restaurer plus tard.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(property.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
