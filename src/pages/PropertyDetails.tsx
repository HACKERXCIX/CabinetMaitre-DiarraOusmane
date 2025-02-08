
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  type: string;
  property_type: string;
  price: number;
  location: string;
  surface: number;
  rooms: number | null;
  description: string;
  images: string[];
  videos: string[];
  architecture_style: string | null;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setProperty(data);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails du bien: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    if (property && currentImageIndex < property.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} FCFA`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleVisitRequest = async () => {
    if (!selectedDate || !property) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date pour la visite.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.full_name || !formData.email || !formData.phone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          property_id: property.id,
          desired_date: selectedDate.toISOString(),
          status: 'pending',
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message || null
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Nous vous contacterons rapidement pour confirmer la visite.",
      });

      // Reset form
      setSelectedDate(undefined);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la demande: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-24">
          <div className="text-center">
            <p>Chargement...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Propriété non trouvée</h1>
            <Link to="/immobilier">
              <Button>Retour à la liste</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <Link to="/immobilier" className="inline-flex items-center mb-8 hover:text-primary">
          <ArrowLeft className="mr-2" />
          Retour à la liste
        </Link>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <>
                  <img
                    src={property.images[currentImageIndex]}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {property.images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={previousImage}
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="bg-black/50 text-white px-2 py-1 rounded text-sm">
                        {currentImageIndex + 1} / {property.images.length}
                      </span>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={nextImage}
                        disabled={currentImageIndex === property.images.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  Pas d'image disponible
                </div>
              )}
            </div>
            
            {property.images && property.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Miniature ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-playfair font-bold mb-4">{property.title}</h1>
            <p className="text-2xl font-bold text-primary mb-4">
              {formatPrice(property.price)}
            </p>
            <div className="space-y-4 mb-8">
              <p><strong>Type d'annonce:</strong> {property.type}</p>
              <p><strong>Type de bien:</strong> {property.property_type}</p>
              <p><strong>Localisation:</strong> {property.location}</p>
              <p><strong>Surface:</strong> {property.surface}m²</p>
              <p><strong>Nombre de pièces:</strong> {property.rooms || "Non spécifié"}</p>
              {property.architecture_style && (
                <p><strong>Style architectural:</strong> {property.architecture_style}</p>
              )}
              <p><strong>Description:</strong></p>
              <p className="text-muted-foreground">{property.description}</p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Demander une visite</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Demande de visite</DialogTitle>
                  <DialogDescription>
                    Sélectionnez une date et remplissez le formulaire pour demander une visite.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Date souhaitée pour la visite</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="full_name">Nom complet</Label>
                    <Input 
                      id="full_name" 
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message (optionnel)</Label>
                    <Textarea 
                      id="message" 
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button 
                    onClick={handleVisitRequest}
                    className="w-full"
                  >
                    Envoyer la demande
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
