
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id?: string;
  title: string;
  description: string;
  type: string;
  property_type: string;
  price: number;
  location: string;
  surface: number;
  rooms: number | null;
  architecture_style: string | null;
  images: string[];
  videos: string[];
}

interface PropertyType {
  id: string;
  name: string;
}

interface PropertyFormProps {
  property?: Property;
  onSuccess?: () => void;
}

const PropertyForm = ({ property, onSuccess }: PropertyFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [videos, setVideos] = useState<FileList | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Charger les types de biens
    const loadPropertyTypes = async () => {
      const { data, error } = await supabase
        .from("property_types")
        .select("*")
        .is("deleted_at", null)
        .order("name");

      if (error) {
        toast.error("Erreur lors du chargement des types de biens");
      } else {
        setPropertyTypes(data || []);
      }
    };

    loadPropertyTypes();
  }, []);

  useEffect(() => {
    if (property && formRef.current) {
      const form = formRef.current;
      const elements = form.elements as HTMLFormControlsCollection;
      
      // Type assertion to access form elements
      const titleInput = elements.namedItem('title') as HTMLInputElement;
      const descriptionInput = elements.namedItem('description') as HTMLTextAreaElement;
      const typeInput = elements.namedItem('type') as HTMLSelectElement;
      const propertyTypeInput = elements.namedItem('property_type') as HTMLSelectElement;
      const priceInput = elements.namedItem('price') as HTMLInputElement;
      const locationInput = elements.namedItem('location') as HTMLInputElement;
      const surfaceInput = elements.namedItem('surface') as HTMLInputElement;
      const roomsInput = elements.namedItem('rooms') as HTMLInputElement;
      const architectureStyleInput = elements.namedItem('architecture_style') as HTMLInputElement;

      // Set values safely
      if (titleInput) titleInput.value = property.title;
      if (descriptionInput) descriptionInput.value = property.description;
      if (typeInput) typeInput.value = property.type;
      if (propertyTypeInput) propertyTypeInput.value = property.property_type;
      if (priceInput) priceInput.value = property.price.toString();
      if (locationInput) locationInput.value = property.location;
      if (surfaceInput) surfaceInput.value = property.surface.toString();
      if (roomsInput && property.rooms) roomsInput.value = property.rooms.toString();
      if (architectureStyleInput && property.architecture_style) {
        architectureStyleInput.value = property.architecture_style;
      }
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const imageUrls: string[] = [];
      const videoUrls: string[] = [];

      // Upload new images if any
      if (images) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `properties/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('property_media')
            .upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }

          const { data } = supabase.storage
            .from('property_media')
            .getPublicUrl(filePath);

          imageUrls.push(data.publicUrl);
        }
      }

      // Upload new videos if any
      if (videos) {
        for (let i = 0; i < videos.length; i++) {
          const file = videos[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `properties/videos/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('property_media')
            .upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }

          const { data } = supabase.storage
            .from('property_media')
            .getPublicUrl(filePath);

          videoUrls.push(data.publicUrl);
        }
      }

      const propertyData = {
        title: String(formData.get('title')),
        description: String(formData.get('description')),
        type: String(formData.get('type')),
        property_type: String(formData.get('property_type')),
        price: Number(formData.get('price')),
        location: String(formData.get('location')),
        surface: Number(formData.get('surface')),
        rooms: formData.get('rooms') ? Number(formData.get('rooms')) : null,
        architecture_style: formData.get('architecture_style') ? String(formData.get('architecture_style')) : null,
        images: imageUrls.length > 0 ? imageUrls : (property?.images || []),
        videos: videoUrls.length > 0 ? videoUrls : (property?.videos || []),
      };

      let error;

      if (property?.id) {
        // Mise à jour d'une propriété existante
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id);
        error = updateError;
      } else {
        // Création d'une nouvelle propriété
        const { error: insertError } = await supabase
          .from('properties')
          .insert(propertyData);
        error = insertError;
      }

      if (error) throw error;

      toast.success(property?.id ? 'Bien immobilier modifié avec succès' : 'Bien immobilier ajouté avec succès');
      formRef.current?.reset();
      setImages(null);
      setVideos(null);
      onSuccess?.();
    } catch (error: any) {
      toast.error('Erreur lors de l\'opération: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" required />
        </div>

        <div>
          <Label htmlFor="type">Type d'annonce</Label>
          <select
            id="type"
            name="type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="vente">Vente</option>
            <option value="location">Location</option>
          </select>
        </div>

        <div>
          <Label htmlFor="property_type">Type de bien</Label>
          <select
            id="property_type"
            name="property_type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            {propertyTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="price">Prix</Label>
          <Input type="number" id="price" name="price" required />
        </div>

        <div>
          <Label htmlFor="surface">Surface (m²)</Label>
          <Input type="number" id="surface" name="surface" required />
        </div>

        <div>
          <Label htmlFor="rooms">Nombre de pièces</Label>
          <Input type="number" id="rooms" name="rooms" />
        </div>

        <div>
          <Label htmlFor="location">Localisation</Label>
          <Input id="location" name="location" required />
        </div>

        <div>
          <Label htmlFor="architecture_style">Style architectural</Label>
          <Input id="architecture_style" name="architecture_style" />
        </div>

        <div>
          <Label htmlFor="images">Images {property && "(laissez vide pour conserver les images existantes)"}</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />
          {property && property.images.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="videos">Vidéos {property && "(laissez vide pour conserver les vidéos existantes)"}</Label>
          <Input
            id="videos"
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => setVideos(e.target.files)}
          />
          {property && property.videos && property.videos.length > 0 && (
            <div className="mt-2">
              {property.videos.length} vidéo(s) existante(s)
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Traitement en cours..." : property?.id ? "Modifier le bien" : "Ajouter le bien"}
      </Button>
    </form>
  );
};

export default PropertyForm;
