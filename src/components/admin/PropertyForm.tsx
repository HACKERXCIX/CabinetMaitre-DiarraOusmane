
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import BasicFields from "./properties/BasicFields";
import AdditionalFields from "./properties/AdditionalFields";
import MediaUpload from "./properties/MediaUpload";
import { PropertyFormProps, PropertyType } from "./properties/types";

const PropertyForm = ({ property, onSuccess }: PropertyFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [videos, setVideos] = useState<FileList | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
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
      
      const fields = [
        'title', 'description', 'type', 'property_type', 'price',
        'location', 'surface', 'rooms', 'architecture_style'
      ];

      fields.forEach(field => {
        const element = elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (element) {
          const value = property[field as keyof typeof property];
          if (value !== null && value !== undefined) {
            element.value = String(value);
          }
        }
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const imageUrls: string[] = [];
      const videoUrls: string[] = [];

      const uploadFiles = async (files: FileList | null, folder: string) => {
        const urls: string[] = [];
        if (files) {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `properties/${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('property_media')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
              .from('property_media')
              .getPublicUrl(filePath);

            urls.push(data.publicUrl);
          }
        }
        return urls;
      };

      const [newImageUrls, newVideoUrls] = await Promise.all([
        uploadFiles(images, 'images'),
        uploadFiles(videos, 'videos')
      ]);

      imageUrls.push(...newImageUrls);
      videoUrls.push(...newVideoUrls);

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

      const { error } = property?.id
        ? await supabase.from('properties').update(propertyData).eq('id', property.id)
        : await supabase.from('properties').insert(propertyData);

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
        <BasicFields propertyTypes={propertyTypes} />
        <AdditionalFields />

        <MediaUpload
          type="images"
          files={images}
          onFilesChange={setImages}
          existingFiles={property?.images}
          property={property}
        />

        <MediaUpload
          type="videos"
          files={videos}
          onFilesChange={setVideos}
          existingFiles={property?.videos}
          property={property}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Traitement en cours..." : property?.id ? "Modifier le bien" : "Ajouter le bien"}
      </Button>
    </form>
  );
};

export default PropertyForm;
