
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
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

const RealEstate = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    type: "",
    property_type: "",
    minPrice: "",
    maxPrice: "",
    location: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les biens immobiliers: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    if (filters.type && property.type !== filters.type) return false;
    if (filters.property_type && property.property_type !== filters.property_type) return false;
    if (filters.minPrice && property.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > Number(filters.maxPrice)) return false;
    if (
      filters.location &&
      !property.location.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;
    return true;
  });

  const handleVisitRequest = async (propertyId: string) => {
    if (!selectedDate) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date pour la visite.",
        variant: "destructive",
      });
      return;
    }

    // Enregistrer la demande de visite
    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          property_id: propertyId,
          desired_date: selectedDate,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Nous vous contacterons rapidement pour confirmer la visite.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la demande: " + error.message,
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} FCFA`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl font-playfair font-bold text-primary mb-6">
            Nos Biens Immobiliers
          </h1>
          <p className="text-lg text-muted-foreground">
            Découvrez notre sélection de biens à vendre et à louer
          </p>
        </motion.div>

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Input
            placeholder="Localisation"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          />
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">Type d'annonce</option>
            <option value="vente">Vente</option>
            <option value="location">Location</option>
          </select>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filters.property_type}
            onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
          >
            <option value="">Type de bien</option>
            <option value="maison">Maison</option>
            <option value="appartement">Appartement</option>
            <option value="terrain">Terrain</option>
            <option value="commerce">Commerce</option>
            <option value="bureau">Bureau</option>
          </select>
          <Input
            type="number"
            placeholder="Prix minimum"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Prix maximum"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
          />
        </div>

        {/* Liste des biens */}
        {isLoading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="relative aspect-video mb-4">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-t-lg flex items-center justify-center">
                          Pas d'image
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl font-playfair">
                      {property.title}
                    </CardTitle>
                    <CardDescription>
                      {property.location} - {property.surface}m² - {property.rooms || 0} pièces
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary mb-4">
                      {formatPrice(property.price)}
                    </p>
                    <p className="text-muted-foreground">{property.description}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Link to={`/immobilier/${property.id}`} className="flex-1">
                      <Button className="w-full" variant="outline">
                        <Eye className="mr-2" />
                        Voir détails
                      </Button>
                    </Link>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1">Demander une visite</Button>
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
                            <Label htmlFor="name">Nom complet</Label>
                            <Input id="name" required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input id="phone" type="tel" required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="message">Message (optionnel)</Label>
                            <Textarea id="message" />
                          </div>
                          <Button 
                            onClick={() => handleVisitRequest(property.id)}
                            className="w-full"
                          >
                            Envoyer la demande
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RealEstate;
