
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PropertyFormProps {
  onSuccess?: () => void;
}

const PropertyForm = ({ onSuccess }: PropertyFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [videos, setVideos] = useState<FileList | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const imageUrls: string[] = [];
      const videoUrls: string[] = [];

      // Upload images
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

      // Upload videos
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

      // Insert property data
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
        images: imageUrls,
        videos: videoUrls,
      };

      const { error } = await supabase
        .from('properties')
        .insert(propertyData);

      if (error) throw error;

      toast.success('Bien immobilier ajouté avec succès');
      formRef.current?.reset();
      setImages(null);
      setVideos(null);
      onSuccess?.();
    } catch (error: any) {
      toast.error('Erreur lors de l\'ajout du bien: ' + error.message);
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
            <option value="maison">Maison</option>
            <option value="appartement">Appartement</option>
            <option value="terrain">Terrain</option>
            <option value="commerce">Commerce</option>
            <option value="bureau">Bureau</option>
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
          <Label htmlFor="images">Images</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />
        </div>

        <div>
          <Label htmlFor="videos">Vidéos</Label>
          <Input
            id="videos"
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => setVideos(e.target.files)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Ajout en cours..." : "Ajouter le bien"}
      </Button>
    </form>
  );
};

export default PropertyForm;
