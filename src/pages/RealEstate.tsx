import { useState } from "react";
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

interface Property {
  id: number;
  title: string;
  type: "Immeuble" | "Maison" | "Appartement" | "Terrain" | "Bureau";
  status: "À vendre" | "À louer";
  price: number;
  location: string;
  surface: number;
  rooms: number;
  description: string;
  images: string[];
}

const properties: Property[] = [
  {
    id: 1,
    title: "Villa moderne avec piscine",
    type: "Maison",
    status: "À vendre",
    price: 150000000,
    location: "Cocody",
    surface: 350,
    rooms: 5,
    description: "Magnifique villa moderne avec piscine, jardin paysager et vue panoramique.",
    images: ["/placeholder.svg"],
  },
  {
    id: 2,
    title: "Appartement de standing",
    type: "Appartement",
    status: "À louer",
    price: 500000,
    location: "Plateau",
    surface: 120,
    rooms: 3,
    description: "Bel appartement rénové avec vue sur la ville, parking sécurisé.",
    images: ["/placeholder.svg"],
  },
  {
    id: 3,
    title: "Terrain constructible",
    type: "Terrain",
    status: "À vendre",
    price: 75000000,
    location: "Bingerville",
    surface: 1000,
    rooms: 0,
    description: "Grand terrain plat, viabilisé, idéal pour projet immobilier.",
    images: ["/placeholder.svg"],
  },
];

const RealEstate = () => {
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    location: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const filteredProperties = properties.filter((property) => {
    if (filters.type && property.type !== filters.type) return false;
    if (filters.status && property.status !== filters.status) return false;
    if (filters.minPrice && property.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > Number(filters.maxPrice)) return false;
    if (
      filters.location &&
      !property.location.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;
    return true;
  });

  const handleVisitRequest = (propertyId: number) => {
    if (!selectedDate) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date pour la visite.",
        variant: "destructive",
      });
      return;
    }

    // Ici, vous pourriez ajouter l'intégration avec Google Calendar
    toast({
      title: "Demande envoyée",
      description: "Nous vous contacterons rapidement pour confirmer la visite.",
    });
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
            <option value="">Type de bien</option>
            <option value="Immeuble">Immeuble</option>
            <option value="Maison">Maison</option>
            <option value="Appartement">Appartement</option>
            <option value="Terrain">Terrain</option>
            <option value="Bureau">Bureau</option>
          </select>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Status</option>
            <option value="À vendre">À vendre</option>
            <option value="À louer">À louer</option>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardTitle className="text-xl font-playfair">
                    {property.title}
                  </CardTitle>
                  <CardDescription>
                    {property.location} - {property.surface}m² - {property.rooms}{" "}
                    pièces
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-4">
                    {property.status === "À vendre"
                      ? formatPrice(property.price)
                      : `${formatPrice(property.price)}/mois`}
                  </p>
                  <p className="text-muted-foreground">{property.description}</p>
                </CardContent>
                <CardFooter>
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
      </main>
    </div>
  );
};

export default RealEstate;