import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
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
import { ArrowLeft } from "lucide-react";

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

const PropertyDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const property = properties.find((p) => p.id === Number(id));

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

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} FCFA`;
  };

  const handleVisitRequest = () => {
    if (!selectedDate) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date pour la visite.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Demande envoyée",
      description: "Nous vous contacterons rapidement pour confirmer la visite.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <Link to="/immobilier" className="inline-flex items-center mb-8 hover:text-primary">
          <ArrowLeft className="mr-2" />
          Retour à la liste
        </Link>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-playfair font-bold mb-4">{property.title}</h1>
            <p className="text-2xl font-bold text-primary mb-4">
              {property.status === "À vendre"
                ? formatPrice(property.price)
                : `${formatPrice(property.price)}/mois`}
            </p>
            <div className="space-y-4 mb-8">
              <p><strong>Type:</strong> {property.type}</p>
              <p><strong>Localisation:</strong> {property.location}</p>
              <p><strong>Surface:</strong> {property.surface}m²</p>
              <p><strong>Pièces:</strong> {property.rooms}</p>
              <p><strong>Description:</strong> {property.description}</p>
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
                  <Button onClick={handleVisitRequest} className="w-full">
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